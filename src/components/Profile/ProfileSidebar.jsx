import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetCart } from '../../store/cartSlice';
import { resetWishlist } from '../../store/wishlistSlice';

const BASE_URL = 'http://localhost:5001';

const ProfileSidebar = ({ userData, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        dispatch(resetCart());
        dispatch(resetWishlist());
        navigate("/login");
    };

    const navItems = [
        { name: 'Profile', path: '/profile', icon: 'person' },
        { name: 'Addresses', path: '/address', icon: 'location_on' },
        { name: 'Wishlist', path: '/wishlist', icon: 'favorite' },
        { name: 'Orders', path: '/orders', icon: 'inventory_2' },
        { name: 'Security', path: '/security', icon: 'shield' },
    ];

    return (
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 p-6 lg:p-8 flex flex-col lg:fixed lg:h-full overflow-y-auto z-10">
            {/* User Mini Profile */}
            <div className="flex items-center gap-4 mb-8 lg:mb-10">
                {userData?.profileImage ? (
                    <img 
                        src={`${BASE_URL}${userData.profileImage}`} 
                        alt={userData.userName} 
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {userData?.userName ? userData.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-slate-900 leading-tight text-sm lg:text-base">
                        {loading ? 'Loading...' : userData?.userName || 'User'}
                    </h3>
                    <p className="text-[10px] lg:text-xs font-semibold text-blue-600">Premium Member</p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button 
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 lg:gap-4 px-4 py-2 lg:py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                                isActive 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg lg:text-xl">{item.icon}</span>
                            <span className="text-sm">{item.name}</span>
                        </button>
                    );
                })}
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 lg:gap-4 px-4 py-2 lg:py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all whitespace-nowrap lg:mt-auto"
                >
                    <span className="material-symbols-outlined text-lg lg:text-xl">logout</span>
                    <span className="text-sm">Sign Out</span>
                </button>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;
