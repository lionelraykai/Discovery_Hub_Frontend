import { useState } from "react";
import { signUpUser } from "../../API/endpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signUpUser(form);
      toast.success(res.data.message || "Signup Successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo-section" style={{ marginBottom: '12px' }}>
        <div className="auth-logo-icon" style={{ width: '36px', height: '36px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div className="auth-logo-text" style={{ fontSize: '16px' }}>ETHERIC</div>
      </div>

      <div className="auth-card" style={{ padding: '20px 28px' }}>
        <div className="auth-header" style={{ marginBottom: '16px' }}>
          <h1 className="auth-title" style={{ fontSize: '22px' }}>Create your account</h1>
          <p className="auth-subtitle" style={{ fontSize: '12px' }}>Join Etheric Commerce and start curating your digital canvas.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '10px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '10px' }}>Full Name / Username</label>
            <input
              name="userName"
              className="auth-input"
              placeholder="John Doe"
              onChange={handleChange}
              required
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '10px' }}>Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="name@company.com"
              onChange={handleChange}
              required
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>

          <div className="social-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
             <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px' }}>Phone Number</label>
              <input
                name="phoneNumber"
                className="auth-input"
                placeholder="+1..."
                onChange={handleChange}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px' }}>Country</label>
              <input
                name="country"
                className="auth-input"
                placeholder="USA"
                onChange={handleChange}
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div className="social-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px' }}>Password</label>
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px' }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="auth-input"
                placeholder="••••••••"
                onChange={handleChange}
                required
                style={{ padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <label className="checkbox-group" style={{ fontSize: '11px', marginTop: '2px' }}>
            <input type="checkbox" required />
            <span>I agree to the <a href="#" className="auth-link">Terms</a> and <a href="#" className="auth-link">Privacy</a></span>
          </label>

          <button type="submit" className="auth-button" style={{ padding: '8px', fontSize: '14px' }}>
            Create Account
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
      </div>

      <p className="auth-footer" style={{ marginTop: '14px' }}>
        Already have an account?
        <button className="auth-footer-link" onClick={() => navigate("/login")}>Log In</button>
      </p>

      <div className="copyright" style={{ marginTop: '10px' }}>
        © 2024 CURATED CANVAS • PREMIUM E-COMMERCE
      </div>
    </div>
  );
};

export default Signup;
