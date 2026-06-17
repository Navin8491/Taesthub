import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseClient';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);

  // Fetch orders and their split items from Firestore
  const fetchUserOrders = async (userId) => {
    try {
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersList = [];
      
      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data();
        
        // Fetch order items for this order
        const itemsQuery = query(collection(db, 'order_items'), where('orderId', '==', orderData.orderId));
        const itemsSnapshot = await getDocs(itemsQuery);
        const itemsList = [];
        
        itemsSnapshot.forEach((itemDoc) => {
          const itemData = itemDoc.data();
          itemsList.push({
            id: itemData.productId,
            name: itemData.name || '',
            category: itemData.category || '',
            price: itemData.price,
            quantity: itemData.quantity,
            image: itemData.image || '/images/f1.png'
          });
        });

        ordersList.push({
          id: orderData.orderId,
          date: orderData.createdAt,
          total: orderData.totalAmount,
          status: orderData.orderStatus || 'In Preparation',
          billingDetails: orderData.billingDetails || {},
          items: itemsList
        });
      }
      
      // Sort orders descending by date
      ordersList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserOrders(ordersList);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setUserOrders([]);
    }
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore users collection
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = null;
          
          if (userDoc.exists()) {
            const docData = userDoc.data();
            userData = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: docData.name || '',
              firstName: docData.name ? docData.name.split(' ')[0] : 'User',
              lastName: docData.name ? docData.name.split(' ').slice(1).join(' ') : '',
              phone: docData.phone || '',
              address: docData.address || '',
              profilePic: docData.photoURL || null,
              photoURL: docData.photoURL || null,
              rewardPoints: docData.rewardPoints || 340,
              role: docData.role || 'customer',
              createdAt: docData.createdAt,
              updatedAt: docData.updatedAt
            };
          } else {
            // Fallback: Create default profile if not exists
            const name = firebaseUser.displayName || 'User';
            userData = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: name,
              firstName: name.split(' ')[0],
              lastName: name.split(' ').slice(1).join(' '),
              phone: firebaseUser.phoneNumber || '',
              address: '',
              profilePic: null,
              photoURL: null,
              rewardPoints: 340,
              role: 'customer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            // Save to users collection
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              uid: userData.uid,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              photoURL: userData.photoURL,
              role: userData.role,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt
            });
          }
          
          setCurrentUser(userData);
          await fetchUserOrders(firebaseUser.uid);
        } catch (error) {
          console.error("Error fetching user data from Firebase:", error);
          // Fallback to minimal user state on error so app doesn't crash
          setCurrentUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: 'User',
            lastName: '',
            name: 'User',
            phone: '',
            address: '',
            profilePic: null,
            photoURL: null,
            rewardPoints: 340,
            role: 'customer'
          });
          setUserOrders([]);
        }
      } else {
        setCurrentUser(null);
        setUserOrders([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      let message = 'An error occurred during login. Please try again.';
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        message = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again later.';
      }
      return { success: false, message: message };
    }
  };

  const register = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      const name = `${userData.firstName} ${userData.lastName}`.trim();
      const newProfile = {
        uid: firebaseUser.uid,
        name: name,
        email: userData.email,
        phone: userData.phone || '',
        photoURL: null,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save user to users collection in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      
      // Update local state immediately
      setCurrentUser({
        id: firebaseUser.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address || '',
        rewardPoints: 340,
        profilePic: null,
        ...newProfile
      });
      setUserOrders([]);

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      let message = 'An error occurred during registration.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      }
      return { success: false, message: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserOrders([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    try {
      const name = `${updatedData.firstName !== undefined ? updatedData.firstName : currentUser.firstName} ${updatedData.lastName !== undefined ? updatedData.lastName : currentUser.lastName}`.trim();
      
      const updatedUser = {
        ...currentUser,
        name: name,
        firstName: updatedData.firstName !== undefined ? updatedData.firstName : currentUser.firstName,
        lastName: updatedData.lastName !== undefined ? updatedData.lastName : currentUser.lastName,
        phone: updatedData.phone !== undefined ? updatedData.phone : currentUser.phone,
        address: updatedData.address !== undefined ? updatedData.address : currentUser.address,
        photoURL: updatedData.profilePic !== undefined ? updatedData.profilePic : currentUser.photoURL,
        profilePic: updatedData.profilePic !== undefined ? updatedData.profilePic : currentUser.profilePic,
        rewardPoints: updatedData.rewardPoints !== undefined ? updatedData.rewardPoints : currentUser.rewardPoints,
        updatedAt: new Date().toISOString()
      };

      // Exclude mapping states from the users collection save
      const dataToSave = {
        uid: currentUser.uid,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photoURL: updatedUser.photoURL,
        role: updatedUser.role || 'customer',
        address: updatedUser.address,
        rewardPoints: updatedUser.rewardPoints,
        createdAt: currentUser.createdAt || new Date().toISOString(),
        updatedAt: updatedUser.updatedAt
      };

      await setDoc(doc(db, 'users', currentUser.uid), dataToSave, { merge: true });
      setCurrentUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error("Failed to update profile:", error);
      return { success: false, message: error.message || 'Failed to update profile.' };
    }
  };

  const addOrder = async (orderItems, total, billingDetails) => {
    if (!currentUser) return null;

    try {
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // 1. Save to orders (header)
      const orderHeader = {
        orderId: orderId,
        userId: currentUser.uid,
        totalAmount: total,
        paymentStatus: 'Paid',
        orderStatus: 'In Preparation',
        createdAt: new Date().toISOString(),
        billingDetails: billingDetails
      };
      await setDoc(doc(db, 'orders', orderId), orderHeader);
      
      // 2. Save items to order_items (split collection)
      const mappedItems = [];
      for (const item of orderItems) {
        const itemId = `oi-${Math.floor(100000 + Math.random() * 900000)}`;
        const orderItem = {
          orderItemId: itemId,
          orderId: orderId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          category: item.category || '',
          image: item.image || '/images/f1.png'
        };
        await setDoc(doc(db, 'order_items', itemId), orderItem);
        mappedItems.push({
          id: item.id,
          name: item.name,
          category: item.category || '',
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/images/f1.png'
        });
      }

      const newOrder = {
        id: orderId,
        date: orderHeader.createdAt,
        total: total,
        status: orderHeader.orderStatus,
        billingDetails: billingDetails,
        items: mappedItems
      };
      
      // Prepend to local user orders list
      setUserOrders(prevOrders => [newOrder, ...prevOrders]);

      return newOrder;
    } catch (error) {
      console.error("Failed to add order:", error);
      return null;
    }
  };

  const getUserOrders = () => {
    return userOrders;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authLoading,
      login,
      register,
      logout,
      updateProfile,
      addOrder,
      getUserOrders
    }}>
      {authLoading ? (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FAF7F2' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(139,94,60,0.2)', borderTopColor: '#8B5E3C', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export default AuthContext;
