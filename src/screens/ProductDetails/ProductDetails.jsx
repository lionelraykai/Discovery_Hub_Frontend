import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart as fetchCartThunk } from '../../store/cartSlice';
import { toggleWishlist as toggleWishlistThunk } from '../../store/wishlistSlice';
import { getProductDetails, addToCart } from '../../API/endpoints';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Truck, 
  ShieldCheck, 
  Zap,
  ArrowLeft,
  Share2,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
 
const ProductDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductDetails(id);
        if (response.data.success) {
          const productData = response.data.product;
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
          }
        } else {
          setError(response.data.message || "Failed to load product.");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.response?.data?.message || "Something went wrong. Please try again later.");
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
 
    if (id) {
      fetchProduct();
    }
  }, [id]);
 
  const handleQtyChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };
 
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      setIsAdding(true);
      const response = await addToCart({ productId: product._id, quantity });
      if (response.status === 200) {
        dispatch(fetchCartThunk());
        toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`, {
          icon: <ShoppingCart size={18} className="text-white" />,
          style: { background: "#6366f1", color: "white" }
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };
 
  const handleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    const resultAction = await dispatch(toggleWishlistThunk(product._id));
    if (toggleWishlistThunk.fulfilled.match(resultAction) && resultAction.payload?.success) {
      toast(isInWishlist ? "Removed from wishlist" : "Added to wishlist", {
        icon: <Heart size={18} fill={!isInWishlist ? "#ef4444" : "none"} className={!isInWishlist ? "text-red-500" : "text-slate-400"} />
      });
    }
  };
 
  const isInWishlist = wishlistItems.some(item => item._id === product?._id);
 
  if (loading) {
    return (
      <div className="product-details-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full"
          />
          <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Loading Masterpiece...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="product-details-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md glass p-12 rounded-[2rem] border-red-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-slate-900">Something went wrong</h2>
          <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }
 
  if (!product) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
 
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="product-details-container max-w-[1440px] mx-auto px-8 pt-10 pb-12"
    >
      <motion.button 
        variants={itemVariants}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to collection
      </motion.button>

      <div className="product-main-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-2xl group">
            {product.countInStock <= 10 && product.countInStock > 0 && (
              <span className="absolute top-6 left-6 z-10 bg-primary/90 backdrop-blur text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                Limited Edition
              </span>
            )}
            <AnimatePresence mode="wait">
              <motion.img 
                key={mainImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </AnimatePresence>
          </div>
          
          <Swiper
            slidesPerView="auto"
            spaceBetween={12}
            freeMode={true}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            modules={[FreeMode]}
            className="w-full pb-4"
          >
            {product.images?.map((img, idx) => (
              <SwiperSlide key={idx} className="!w-auto">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-24 h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    mainImage === img ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100 bg-slate-50'
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>


        </motion.div>
 
        {/* Right: Product Info */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full">
                {product.category} • {product.countInStock > 0 ? 'In Stock' : 'Sold Out'}
              </span>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-slate-300 hover:text-slate-500">
                <Share2 size={20} />
              </motion.button>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.round(product.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.numReviews || 0} Verified Reviews</span>
            </div>
          </motion.div>
 
          <motion.div variants={itemVariants} className="text-4xl font-black text-slate-900">
            ${product.price?.toFixed(2)}
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-slate-500 font-medium leading-relaxed max-w-xl text-lg">
            {product.description}
          </motion.p>
 
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finish</label>
                <div className="flex gap-3">
                  {['#0f172a', '#94a3b8', '#cbd5e1'].map((color, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-full cursor-pointer ring-offset-4 transition-all ${
                        selectedColor === idx ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-slate-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(idx)}
                    />
                  ))}
                </div>
              </div>
  
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <motion.button whileTap={{ scale: 0.8 }} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900" onClick={() => handleQtyChange(-1)}><Minus size={16} /></motion.button>
                  <div className="w-10 text-center font-bold text-slate-900">{quantity}</div>
                  <motion.button whileTap={{ scale: 0.8 }} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900" onClick={() => handleQtyChange(1)}><Plus size={16} /></motion.button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
                whileTap={{ scale: 0.98 }}
                className={`flex-grow h-16 bg-primary text-white rounded-[1.25rem] font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/25 transition-all ${isAdding ? 'opacity-80' : ''}`}
                disabled={product.countInStock === 0 || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    <span>{product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
                  </>
                )}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, backgroundColor: "#fef2f2" }}
                className={`w-16 h-16 rounded-[1.25rem] border-2 flex items-center justify-center transition-all ${
                  isInWishlist ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-500/10' : 'border-slate-100 text-slate-300 hover:text-red-400 hover:border-red-100'
                }`}
                onClick={handleWishlist}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </motion.button>
            </div>
          </motion.div>
 
          <motion.div variants={itemVariants} className="flex gap-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <Truck size={20} className="text-primary" />
              Free Shipping
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={20} className="text-primary" />
              2-Year Warranty
            </div>
          </motion.div>
        </div>
      </div>
 
      {/* Tech Specs Section */}
      <AnimatePresence>
        {product.features && product.features.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 space-y-8"
          >
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Craftsmanship</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Technical Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.features.map((feature, idx) => {
                const isString = typeof feature === 'string';
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -10 }}
                    className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-6 hover:shadow-2xl transition-all"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg text-primary">
                      <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{isString ? feature : feature.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {isString ? "High-quality engineering and premium materials ensure long-lasting performance and aesthetic excellence." : feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </motion.div>
  );
};
 

export default ProductDetails;