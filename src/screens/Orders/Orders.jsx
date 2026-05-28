import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { getMyOrders, getUserProfile } from '../../API/endpoints';
import LoadingOverlay from '../../components/Loading/LoadingOverlay';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getMyOrders();
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

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

        fetchOrders();
        fetchProfile();
    }, []);

    if (loading) return <LoadingOverlay message="Loading your orders..." />;

    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={profileLoading} />

                {/* Main Content */}
                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <div className="mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2 lg:mb-4">Order History</h1>
                        <p className="text-sm lg:text-base text-slate-500 font-medium">View and track your recent orders.</p>
                    </div>

                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-3xl text-slate-300">inventory_2</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
                                <p className="text-slate-500 font-medium mb-8">Looks like you haven't placed any orders yet.</p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-all"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div 
                                    key={order._id} 
                                    onClick={() => navigate(`/order/${order._id}`)}
                                    className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6 group-hover:border-blue-100 transition-colors">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">Order #{order._id.slice(-8)}</p>
                                            <p className="text-sm text-slate-600 font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-lg font-black text-slate-900">${order.totalPrice.toFixed(2)}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                                                    <img src={item.image || "https://via.placeholder.com/150"} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">{item.product?.name || 'Unknown Product'}</h4>
                                                    <p className="text-xs font-medium text-slate-500 mt-1">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-slate-900 text-sm">${(item.product?.price || 0).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Orders;
