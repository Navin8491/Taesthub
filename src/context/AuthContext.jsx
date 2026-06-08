import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState({});

  // Initialize local database simulation on mount
  useEffect(() => {
    // 1. Initialize users list if not exists
    let localUsers = localStorage.getItem('tastehub_users');
    if (!localUsers) {
      const defaultUsers = [
        {
          id: 'user-john-doe',
          email: 'john.doe@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1 (555) 123-4567',
          address: '123 Coffee Lane, Brew City, BC 12345',
          profilePic: null,
          rewardPoints: 340
        }
      ];
      localStorage.setItem('tastehub_users', JSON.stringify(defaultUsers));
      localUsers = JSON.stringify(defaultUsers);
    }

    // 2. Initialize orders if not exists
    let localOrders = localStorage.getItem('tastehub_orders');
    if (!localOrders) {
      localStorage.setItem('tastehub_orders', JSON.stringify({}));
      localOrders = '{}';
    }
    setOrders(JSON.parse(localOrders));

    // 3. Recover active user session
    const storedUser = localStorage.getItem('tastehub_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Simulate minor delay for premium loading animation feel
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    // Simulate API network call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const localUsers = JSON.parse(localStorage.getItem('tastehub_users') || '[]');
    const user = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No user found with this email address.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    // Omit password from session
    const sessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      profilePic: user.profilePic,
      rewardPoints: user.rewardPoints
    };

    localStorage.setItem('tastehub_currentUser', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);

    return { success: true };
  };

  const register = async (userData) => {
    // Simulate API network call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const localUsers = JSON.parse(localStorage.getItem('tastehub_users') || '[]');
    const exists = localUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Math.floor(100000 + Math.random() * 900000)}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      address: userData.address || '',
      profilePic: null,
      rewardPoints: 340
    };

    localUsers.push(newUser);
    localStorage.setItem('tastehub_users', JSON.stringify(localUsers));

    // Log the user in immediately
    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      address: newUser.address,
      profilePic: newUser.profilePic,
      rewardPoints: newUser.rewardPoints
    };

    localStorage.setItem('tastehub_currentUser', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);

    return { success: true };
  };

  const logout = async () => {
    // Simulate minor network logout delay
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('tastehub_currentUser');
    setCurrentUser(null);
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    // Simulate minor delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const localUsers = JSON.parse(localStorage.getItem('tastehub_users') || '[]');
    const userIndex = localUsers.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      return { success: false, message: 'User not found in local records.' };
    }

    // Update in local users array
    const updatedUserRecord = {
      ...localUsers[userIndex],
      firstName: updatedData.firstName !== undefined ? updatedData.firstName : localUsers[userIndex].firstName,
      lastName: updatedData.lastName !== undefined ? updatedData.lastName : localUsers[userIndex].lastName,
      phone: updatedData.phone !== undefined ? updatedData.phone : localUsers[userIndex].phone,
      address: updatedData.address !== undefined ? updatedData.address : localUsers[userIndex].address,
      profilePic: updatedData.profilePic !== undefined ? updatedData.profilePic : localUsers[userIndex].profilePic,
      rewardPoints: updatedData.rewardPoints !== undefined ? updatedData.rewardPoints : localUsers[userIndex].rewardPoints
    };

    localUsers[userIndex] = updatedUserRecord;
    localStorage.setItem('tastehub_users', JSON.stringify(localUsers));

    // Update session
    const sessionUser = {
      id: updatedUserRecord.id,
      email: updatedUserRecord.email,
      firstName: updatedUserRecord.firstName,
      lastName: updatedUserRecord.lastName,
      phone: updatedUserRecord.phone,
      address: updatedUserRecord.address,
      profilePic: updatedUserRecord.profilePic,
      rewardPoints: updatedUserRecord.rewardPoints
    };

    localStorage.setItem('tastehub_currentUser', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);

    return { success: true };
  };

  const addOrder = async (orderItems, total, billingDetails) => {
    if (!currentUser) return null;

    // Simulate minor delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      total: total,
      status: 'In Preparation',
      billingDetails: billingDetails,
      items: orderItems
    };

    const userEmail = currentUser.email.toLowerCase();
    const localOrders = JSON.parse(localStorage.getItem('tastehub_orders') || '{}');
    const userOrders = localOrders[userEmail] || [];
    
    const updatedUserOrders = [newOrder, ...userOrders];
    localOrders[userEmail] = updatedUserOrders;

    localStorage.setItem('tastehub_orders', JSON.stringify(localOrders));
    setOrders(localOrders);

    return newOrder;
  };

  const getUserOrders = () => {
    if (!currentUser) return [];
    return orders[currentUser.email.toLowerCase()] || [];
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
