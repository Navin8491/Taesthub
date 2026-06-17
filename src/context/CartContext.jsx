import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // Sync with Firebase Auth state to load user cart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const q = query(collection(db, 'cart_items'), where('cartId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const items = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            items.push({
              id: data.productId,
              name: data.name,
              category: data.category,
              price: data.price,
              quantity: data.quantity,
              image: data.image
            });
          });
          setCartItems(items);
        } catch (error) {
          console.error("Error loading cart items from Firestore:", error);
        }
      } else {
        setUserId(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync local cart edits to Firestore
  const syncCartToFirestore = async (newItems) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    
    try {
      // 1. Calculate total
      const total = newItems.reduce((t, item) => t + (item.price * item.quantity), 0);
      
      // 2. Save cart header
      await setDoc(doc(db, 'cart', uid), {
        cartId: uid,
        userId: uid,
        totalAmount: total,
        updatedAt: new Date().toISOString()
      });

      // 3. Clear existing items and write new ones using a batch operation
      const q = query(collection(db, 'cart_items'), where('cartId', '==', uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      
      // Delete old items
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Write new items
      newItems.forEach((item) => {
        const itemId = `${uid}_${item.id}`;
        batch.set(doc(db, 'cart_items', itemId), {
          cartItemId: itemId,
          cartId: uid,
          userId: uid, // for security rules checks
          productId: item.id,
          name: item.name,
          category: item.category || '',
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/images/f1.png'
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error syncing cart to Firestore:", error);
    }
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      
      if (auth.currentUser) {
        syncCartToFirestore(updated);
      }
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      if (auth.currentUser) {
        syncCartToFirestore(updated);
      }
      return updated;
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(i => {
        if (i.id === id) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      });
      
      if (auth.currentUser) {
        syncCartToFirestore(updated);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (auth.currentUser) {
      syncCartToFirestore([]);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
