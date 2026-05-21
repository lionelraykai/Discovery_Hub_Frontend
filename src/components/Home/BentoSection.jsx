import { useNavigate } from "react-router-dom";

const BentoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Stay Curated.</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">Join our inner circle for exclusive access to upcoming drops, limited editions, and curated editorial content.</p>
        <div className="flex gap-2">
          <input 
            className="flex-grow bg-white border-none rounded-lg focus:ring-2 focus:ring-primary px-4 py-2 text-sm" 
            placeholder="Enter your email" 
            type="email"
          />
          <button className="bg-on-surface text-surface px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity text-sm">Join</button>
        </div>
      </div>
      <div className="bg-primary-container p-8 rounded-2xl text-on-primary flex flex-col justify-between items-start relative overflow-hidden">
        <span className="material-symbols-outlined text-6xl absolute -right-4 -bottom-4 opacity-10">redeem</span>
        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl font-bold tracking-tight">Member Perks</h2>
          <p className="text-blue-100 text-sm">Unlock free international shipping and early access to all curated seasonal collections.</p>
        </div>
        <button 
          className="bg-white text-primary px-6 py-2 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform active:scale-95 relative z-10 text-sm mt-4"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </button>
      </div>
    </section>
  );
};

export default BentoSection;
