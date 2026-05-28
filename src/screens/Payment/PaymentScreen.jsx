import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartAfterOrder } from '../../store/cartSlice';
import { getPaymentMethods, createOrder, processPayment } from '../../API/endpoints';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';
import PaymentSection from '../../components/Cart/PaymentSection';
import OrderSummary from '../../components/Cart/OrderSummary';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/Loading/LoadingOverlay';
import './PaymentScreen.css';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const addressId = location.state?.addressId;
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);

  const fetchPaymentMethods = async () => {
    try {
      const response = await getPaymentMethods();
      if (response.data.success) {
        setPaymentMethods(response.data.methods);
        if (response.data.methods.length > 0) {
          setActivePaymentMethod(response.data.methods[0].paymentMethodId);
        }
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    }
  };

  useEffect(() => {
    const initPayment = async () => {
      setLoading(true);
      await fetchPaymentMethods();
      setLoading(false);
    };
    initPayment();
  }, []);

  const handlePayment = () => {
    if (!addressId) {
      toast.error("Shipping address is missing. Please go back and select an address.");
      return;
    }
    
    if (!activePaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setLoading(true);
    
    // 1. Create the order
    createOrder({
      shippingAddress: addressId,
      paymentMethod: activePaymentMethod
    })
    .then((orderResponse) => {
      const orderId = orderResponse.data._id;
      
      // Clear cart instantly since backend order creation clears it
      dispatch(clearCartAfterOrder());

      // 2. Process the payment
      return processPayment({
        paymentMethodId: activePaymentMethod,
        orderId: orderId
      });
    })
    .then((paymentResponse) => {
      if (paymentResponse.data.success) {
        toast.success(paymentResponse.data.message || "Payment Successful! Your order is being processed.");
        setTimeout(() => {
            navigate('/');
        }, 2000);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Checkout error:", err);
      toast.error(err.response?.data?.message || "An error occurred during checkout.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const subtotal = cartItems?.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  if (loading) {
    return <LoadingOverlay message="Preparing secure checkout..." />;
  }

  return (
    <>
      <Navbar />
      <div className="payment-container">
        <div className="payment-header">
            <button className="back-btn" onClick={() => navigate('/cart')}>
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Bag
            </button>
            <h1 className="payment-title">Checkout</h1>
        </div>

        <div className="payment-content">
            <div className="payment-main-column">
                <PaymentSection 
                    methods={paymentMethods}
                    activeMethod={activePaymentMethod}
                    onMethodChange={setActivePaymentMethod}
                />
                
                <div className="security-notice">
                    <span className="material-symbols-outlined">verified_user</span>
                    <div className="notice-text">
                        <h4>Secure Transaction</h4>
                        <p>Your payment information is encrypted and never stored on our servers.</p>
                    </div>
                </div>
            </div>

            <div className="payment-side-column">
                <OrderSummary 
                    subtotal={subtotal}
                    shipping={shipping}
                    estimatedTax={estimatedTax}
                    total={total}
                    buttonText="PAY NOW"
                    onAction={handlePayment}
                />
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentScreen;
