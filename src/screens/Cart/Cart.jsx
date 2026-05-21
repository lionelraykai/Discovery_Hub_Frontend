import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, addToCart, getAddresses, getPaymentMethods } from '../../API/endpoints';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';
import CartItem from '../../components/Cart/CartItem';
import AddressSection from '../../components/Cart/AddressSection';
import OrderSummary from '../../components/Cart/OrderSummary';
import { useCart } from '../../context/CartContext';
import ConfirmModal from '../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/Loading/LoadingOverlay';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [activeAddress, setActiveAddress] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { clearAll } = useCart();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data);
      if (response.data.length > 0) {
        const defaultAddr = response.data.find(addr => addr.isDefault) || response.data[0];
        setActiveAddress(defaultAddr._id);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const handleUpdateQty = async (productId, newQty) => {
    // If no productId is provided, just refresh the cart
    if (productId === undefined) {
      fetchCart();
      return;
    }

    if (newQty < 0) return;
    try {
      setUpdating(true);
      const response = await addToCart({ productId, quantity: newQty });
      if (response.status === 200) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    setIsClearModalOpen(false);
    try {
        setUpdating(true);
        await clearAll();
        fetchCart();
    } catch (err) {
        console.error("Error clearing cart:", err);
    } finally {
        setUpdating(false);
    }
  };

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  if (loading) {
    return <LoadingOverlay message="Curating your selection..." />;
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
            <h1 className="cart-title">Shopping Bag</h1>
            {cart?.items?.length > 0 && (
                <button className="clear-cart-btn" onClick={() => setIsClearModalOpen(true)}>
                    <span className="material-symbols-outlined">delete_sweep</span>
                    Clear Bag
                </button>
            )}
        </div>
        
        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className="empty-cart">
            <div className="empty-cart-visual">
                <div className="empty-cart-bg-circle"></div>
                <div className="empty-cart-icon-container">
                    <span className="material-symbols-outlined">shopping_bag</span>
                </div>
            </div>
            <h2 className="empty-cart-title">Your bag is empty</h2>
            <p className="empty-cart-description">Intentional design starts with a single piece. Explore our curated selection and find something that speaks to your unique style.</p>
            <Link to="/" className="explore-collection-btn">
                Explore Collection
                <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Left Column */}
            <div className="cart-main-column">
              <div className="cart-items-list">
                {cart.items.map((item) => (
                  <CartItem 
                    key={item._id} 
                    item={item} 
                    updating={updating} 
                    onUpdateQty={handleUpdateQty} 
                  />
                ))}
              </div>

              <AddressSection 
                addresses={addresses}
                activeAddress={activeAddress} 
                onAddressChange={setActiveAddress} 
              />

            </div>

            {/* Right Column */}
            <OrderSummary 
              subtotal={subtotal}
              shipping={shipping}
              estimatedTax={estimatedTax}
              total={total}
              buttonText="PROCEED TO PAYMENT"
              onAction={() => navigate('/payment', { state: { addressId: activeAddress } })}
            />
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isClearModalOpen}
        title="Clear Entire Bag?"
        message="Are you sure you want to remove all items from your shopping bag? This action cannot be undone."
        onConfirm={handleClearCart}
        onCancel={() => setIsClearModalOpen(false)}
        confirmText="Clear All"
        cancelText="Keep Items"
      />
      <Footer />
    </>
  );
};

export default Cart;
