import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  User, Mail, Phone, MapPin, Edit, Save, LogOut, Check,
  Camera, Award, ShoppingBag, CreditCard, Heart, Settings, Star,
  Home, RefreshCw, ChevronRight, Activity, Calendar, Copy, CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, logout, getUserOrders } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Interactive triggers
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Settings overlay state
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Stats counting states (GSAP targeted)
  const [ordersCount, setOrdersCount] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Copied state tracker
  const [copiedCoupon, setCopiedCoupon] = useState('');

  // Favorites dummy data
  const favoriteItems = [
    { id: 1, name: "Delicious Pizza", category: "pizza", price: 20, rating: 4.9, image: "/images/f1.png" },
    { id: 2, name: "Delicious Burger", category: "burger", price: 15, rating: 4.8, image: "/images/f2.png" },
    { id: 4, name: "Delicious Pasta", category: "pasta", price: 18, rating: 4.7, image: "/images/f4.png" },
    { id: 5, name: "French Fries", category: "fries", price: 10, rating: 4.5, image: "/images/f5.png" }
  ];

  // Timeline events dummy data
  const timelineEvents = [
    { id: 1, type: "Order Completed", desc: "Order #ORD-92813 delivered by TasteHub Courier", date: "June 01, 2026", icon: ShoppingBag, color: "bg-emerald-500" },
    { id: 2, type: "Reward Earned", desc: "Accumulated 190 points from Double Points Monday campaign", date: "May 25, 2026", icon: Award, color: "bg-amber-500" },
    { id: 3, type: "Favorite Added", desc: "Added 'Delicious Pizza' to your gourmet list", date: "May 20, 2026", icon: Heart, color: "bg-red-500" },
    { id: 4, type: "Profile Updated", desc: "Phone number updated to secure two-factor auth validation", date: "May 18, 2026", icon: User, color: "bg-blue-500" }
  ];

  // Pre-fill fields on mount
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setAvatarBase64(currentUser.profilePic || '');
    }
  }, [currentUser, navigate]);

  // GSAP Animations
  useEffect(() => {
    if (!currentUser) return;

    const ordersList = getUserOrders();
    const actualOrdersCount = ordersList.length;
    const actualSpent = ordersList.reduce((acc, curr) => acc + curr.total, 0);
    const actualPoints = Math.floor(actualSpent * 5) || 340;
    const actualFavorites = favoriteItems.length;

    // 1. Stats Counter Animation
    const counterObj = { orders: 0, spent: 0, points: 0, favorites: 0 };
    gsap.to(counterObj, {
      orders: actualOrdersCount,
      spent: actualSpent,
      points: actualPoints,
      favorites: actualFavorites,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        setOrdersCount(Math.floor(counterObj.orders));
        setSpentAmount(Number(counterObj.spent.toFixed(2)));
        setRewardPoints(Math.floor(counterObj.points));
        setFavoritesCount(Math.floor(counterObj.favorites));
      }
    });

    // 2. Profile Avatar Scale-in
    gsap.fromTo('.avatar-container-outer',
      { scale: 0.2, opacity: 0, rotate: -15 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.6)' }
    );

    // 3. Stagger Reveal for sections
    gsap.fromTo('.stagger-card-up',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
    );

    // 4. Background Floating Food Icons loop
    gsap.fromTo('.floating-food-icon',
      { y: 0, rotate: 0 },
      {
        y: 'random(-25, 25)',
        rotate: 'random(-45, 45)',
        duration: 'random(3.5, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2
      }
    );
  }, [currentUser]);

  if (!currentUser) return null;

  // Handle avatar selection
  const handleAvatarSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size exceeds 2MB limit', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAvatarBase64(base64String);
        await updateProfile({ profilePic: base64String });
        showToast('Avatar picture successfully updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        address
      });
      setSaving(false);
      if (res.success) {
        setIsEditing(false);
        showToast('Changes saved to profile!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      setSaving(false);
      showToast(err.message || 'An error occurred while saving profile', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const handleReorderItem = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image
    });
    showToast(`${item.name} added to your cart!`, 'success');
  };

  // Reorders whole orders from list
  const handleReorderAll = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image
      });
    });
    showToast(`All items from ${order.id} added to cart!`, 'success');
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  const scrollToAnchor = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const ordersList = getUserOrders();

  return (
    <section className="min-h-screen bg-[#FAF7F2] py-12 pt-24 font-sans text-gray-800 antialiased selection:bg-[#D4A373]/30">
      <div className="mx-auto max-w-6xl px-4 md:px-8">

        {/* =========================================
            PROFILE HERO SECTION
           ========================================= */}
        <div className="stagger-card-up overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B5E3C] via-[#9F7250] to-[#D4A373] shadow-xl border border-white/10 relative mb-8">

          {/* Decorative Floating SVG Background Food Items */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-15">
            <svg className="floating-food-icon absolute top-6 left-12 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <svg className="floating-food-icon absolute bottom-8 right-24 w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12h20M12 2v20M12 2a10 10 0 0110 10M12 22a10 10 0 0010-10" />
            </svg>
            <svg className="floating-food-icon absolute top-1/2 right-12 w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h18v18H3z" />
            </svg>
            <svg className="floating-food-icon absolute bottom-12 left-1/4 w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>

          <div className="relative z-10 px-6 py-10 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">

              {/* Profile image with camera upload option */}
              <div className="avatar-container-outer relative group cursor-pointer" onClick={handleAvatarSelect}>
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/60 bg-[#FAF7F2] flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105">
                  {avatarBase64 ? (
                    <img src={avatarBase64} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={60} className="text-[#8B5E3C]" />
                  )}
                </div>

                {/* Photo Edit Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/40 border-4 border-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <Camera className="text-white" size={24} />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Account Text info */}
              <div className="mt-2 text-white">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                    {currentUser.firstName} {currentUser.lastName}
                  </h1>
                </div>

                <div className="text-sm font-medium text-white/85 mb-3">
                  Gold TasteHub Member • Since Oct 2025
                </div>

                {/* Badges block */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white font-semibold text-xs py-1 px-3.5 rounded-full border border-white/10 shadow-sm transition-transform hover:scale-105 duration-200">
                    ⭐ Premium Member
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white font-semibold text-xs py-1 px-3.5 rounded-full border border-white/10 shadow-sm transition-transform hover:scale-105 duration-200">
                    🍕 Pizza Lover
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white font-semibold text-xs py-1 px-3.5 rounded-full border border-white/10 shadow-sm transition-transform hover:scale-105 duration-200">
                    🔥 Frequent Guest
                  </span>
                </div>
              </div>

            </div>

            {/* Profile Level Indicators */}
            <div className="flex flex-col items-center md:items-end text-white text-center md:text-right w-full md:w-auto">
              <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg w-full max-w-sm">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Next Level Progress</span>
                  <span className="text-[#F4B860] font-bold">{rewardPoints} / 500 Pts</span>
                </div>
                <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F4B860] to-yellow-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (rewardPoints / 500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-white/80 font-medium">
                  <span>Loyalty Level: Gold VIP</span>
                  <span>{500 - rewardPoints > 0 ? `${500 - rewardPoints} pts to Platinum` : "Platinum unlocked!"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================
            STATISTICS SECTION (WITH SPARKLINE GRAPHS)
           ========================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Card 1: Total Orders */}
          <div className="stagger-card-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight block">{ordersCount}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase mt-0.5 block">Total Orders</span>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#8B5E3C]">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] text-[#8B5E3C] font-bold">+12% this month</span>
              <svg className="w-16 h-6 text-[#8B5E3C]/60" viewBox="0 0 60 20">
                <path d="M0,15 L10,12 L20,16 L30,8 L40,11 L50,5 L60,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="stagger-card-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight block">${spentAmount}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase mt-0.5 block">Total Spent</span>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <CreditCard size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] text-emerald-600 font-bold">+8% growth trend</span>
              <svg className="w-16 h-6 text-emerald-600/60" viewBox="0 0 60 20">
                <path d="M0,18 L12,14 L24,15 L36,10 L48,8 L60,4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Reward Points */}
          <div className="stagger-card-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight block">{rewardPoints}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase mt-0.5 block">Reward Points</span>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-[#D4A373]">
                <Award size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] text-[#D4A373] font-bold">VIP Points Active</span>
              <svg className="w-16 h-6 text-[#D4A373]/60" viewBox="0 0 60 20">
                <path d="M0,15 L15,14 L30,8 L45,10 L60,3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 4: Saved Favorites */}
          <div className="stagger-card-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight block">{favoritesCount}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase mt-0.5 block">Saved Favorites</span>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <Heart size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] text-red-500 font-bold">Top dishes saved</span>
              <svg className="w-16 h-6 text-red-500/60" viewBox="0 0 60 20">
                <path d="M0,10 L15,10 L30,5 L45,12 L60,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

        </div>

        {/* =========================================
            MAIN GRID SECTION
           ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR COLUMN: QUICK ACTIONS & LOYALTY CARD */}
          <div className="stagger-card-up flex flex-col gap-6">

            {/* Quick Actions Description Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/85">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Navigation</h4>

              <div className="flex flex-col gap-3">
                {/* Action Card: Edit Profile */}
                <button
                  onClick={() => { setIsEditing(true); scrollToAnchor('edit-details-form'); }}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#FAF7F2] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#8B5E3C] flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[14.5px] text-gray-800 group-hover:text-[#8B5E3C] transition-colors leading-tight">Edit Profile</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">Update contact info, billing details, and physical address.</p>
                  </div>
                </button>

                {/* Action Card: Settings */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#FAF7F2] text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4A373] flex-shrink-0">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[14.5px] text-gray-800 group-hover:text-[#8B5E3C] transition-colors leading-tight">Preferences</h5>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">Manage notification triggers, email campaigns, and auth setup.</p>
                  </div>
                </button>

                {/* Action Card: Logout */}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-red-50 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                    <LogOut size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[14.5px] text-red-500 group-hover:text-red-700 transition-colors leading-tight">Logout Account</h5>
                    <p className="text-xs text-red-400 mt-1 leading-snug">Safely sign out from TasteHub app on this device.</p>
                  </div>
                </button>
              </div>

              {/* Inline settings expand overlay panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 pt-4 mt-4 overflow-hidden"
                  >
                    <h5 className="text-[13.5px] font-bold text-gray-800 mb-3">Settings Panel</h5>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-500">
                        <span>SMS Notification Alerts</span>
                        <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="rounded text-[#8B5E3C] focus:ring-[#8B5E3C]" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-500">
                        <span>Email Promotions</span>
                        <input type="checkbox" checked={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} className="rounded text-[#8B5E3C] focus:ring-[#8B5E3C]" />
                      </label>
                      <button onClick={() => { setShowSettings(false); showToast('Settings applied!', 'info'); }} className="btn text-white w-full py-1.5 rounded-lg text-xs font-bold bg-[#8B5E3C] hover:bg-[#724c30]">
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LOYALTY REWARDS & DISCOUNT COUPONS CARD */}
            <div className="bg-gradient-to-br from-[#8B5E3C] to-[#D4A373] rounded-2xl p-6 shadow-md border border-white/10 text-white relative overflow-hidden">
              {/* Overlay graphics */}
              <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Loyalty Benefits</h4>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-white/85 block">Current Balance</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">{rewardPoints} Points</span>
                </div>
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-[#F4B860]" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-white/90 mb-1.5">
                  <span>Free Delivery Status</span>
                  <span className="text-[#F4B860] font-bold uppercase">Active VIP</span>
                </div>
                <p className="text-[11px] text-white/75 leading-relaxed">As a Gold Level Member, you enjoy complimentary priority shipping on every order over $15!</p>
              </div>

              <hr className="border-white/15 my-4" />

              {/* Coupons List */}
              <div>
                <h5 className="text-[12px] font-bold text-white/95 uppercase mb-3">Copy Promo Coupons</h5>
                <div className="flex flex-col gap-2.5">
                  {/* Coupon 1 */}
                  <div className="flex justify-between items-center bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                    <div>
                      <span className="font-extrabold text-sm block">TASTE50</span>
                      <span className="text-[10px] text-white/80 leading-none">50% off next order</span>
                    </div>
                    <button
                      onClick={() => copyCouponCode('TASTE50')}
                      className="bg-white hover:bg-[#FAF7F2] text-[#8B5E3C] font-extrabold py-1 px-3 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-colors duration-200"
                    >
                      {copiedCoupon === 'TASTE50' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedCoupon === 'TASTE50' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Coupon 2 */}
                  <div className="flex justify-between items-center bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                    <div>
                      <span className="font-extrabold text-sm block">FREEBREW</span>
                      <span className="text-[10px] text-white/80 leading-none">Free Cold Brew coffee</span>
                    </div>
                    <button
                      onClick={() => copyCouponCode('FREEBREW')}
                      className="bg-white hover:bg-[#FAF7F2] text-[#8B5E3C] font-extrabold py-1 px-3 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-colors duration-200"
                    >
                      {copiedCoupon === 'FREEBREW' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedCoupon === 'FREEBREW' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT CONTENT WORKSPACE: PROFILE FORM, ORDERS, TIMELINE, SLIDER */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* PROFILE FORM (FROSTED GLASS CARD) */}
            <div id="edit-details-form" className="stagger-card-up glass-effect rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-[#D4A373]/10 blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#8B5E3C]">
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn text-white bg-[#8B5E3C] hover:bg-[#724c30] rounded-full px-5 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors duration-200"
                    >
                      <Edit size={14} /> Update Form
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* First Name */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block py-3 px-0 w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#8B5E3C] peer disabled:text-gray-500 disabled:border-transparent transition-all duration-300"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-semibold absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#8B5E3C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                        First Name
                      </label>
                    </div>

                    {/* Last Name */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block py-3 px-0 w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#8B5E3C] peer disabled:text-gray-500 disabled:border-transparent transition-all duration-300"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-semibold absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#8B5E3C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                        Last Name
                      </label>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">

                    {/* Email */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block py-3 px-0 w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#8B5E3C] peer disabled:text-gray-500 disabled:border-transparent transition-all duration-300"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-semibold absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#8B5E3C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                        Email Address
                      </label>
                    </div>

                    {/* Phone */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block py-3 px-0 w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#8B5E3C] peer disabled:text-gray-500 disabled:border-transparent transition-all duration-300"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-semibold absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#8B5E3C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                        Phone Number
                      </label>
                    </div>

                  </div>

                  {/* Delivery Address */}
                  <div className="relative z-0 w-full group mt-2">
                    <textarea
                      disabled={!isEditing}
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block py-3 px-0 w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#8B5E3C] peer disabled:text-gray-500 disabled:border-transparent transition-all duration-300 resize-none"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-semibold absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#8B5E3C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                      Delivery Address
                    </label>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <motion.button
                        type="submit"
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn text-white bg-gradient-to-r from-[#8B5E3C] to-[#D4A373] rounded-full px-8 py-3 text-sm font-extrabold shadow-md flex items-center gap-2"
                      >
                        {saving ? (
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                          <>
                            <Save size={16} /> Save Changes
                          </>
                        )}
                      </motion.button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn bg-gray-200/80 hover:bg-gray-200 text-gray-700 rounded-full px-8 py-3 text-sm font-extrabold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                </form>
              </div>
            </div>

            {/* RECENT ORDERS (CARDS SYSTEM - NO TABLES) */}
            <div id="recent-orders-list" className="stagger-card-up bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity History</h3>
                <Link to="/orders" className="text-xs font-bold text-[#8B5E3C] hover:text-[#D4A373] flex items-center gap-0.5">
                  View full history <ChevronRight size={14} />
                </Link>
              </div>

              {ordersList.length === 0 ? (
                <div className="text-center py-6 text-gray-400 font-medium">
                  You haven't ordered yet. Items will show here once checked out.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {ordersList.slice(0, 3).map((order) => {
                    const firstItem = order.items[0];
                    const itemsSummary = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');

                    let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    if (order.status.toLowerCase() === 'preparing' || order.status.toLowerCase() === 'in preparation') {
                      badgeBg = 'bg-amber-50 text-amber-700 border-amber-100';
                    } else if (order.status.toLowerCase() === 'cancelled') {
                      badgeBg = 'bg-red-50 text-red-700 border-red-100';
                    }

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#8B5E3C]/20 hover:shadow-md transition-all duration-300 gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={firstItem?.image || "/images/f1.png"}
                            alt="Order food"
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900 text-[14.5px]">
                              {firstItem?.name || "Artisanal Coffee"}
                              {order.items.length > 1 && ` + ${order.items.length - 1} items`}
                            </div>
                            <div className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1">
                              <Calendar size={12} /> {formatDate(order.date)} • {order.id}
                            </div>
                            <div className="text-xs text-gray-500 font-medium mt-1 truncate max-w-xs sm:max-w-sm">
                              {itemsSummary}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 gap-2.5">
                          <span className="font-extrabold text-[#8B5E3C] text-[16px]">${order.total.toFixed(2)}</span>
                          <span className={`text-[11px] font-bold py-1 px-3.5 rounded-full border uppercase tracking-wider ${badgeBg}`}>
                            {order.status}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="text-xs font-bold text-[#8B5E3C] hover:text-[#D4A373] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-100 transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleReorderAll(order)}
                              className="text-xs font-bold text-white bg-[#8B5E3C] hover:bg-[#724c30] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <RefreshCw size={11} /> Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FAVORITE FOODS SLIDER */}
            <div id="favorites-slider-section" className="stagger-card-up bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-5">Your Favorites</h3>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[195px] w-[195px] bg-[#FAF7F2]/40 hover:bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#8B5E3C]/15 hover:shadow-lg transition-all duration-300 snap-start flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image zoom on hover */}
                      <div className="w-full h-28 overflow-hidden rounded-xl bg-gray-100 relative mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white/95 py-0.5 px-2.5 rounded-full shadow-sm text-[10px] font-bold text-[#D4A373] flex items-center gap-0.5">
                          <Star size={11} fill="currentColor" /> {item.rating}
                        </div>
                      </div>

                      <h5 className="font-extrabold text-[14.5px] text-gray-900 leading-tight">
                        {item.name}
                      </h5>
                      <span className="text-[11px] font-semibold text-gray-400 capitalize block mt-0.5">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="font-extrabold text-[#8B5E3C] text-[16px]">${item.price.toFixed(2)}</span>

                      <button
                        onClick={() => handleReorderItem(item)}
                        className="bg-[#8B5E3C] hover:bg-[#724c30] text-white p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                      >
                        <RefreshCw size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACCOUNT ACTIVITY TIMELINE */}
            <div id="activity-timeline" className="stagger-card-up bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Activity Timeline</h3>

              <div className="relative pl-6 border-l-2 border-dashed border-gray-100 flex flex-col gap-6">
                {timelineEvents.map((event) => {
                  const EventIcon = event.icon;
                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline Dot Icon */}
                      <span className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full ${event.color} text-white flex items-center justify-center border-4 border-[#FAF7F2] shadow-sm`}>
                        <EventIcon size={12} />
                      </span>

                      <div>
                        <span className="text-xs text-gray-400 font-bold block">{event.date}</span>
                        <h5 className="font-extrabold text-[14.5px] text-gray-800 mt-1">{event.type}</h5>
                        <p className="text-xs text-gray-500 mt-1 leading-snug">{event.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          STICKY BOTTOM NAVIGATION (MOBILE)
         ========================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-gray-200/50 shadow-2xl px-6 py-2.5 flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8B5E3C] transition-colors">
          <Home size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">Home</span>
        </Link>
        <button onClick={() => { setIsEditing(true); scrollToAnchor('edit-details-form'); }} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8B5E3C] transition-colors">
          <User size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">Details</span>
        </button>
        <button onClick={() => scrollToAnchor('recent-orders-list')} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8B5E3C] transition-colors">
          <ShoppingBag size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">Orders</span>
        </button>
        <button onClick={() => scrollToAnchor('favorites-slider-section')} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8B5E3C] transition-colors">
          <Heart size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">Favs</span>
        </button>
        <button onClick={() => scrollToAnchor('activity-timeline')} className="flex flex-col items-center justify-center text-gray-400 hover:text-[#8B5E3C] transition-colors">
          <Activity size={20} />
          <span className="text-[9px] font-bold uppercase mt-1">History</span>
        </button>
      </div>

      {/* =========================================
          ORDER DETAILS POPUP MODAL
         ========================================= */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#8B5E3C]">Order Details</h4>
                  <span className="text-xs text-gray-400 font-semibold">{selectedOrderDetails.id}</span>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold"
                >
                  X
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="flex flex-col gap-3 pr-2">
                  {selectedOrderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <span className="font-bold text-xs block text-gray-800">{item.name}</span>
                          <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#8B5E3C]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100" />

                <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                  <span>Subtotal</span>
                  <span>${(selectedOrderDetails.total - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold text-[#8B5E3C]">
                  <span>Total Amount</span>
                  <span>${selectedOrderDetails.total.toFixed(2)}</span>
                </div>

                <hr className="border-gray-100" />

                <div className="text-[11px] text-gray-500">
                  <span className="font-bold block text-gray-700">Delivery Address:</span>
                  {selectedOrderDetails.billingDetails.address}
                </div>
              </div>

              <button
                onClick={() => { handleReorderAll(selectedOrderDetails); setSelectedOrderDetails(null); }}
                className="btn w-full text-white bg-[#8B5E3C] hover:bg-[#724c30] rounded-xl py-3 mt-5 font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} /> Reorder All Items
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '90px', // Raised higher for mobile bottom bar
              right: '30px',
              backgroundColor: '#FFFFFF',
              color: '#1E1E1E',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Poppins', sans-serif",
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: toastType === 'error' ? '#FDF2F2' : '#EBFBEE',
              borderRadius: '50%',
              padding: '6px'
            }}>
              {toastType === 'error' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DE3434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <Check color="#28a745" size={16} />
              )}
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E', display: 'block' }}>
                {toastType === 'error' ? 'Action Failed' : 'Success'}
              </span>
              <span style={{ fontSize: '12px', color: '#777' }}>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

export default Profile;
