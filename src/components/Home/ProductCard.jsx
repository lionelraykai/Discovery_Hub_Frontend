import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";

const ProductCard = ({id, image, title, category, price, badge, outOfStock, brand, rating }) => {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlist();

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
    const success = await toggleWishlist(id);
    if (success) {
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    }
  };

  return (
    <article onClick={() => handleCardClick()} className={`group space-y-4 ${outOfStock ? 'opacity-75' : 'cursor-pointer'}`}>
      <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden relative group-hover:shadow-xl transition-all duration-500">
        <img
          className={`w-full h-full object-cover transition-transform duration-700 ${!outOfStock && 'group-hover:scale-105'}`}
          alt={title}
          src={image}
        />
        
        {/* Wishlist Heart Icon */}
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isInWishlist 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 backdrop-blur-sm text-slate-900 opacity-0 group-hover:opacity-100'
          }`}
        >
          <span className={`material-symbols-outlined text-xl ${isInWishlist ? 'text-fill-1' : ''}`} style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>

        {badge && (
          <span className={`absolute top-4 right-4 ${badge === 'New Arrival' ? 'bg-on-surface text-surface' : 'bg-secondary text-on-secondary'} px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase`}>
            {badge}
          </span>
        )}
        {outOfStock ? (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white px-6 py-2 rounded-full font-bold text-sm tracking-tighter shadow-sm text-slate-900">
              OUT OF STOCK
            </span>
          </div>
        ) : (
          <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-slate-900 py-3 rounded-lg font-bold translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
            Add to Cart
          </button>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60">{brand}</p>
            <h3 className="font-bold text-lg text-on-surface leading-tight">{title}</h3>
            <p className="text-on-surface-variant text-sm">{category}</p>
          </div>
          <span className={`font-bold text-lg ${outOfStock ? 'text-outline line-through' : 'text-primary'}`}>
            ${price}
          </span>
        </div>
        {rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-outlined text-xs ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400 text-fill-1' : 'text-outline'}`} style={{ fontVariationSettings: i < Math.floor(rating) ? "'FILL' 1" : "'FILL' 0" }}>
                  star
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant">{rating}</span>
          </div>
        )}
      </div>
    </article>
  );
};
 
export default ProductCard;