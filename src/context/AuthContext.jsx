import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState({});

  const loadUserData = async (authUser) => {
    try {
      // 1. Fetch user profile from public.profiles
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, seed a default one using user metadata
        const firstName = authUser.user_metadata?.first_name || authUser.email.split('@')[0];
        const lastName = authUser.user_metadata?.last_name || '';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email,
            first_name: firstName,
            last_name: lastName,
            phone: authUser.phone || '',
            address: '',
            reward_points: 340
          })
          .select()
          .single();

        if (!insertError) {
          profile = newProfile;
        }
      }

      if (profile) {
        setCurrentUser({
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          address: profile.address,
          profilePic: profile.profile_pic,
          rewardPoints: profile.reward_points
        });

        // 2. Fetch user orders
        const { data: ordersList } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', authUser.id)
          .order('date', { ascending: false });

        if (ordersList) {
          setOrders({
            [authUser.email.toLowerCase()]: ordersList.map(o => ({
              id: o.id,
              date: o.date,
              total: Number(o.total),
              status: o.status,
              billingDetails: o.billing_details,
              items: o.items
            }))
          });
        }
      }
    } catch (err) {
      console.error("Error loading user profile/orders:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserData(session.user);
      } else {
        setAuthLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUserData(session.user);
      } else {
        setCurrentUser(null);
        setOrders({});
        setAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  };

  const register = async (userData) => {
    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      // Add custom profile row
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
          address: userData.address || '',
          reward_points: 340
        });

      if (profileError) {
        return { success: false, message: profileError.message };
      }
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    const payload = {};
    if (updatedData.firstName !== undefined) payload.first_name = updatedData.firstName;
    if (updatedData.lastName !== undefined) payload.last_name = updatedData.lastName;
    if (updatedData.phone !== undefined) payload.phone = updatedData.phone;
    if (updatedData.address !== undefined) payload.address = updatedData.address;
    if (updatedData.profilePic !== undefined) payload.profile_pic = updatedData.profilePic;
    if (updatedData.rewardPoints !== undefined) payload.reward_points = updatedData.rewardPoints;

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', currentUser.id);

    if (error) {
      return { success: false, message: error.message };
    }

    setCurrentUser(prev => ({
      ...prev,
      ...updatedData
    }));

    return { success: true };
  };

  const addOrder = async (orderItems, total, billingDetails) => {
    if (!currentUser) return null;

    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: currentUser.id,
      email: currentUser.email,
      total: total,
      status: 'In Preparation',
      billing_details: billingDetails,
      items: orderItems
    };

    const { error } = await supabase
      .from('orders')
      .insert(newOrder);

    if (error) {
      console.error("Error inserting order in Supabase:", error);
      throw error;
    }

    const mappedOrder = {
      id: newOrder.id,
      date: new Date().toISOString(),
      total: total,
      status: 'In Preparation',
      billingDetails: billingDetails,
      items: orderItems
    };

    const userEmail = currentUser.email.toLowerCase();
    setOrders(prev => {
      const userOrders = prev[userEmail] || [];
      return {
        ...prev,
        [userEmail]: [mappedOrder, ...userOrders]
      };
    });

    return mappedOrder;
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
