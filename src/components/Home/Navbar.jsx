import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { searchProducts, getUserProfile } from "../../API/endpoints";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const searchRef = useRef(null);

  const IMAGE_BASE_URL = "http://localhost:5001";

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await getUserProfile();
          if (response.data.success) {
            setUserData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching profile for navbar:", error);
        }
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setLoading(true);
        try {
          const response = await searchProducts(searchQuery);
          if (response.data.success) {
            setSuggestions(response.data.products);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSuggestionClick = (productId) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_4px_20px_0px_rgba(21,28,39,0.04)] font-['Inter'] antialiased tracking-tight">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white cursor-pointer" onClick={() => navigate("/")}>CURATED</span>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300 active:scale-95 transition-transform" href="/">Shop</a>
            <a className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1 font-semibold active:scale-95 transition-transform" href="#">Discovery</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300 active:scale-95 transition-transform" href="#">Categories</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block group" ref={searchRef}>
            <input 
              className="w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none" 
              placeholder="Search products..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    <span className="material-symbols-outlined animate-spin mr-2 align-middle">sync</span>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((product) => (
                      <div 
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{product.category}</p>
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">${product.price?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 text-slate-900 dark:text-white hover:text-blue-600 transition-colors active:scale-95"
              onClick={() => navigate("/cart")}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {localStorage.getItem("token") ? (
              <div 
                className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 active:scale-95 transition-transform cursor-pointer border-2 border-transparent hover:border-blue-500"
                onClick={() => navigate("/profile")}
              >
                <img 
                  alt="User profile" 
                  src={userData?.profileImage ? `${IMAGE_BASE_URL}${userData.profileImage}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuA17a0D2PeKalSYFuHgDPVYUyrJqT11KoKIrUZXU5Kmbl7BRWRQejzNdWsGWfaTPNDKLmO0KmIqHItY4naqDNjFykrcRzBwO7RvnLyegOH-haifa84Os131KDYB0WGiCfpozeVfe8Nfi1Qx4t2YycJHvpf9pXy-7hXm1FAV0W-_rPDa7isUKmXCLAdjl_6dnW5sd6sJv14nafyBxWbexh4vDEC_-7pjfANkqXRV8Dy7JXzMm1hddEn7i-IamQt5cTDDD7A5jgW1Iec"}
                  onError={(e) => {
                    e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA17a0D2PeKalSYFuHgDPVYUyrJqT11KoKIrUZXU5Kmbl7BRWRQejzNdWsGWfaTPNDKLmO0KmIqHItY4naqDNjFykrcRzBwO7RvnLyegOH-haifa84Os131KDYB0WGiCfpozeVfe8Nfi1Qx4t2YycJHvpf9pXy-7hXm1FAV0W-_rPDa7isUKmXCLAdjl_6dnW5sd6sJv14nafyBxWbexh4vDEC_-7pjfANkqXRV8Dy7JXzMm1hddEn7i-IamQt5cTDDD7A5jgW1Iec";
                  }}
                />
              </div>
            ) : (
              <button 
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
