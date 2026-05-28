import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../store/wishlistSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";

const ProductCard = ({id, image, title, category, price, badge, outOfStock, brand, rating }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const isInWishlist = wishlistItems.some(item => item._id === id);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    const resultAction = await dispatch(toggleWishlist(id));
    if (toggleWishlist.fulfilled.match(resultAction)) {
      const success = resultAction.payload.success;
      if (success) {
        toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
      }
    }
  };

  return (
    <motion.article 
      layout
      onClick={() => handleCardClick()} 
      className={`group space-y-4 ${outOfStock ? 'opacity-75' : 'cursor-pointer'}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-500">
        <motion.img
          className={`w-full h-full object-cover transition-transform duration-700 ${!outOfStock && 'group-hover:scale-110'}`}
          alt={title}
          src={image}
          loading="lazy"
        />
        
        {/* Wishlist Heart Icon */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistClick}
          className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isInWishlist 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
            : 'bg-white/90 backdrop-blur-md text-slate-900 opacity-0 group-hover:opacity-100 shadow-xl'
          }`}
        >
          <Heart 
            size={18} 
            fill={isInWishlist ? "currentColor" : "none"} 
            className={isInWishlist ? "animate-pulse" : ""}
          />
        </motion.button>

        {badge && (
          <span className={`absolute top-4 right-4 ${badge === 'New Arrival' ? 'bg-slate-900 text-white' : 'bg-primary text-white'} px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-lg`}>
            {badge}
          </span>
        )}

        {outOfStock ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 border border-slate-200 px-6 py-2.5 rounded-full font-bold text-xs tracking-wider text-slate-900 shadow-sm">
              SOLD OUT
            </span>
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900/90 backdrop-blur text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-2xl"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
          </div>
        )}
      </div>

      <div className="space-y-2 px-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/70">{brand}</p>
            <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-slate-500 text-xs font-medium">{category}</p>
          </div>
          <div className="text-right">
            <span className={`font-bold text-lg ${outOfStock ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
              ${price}
            </span>
          </div>
        </div>
        
        {rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const isFull = i < Math.floor(rating);
                return (
                  <Star 
                    key={i} 
                    size={12} 
                    className={isFull ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} 
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-bold text-slate-500">{rating}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};
 
export default ProductCard;