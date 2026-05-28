import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./screens/Home/Home";
import Login from "./screens/Auth/Login";
import Signup from "./screens/Auth/SignUp";
import ProductDetails from "./screens/ProductDetails/ProductDetails";
import Profile from "./screens/Profile/Profile";
import Cart from "./screens/Cart/Cart";
import PaymentScreen from "./screens/Payment/PaymentScreen";
import Address from "./screens/Address/Address";
import Orders from "./screens/Orders/Orders";
import OrderDetails from "./screens/Orders/OrderDetails";
import Wishlist from "./screens/Wishlist/Wishlist";
import Security from "./screens/Security/Security";
import ScrollToTop from "./components/ScrollToTop";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartBanner from "./components/Cart/CartBanner";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetails/></PageWrapper>}/>
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/payment" element={<PageWrapper><PaymentScreen /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/security" element={<PageWrapper><Security /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
        <Route path="/order/:id" element={<PageWrapper><OrderDetails /></PageWrapper>} />
        <Route path="/address" element={<PageWrapper><Address /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
      <CartBanner />
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;