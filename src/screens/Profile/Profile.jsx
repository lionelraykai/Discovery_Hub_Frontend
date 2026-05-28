import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { getUserProfile, updateUserProfile, updateProfileImage } from '../../API/endpoints';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5001';

const Profile = () => {
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState({
        promotions: true,
        updates: true,
        newsletter: false
    });
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        country: '',
        profileImage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                if (response.data.success) {
                    const user = response.data.data;
                    setUserData({
                        userName: user.userName || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        country: user.country || '',
                        profileImage: user.profileImage || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        setSaving(true);
        try {
            const response = await updateProfileImage(formData);
            if (response.data.success) {
                setUserData(prev => ({ ...prev, profileImage: response.data.profileImage }));
                toast.success("Profile image updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast.error(error.response?.data?.message || "Failed to update profile image");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const response = await updateUserProfile(userData);
            if (response.data.success) {
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };


    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={loading} />

                {/* Main Content */}
                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2 lg:mb-4">Account Settings</h1>
                        <p className="text-sm lg:text-base text-slate-500 font-medium">Manage your personal details and security preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Personal Information Column */}
                        <div className="lg:col-span-8 bg-white rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-sm">
                            <div className="flex justify-between items-center mb-8 lg:mb-10">
                                <h2 className="text-lg lg:text-xl font-bold text-slate-900">Personal Information</h2>
                                <button className="text-xs lg:text-sm font-bold text-blue-600">Edit All</button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 mb-8 lg:mb-10">
                                <div className="relative group">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex items-center justify-center">
                                        {userData.profileImage ? (
                                            <img 
                                                src={`${BASE_URL}${userData.profileImage}`} 
                                                alt="Avatar" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold text-slate-400">
                                                {userData.userName ? userData.userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={saving}
                                        className="absolute bottom-0 right-0 w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-xs lg:text-sm">photo_camera</span>
                                    </button>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avatar</h4>
                                    <p className="text-xs lg:text-sm text-slate-500 font-medium max-w-[200px]">Upload a professional photo for your profile. 2MB max.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="userName"
                                        value={userData.userName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-[#f1f5f9] border-none rounded-xl p-3 lg:p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                    <input 
                                        type="text" 
                                        name="country"
                                        value={userData.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter your country"
                                        className="w-full bg-[#f1f5f9] border-none rounded-xl p-3 lg:p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full bg-[#f1f5f9] border-none rounded-xl p-3 lg:p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="phoneNumber"
                                        value={userData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="w-full bg-[#f1f5f9] border-none rounded-xl p-3 lg:p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                      
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row justify-end gap-3 lg:gap-4">
                        <button 
                            disabled={saving}
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto px-10 py-3 lg:py-4 bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={saving || loading}
                            onClick={handleSaveChanges}
                            className="w-full sm:w-auto px-12 py-3 lg:py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
