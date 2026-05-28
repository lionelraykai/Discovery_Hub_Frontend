import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/cartSlice";
import { fetchWishlist } from "../../store/wishlistSlice";
import { searchProducts, getUserProfile } from "../../API/endpoints";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Loader2, Compass, ShoppingCart, LayoutGrid } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartCount } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  const IMAGE_BASE_URL = "http://localhost:5001";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

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

  const navLinks = [
    { name: "Shop", path: "/", icon: ShoppingCart },
    { name: "Discovery", path: "/discovery", icon: Compass },
    { name: "Categories", path: "/categories", icon: LayoutGrid },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
      ? "bg-white/80 backdrop-blur-xl py-3 shadow-lg shadow-slate-200/20" 
      : "bg-transparent py-5"
    }`}>
      <div className="flex justify-between items-center w-full px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-12">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            CURATED
          </motion.span>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-bold transition-all hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-slate-500"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="h-1 w-1 rounded-full bg-primary mx-auto mt-0.5" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block" ref={searchRef}>
            <div className="relative">
              <input 
                className="w-72 bg-slate-100/50 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 transition-all outline-none font-medium" 
                placeholder="Find something special..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
              {loading && <Loader2 className="absolute right-3.5 top-2.5 text-primary animate-spin" size={18} />}
            </div>
            
            <AnimatePresence>
              {showSuggestions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-3 left-0 right-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] max-h-[400px] overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Products</div>
                      {suggestions.map((product) => (
                        <div 
                          key={product._id}
                          onClick={() => handleSuggestionClick(product._id)}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-50 last:border-0 group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{product.name}</h4>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</p>
                          </div>
                          <span className="text-sm font-black text-slate-900">${product.price?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm font-medium text-slate-500">No products found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 bg-slate-100/50 hover:bg-slate-100 rounded-xl text-slate-900 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {localStorage.getItem("token") ? (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 cursor-pointer border-2 border-transparent hover:border-primary shadow-sm"
                onClick={() => navigate("/profile")}
              >
                <img 
                  alt="User profile" 
                  className="w-full h-full object-cover"
                  src={userData?.profileImage ? `${IMAGE_BASE_URL}${userData.profileImage}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuA17a0D2PeKalSYFuHgDPVYUyrJqT11KoKIrUZXU5Kmbl7BRWRQejzNdWsGWfaTPNDKLmO0KmIqHItY4naqDNjFykrcRzBwO7RvnLyegOH-haifa84Os131KDYB0WGiCfpozeVfe8Nfi1Qx4t2YycJHvpf9pXy-7hXm1FAV0W-_rPDa7isUKmXCLAdjl_6dnW5sd6sJv14nafyBxWbexh4vDEC_-7pjfANkqXRV8Dy7JXzMm1hddEn7i-IamQt5cTDDD7A5jgW1Iec"}
                  onError={(e) => {
                    e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA17a0D2PeKalSYFuHgDPVYUyrJqT11KoKIrUZXU5Kmbl7BRWRQejzNdWsGWfaTPNDKLmO0KmIqHItY4naqDNjFykrcRzBwO7RvnLyegOH-haifa84Os131KDYB0WGiCfpozeVfe8Nfi1Qx4t2YycJHvpf9pXy-7hXm1FAV0W-_rPDa7isUKmXCLAdjl_6dnW5sd6sJv14nafyBxWbexh4vDEC_-7pjfANkqXRV8Dy7JXzMm1hddEn7i-IamQt5cTDDD7A5jgW1Iec";
                  }}
                />
              </motion.div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
              >
                Login
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

