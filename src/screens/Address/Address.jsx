import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import API from '../../API/API';
import { toast } from 'react-toastify';

import Navbar from '../../components/Home/Navbar';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import { getUserProfile } from '../../API/endpoints';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Address = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        latitude: 20.5937, // Default to India center
        longitude: 78.9629,
        isDefault: false
    });

    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

    useEffect(() => {
        fetchAddresses();
        fetchProfile();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await API.get('/address');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to load addresses');
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

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                );
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        setFormData(prev => ({
            ...prev,
            addressLine1: display_name,
            latitude: latNum,
            longitude: lonNum
        }));
        setMapCenter([latNum, lonNum]);
        setSearchQuery(display_name);
        setShowSuggestions(false);
        
        reverseGeocode(latNum, lonNum);
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const addr = response.data.address;
            setFormData(prev => ({
                ...prev,
                city: addr.city || addr.town || addr.village || prev.city,
                state: addr.state || prev.state,
                postalCode: addr.postcode || prev.postalCode,
                country: addr.country || prev.country,
                addressLine1: response.data.display_name
            }));
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                reverseGeocode(lat, lng);
            },
        });

        return formData.latitude ? (
            <Marker position={[formData.latitude, formData.longitude]} />
        ) : null;
    };

    const MapUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center, 13);
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }, [center, map]);
        return null;
    };

    const MapResizer = () => {
        const map = useMap();
        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 500);
        }, [map]);
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = formData._id 
                ? `/address/${formData._id}` 
                : '/address';
            const method = formData._id ? 'put' : 'post';

            await API[method](url, formData);

            toast.success(`Address ${formData._id ? 'updated' : 'added'} successfully`);

            setIsAdding(false);
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error(error.response?.data?.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await API.delete(`/address/${id}`);
            toast.success('Address deleted');
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleEdit = (address) => {
        setFormData(address);
        setMapCenter([address.latitude, address.longitude]);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phoneNumber: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            latitude: 20.5937,
            longitude: 78.9629,
            isDefault: false
        });
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-[#f3f6ff] font-['Inter']">
            <Navbar />
            
            <div className="flex flex-col lg:flex-row pt-16 lg:pt-24 min-h-screen">
                <ProfileSidebar userData={userData} loading={profileLoading} />

                {/* Main Content */}
                <main className="flex-grow lg:ml-80 p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-8 lg:mb-12">
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-[900] text-slate-900 tracking-tighter mb-2">
                                {isAdding ? 'Manage Address' : 'Saved Addresses'}
                            </h1>
                            <p className="text-sm lg:text-base text-slate-500 font-medium">
                                {isAdding ? 'Fill in the details below to save your address.' : 'Your delivery addresses are listed below.'}
                            </p>
                        </div>
                        {!isAdding && (
                            <button 
                                onClick={() => { resetForm(); setIsAdding(true); }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                                Add New
                            </button>
                        )}
                    </div>

                    {isAdding ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Map Section */}
                            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 overflow-hidden h-[450px] xl:h-[650px] relative">
                                <div className="absolute top-6 left-16 right-6 z-[1000]">
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="Search for your location..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-semibold shadow-xl focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                        
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                                                {suggestions.map((s, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSelectSuggestion(s)}
                                                        className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 text-xs font-medium text-slate-600 flex items-start gap-3"
                                                    >
                                                        <span className="material-symbols-outlined text-blue-600 text-base mt-0.5">location_on</span>
                                                        <span>{s.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
                                    <TileLayer 
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                    <MapUpdater center={mapCenter} />
                                    <MapResizer />
                                </MapContainer>
                            </div>

                            {/* Form Section */}
                            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-8">Address Details</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Address Line 1</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                                            className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            placeholder="Street name, building etc."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.state}
                                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Postal Code</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.country}
                                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                                className="w-full bg-[#f1f5f9] border-none rounded-xl p-4 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox"
                                            id="isDefault"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-semibold text-slate-700 select-none">Set as default address</label>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 items-center">
                                        <button 
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="w-full sm:w-auto h-14 px-10 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm transition-all hover:bg-slate-200 whitespace-nowrap flex items-center justify-center"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto h-14 px-12 bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-100 hover:scale-105 disabled:opacity-50 whitespace-nowrap flex items-center justify-center"
                                        >
                                            {loading ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {addresses.length > 0 ? (
                                addresses.map((addr) => (
                                    <div key={addr._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-blue-50 transition-all relative overflow-hidden">
                                        {addr.isDefault && (
                                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-wider">Default</div>
                                        )}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
                                                <span className="material-symbols-outlined">home_pin</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{addr.fullName}</h4>
                                                <p className="text-xs font-medium text-slate-500">{addr.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                                                {addr.city}, {addr.state} - {addr.postalCode}
                                            </p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{addr.country}</p>
                                        </div>
                                        <div className="flex gap-3 pt-4 border-t border-slate-50">
                                            <button 
                                                onClick={() => handleEdit(addr)}
                                                className="flex-grow py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(addr._id)}
                                                className="w-12 h-12 flex items-center justify-center text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-3xl text-slate-300">location_off</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No addresses found</h3>
                                    <p className="text-slate-500 font-medium max-w-xs mx-auto">Add your first delivery address to get started with your orders.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Address;
