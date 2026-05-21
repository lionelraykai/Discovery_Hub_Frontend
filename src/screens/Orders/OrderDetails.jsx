import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { useCart } from '../../context/CartContext';
import { getOrderById, getUserProfile } from '../../API/endpoints';
import LoadingOverlay from '../../components/Loading/LoadingOverlay';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const [order, setOrder] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrderById(id);
                setOrder(response.data);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError("Could not load order details.");
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

        fetchOrderDetails();
        fetchProfile();
    }, [id]);

    if (loading) return <LoadingOverlay message="Loading order details..." />;
    
    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
                <Navbar />
                <div className="pt-32 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Order not found"}</h2>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-all"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={profileLoading} />

                {/* Main Content */}
                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Orders
                    </button>

                    <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2 lg:mb-4">Order #{order._id.slice(-8)}</h1>
                            <p className="text-sm lg:text-base text-slate-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex gap-3">
                            <div className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                <span className="material-symbols-outlined text-base">{order.isPaid ? 'check_circle' : 'pending'}</span>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                            </div>
                            <div className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                <span className="material-symbols-outlined text-base">{order.isDelivered ? 'local_shipping' : 'inventory_2'}</span>
                                {order.isDelivered ? 'Delivered' : 'Processing'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Items Ordered</h3>
                                <div className="space-y-6">
                                    {order.orderItems.map((item, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => navigate(`/product/${item.product._id}`)}
                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100"
                                        >
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                                <img src={item.image || "https://via.placeholder.com/150"} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 w-full">
                                                <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{item.product?.name || 'Unknown Product'}</h4>
                                                <p className="text-sm font-medium text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                                                <p className="font-black text-slate-900 text-lg">${(item.product?.price || 0).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Details */}
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                        <span>Items Total</span>
                                        <span>${((order.totalPrice || 0) - (order.taxPrice || 0) - (order.shippingPrice || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                        <span>Shipping</span>
                                        <span>${(order.shippingPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                        <span>Tax</span>
                                        <span>${(order.taxPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-900">Total</span>
                                        <span className="text-2xl font-black text-slate-900">${(order.totalPrice || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">location_on</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Shipping Details</h3>
                                </div>
                                <div className="space-y-1 text-sm font-medium text-slate-600 leading-relaxed">
                                    <p className="font-bold text-slate-900 text-base mb-2">{order.shippingAddress?.fullName || order.user?.name || "Customer"}</p>
                                    <p>{order.shippingAddress?.addressLine1}</p>
                                    {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                    <p>{order.shippingAddress?.country}</p>
                                    {order.shippingAddress?.phoneNumber && <p className="mt-2 pt-2 border-t border-slate-50">Phone: {order.shippingAddress.phoneNumber}</p>}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">payments</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
                                </div>
                                <div className="text-sm font-medium text-slate-600">
                                    <p className="font-bold text-slate-900 text-base mb-1">{order.paymentMethod || "Credit Card"}</p>
                                    {order.isPaid ? (
                                        <p className="text-green-600 bg-green-50 px-3 py-1.5 rounded-lg inline-block mt-2 text-xs font-bold uppercase tracking-wider">
                                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                                        </p>
                                    ) : (
                                        <p className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block mt-2 text-xs font-bold uppercase tracking-wider">
                                            Payment Pending
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OrderDetails;
