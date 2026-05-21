import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { changePassword, getUserProfile } from '../../API/endpoints';
import { toast } from 'react-toastify';

const Security = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setIsUpdating(true);
        try {
            const response = await changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            if (response.data.success) {
                toast.success("Password changed successfully");
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={loading} />

                {/* Main Content */}
                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <header className="mb-8 lg:mb-12">
                        <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2 lg:mb-4">Security Settings</h1>
                        <p className="text-sm lg:text-base text-slate-500 font-medium">Manage your account security and password.</p>
                    </header>

                    <div className="max-w-2xl">
                        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">lock_reset</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                                    <input 
                                        required
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                        className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                        <input 
                                            required
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                            className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                                        <input 
                                            required
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                            className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isUpdating}
                                        className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                                Updating...
                                            </>
                                        ) : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Additional Security Info */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Two-Factor Auth</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Add an extra layer of security to your account.</p>
                                    <button className="text-xs font-bold text-blue-600 mt-2 hover:underline">Coming Soon</button>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-xl">devices</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Active Sessions</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">View and manage your active login sessions.</p>
                                    <button className="text-xs font-bold text-blue-600 mt-2 hover:underline">Manage Sessions</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Security;
