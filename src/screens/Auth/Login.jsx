import { useState } from "react";
import { loginUser } from "../../API/endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../store/cartSlice";
import { fetchWishlist } from "../../store/wishlistSlice";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);

      sessionStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.data.token);
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo-section" style={{ marginBottom: '16px' }}>
        <div className="auth-logo-icon" style={{ width: '40px', height: '40px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div className="auth-logo-text" style={{ fontSize: '18px' }}>ETHERIC</div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title" style={{ fontSize: '24px' }}>Welcome Back</h1>
          <p className="auth-subtitle">Enter your credentials to access the Curated Canvas.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Email address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="name@company.com"
                onChange={handleChange}
                required
                style={{ padding: '10px 14px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={{ padding: '10px 14px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="auth-actions" style={{ marginBottom: '4px' }}>
            <label className="checkbox-group" style={{ fontSize: '13px' }}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="auth-link" style={{ fontSize: '13px' }}>Forgot password?</a>
          </div>

          <button type="submit" className="auth-button">
            Sign In
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>

      <p className="auth-footer" style={{ marginTop: '16px' }}>
        Don't have an account?
        <button className="auth-footer-link" onClick={() => navigate("/signup")}>Sign Up</button>
      </p>

      <div className="copyright" style={{ marginTop: '12px' }}>
        © 2024 CURATED CANVAS • PREMIUM E-COMMERCE
      </div>
    </div>
  );
};

export default Login;
