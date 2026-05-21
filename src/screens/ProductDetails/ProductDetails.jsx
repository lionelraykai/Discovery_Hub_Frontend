import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetails, addToCart } from '../../API/endpoints';
import LoginRequiredModal from '../../components/LoginRequiredModal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetails.css';
 
const ProductDetails = () => {
  const { id } = useParams();
  const { refreshCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
 
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
        setLoading(false);
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
      const response = await addToCart({ productId: product._id, quantity });
      if (response.status === 200) {
        refreshCart();
        // alert("Product added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    await toggleWishlist(product._id);
  };

  const isInWishlist = wishlistItems.some(item => item._id === product?._id);
 
  if (loading) {
    return (
      <div className="product-details-container">
        <div className="loading-shimmer">Loading product details...</div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="product-details-container">
        <div className="error-state">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">Try Again</button>
        </div>
      </div>
    );
  }
 
  if (!product) return null;
 
  return (
    <div className="product-details-container">
      <div className="product-main-section">
        {/* Left: Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-container">
            {product.countInStock <= 10 && product.countInStock > 0 && (
              <span className="badge-limited">Limited Edition</span>
            )}
            <img src={mainImage} alt={product.name} className="main-image" />
          </div>
          <div className="thumbnail-list">
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`${product.name} thumbnail ${idx}`} />
              </div>
            ))}
          </div>
        </div>
 
        {/* Right: Product Info */}
        <div className="product-info">
          <span className="collection-tag">
            {product.category} • {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-container">
            <div className="stars">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </div>
            <span className="review-count">{product.numReviews || 0} Verified Reviews</span>
          </div>
 
          <div className="product-price">${product.price?.toFixed(2)}</div>
          
          <p className="product-description">{product.description}</p>
 
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <div className="stock-alert">
              <span className="alert-icon">🎁</span>
              ONLY {product.countInStock} LEFT!
            </div>
          )}
 
          <div className="selectors-container">
            <div className="selector-group">
              <label>Finish</label>
              <div className="color-options">
                {['#0f172a', '#94a3b8', '#cbd5e1'].map((color, idx) => (
                  <div
                    key={idx}
                    className={`color-dot ${selectedColor === idx ? 'active' : ''}`}
                    style={{ color: color }}
                    onClick={() => setSelectedColor(idx)}
                  ></div>
                ))}
              </div>
            </div>
 
            <div className="selector-group">
              <label>Quantity</label>
              <div className="quantity-stepper">
                <button className="qty-btn" onClick={() => handleQtyChange(-1)}>−</button>
                <div className="qty-value">{quantity}</div>
                <button className="qty-btn" onClick={() => handleQtyChange(1)}>+</button>
              </div>
            </div>
          </div>
 
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
            >
              <span>🛒</span> {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="btn-secondary" disabled={product.countInStock === 0}>Buy Now</button>
            <button 
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`} 
              onClick={handleWishlist}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          </div>
 
          <div className="policy-links">
            <div className="policy-item">📦 FREE SHIPPING</div>
            <div className="policy-item">🛡️ 2-YEAR WARRANTY</div>
          </div>
        </div>
      </div>
 
      {/* Tech Specs Section */}
      {product.features && product.features.length > 0 && (
        <section className="tech-specs-section">
          <h2 className="specs-title">Technical Specifications</h2>
          <div className="specs-grid">
            {/* Using product tags/features if they exist, or a subset of attributes */}
            {product.features.map((feature, idx) => {
              // Assuming features might be strings based on the model,
              // we'll format them slightly. If they are objects, it's better.
              const isString = typeof feature === 'string';
              return (
                <div key={idx} className="spec-card">
                  <div className="spec-icon">✨</div>
                  <h3>{isString ? feature : feature.title}</h3>
                  <p>{isString ? "High-quality engineering and premium materials ensure long-lasting performance." : feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};
 
export default ProductDetails;