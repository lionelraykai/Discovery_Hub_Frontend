import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { fetchWishlist, toggleWishlist as toggleWishlistThunk } from '../../store/wishlistSlice';
import { fetchCart } from '../../store/cartSlice';
import { addToCart as addToCartAPI, getUserProfile } from '../../API/endpoints';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);
    const [userData, setUserData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                if (response.data.success) {
                    setUserData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await addToCartAPI({ productId: product._id, quantity: 1 });
            if (response.status === 200) {
                dispatch(fetchCart());
                toast.success(`${product.name} added to cart!`);
            }
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error(err.response?.data?.message || "Failed to add to cart.");
        }
    };

    const handleRemove = async (productId) => {
        await dispatch(toggleWishlistThunk(productId));
        toast.info("Removed from wishlist");
    };

    const isLoading = wishlistLoading || profileLoading;

    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={profileLoading} />

                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <header className="mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2 lg:mb-4">My Wishlist</h1>
                        <p className="text-sm lg:text-base text-slate-500 font-medium">Items you've saved for later.</p>
                    </header>

                    {isLoading ? (
                        <div className="wishlist-grid">
                            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer-card"></div>)}
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="empty-wishlist bg-white rounded-2xl lg:rounded-[2.5rem] p-10 lg:p-20 shadow-sm text-center">
                            <div className="empty-icon text-6xl mb-6">❤️</div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
                            <p className="text-slate-500 mb-8 font-medium">Start adding items you love!</p>
                            <button onClick={() => navigate('/')} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-md active:scale-95">Go Shopping</button>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            {wishlistItems.map((product) => (
                                <div key={product._id} className="wishlist-card bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                    <div className="wishlist-card-image relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <button 
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all z-10" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(product._id);
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-xl">close</span>
                                        </button>
                                    </div>
                                    <div className="wishlist-card-content p-6">
                                        <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{product.name}</h3>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">{product.category}</p>
                                        <div className="flex items-center justify-between mt-auto gap-4">
                                            <span className="text-xl font-black text-slate-900">${product.price?.toFixed(2)}</span>
                                            <button 
                                                className="bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors disabled:bg-slate-300" 
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.countInStock === 0}
                                            >
                                                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Wishlist;
