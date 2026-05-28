import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, X } from 'lucide-react';

const LoginRequiredModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white p-10 rounded-[2.5rem] max-w-[440px] w-full text-center shadow-2xl border border-slate-100 relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="bg-primary/10 p-6 rounded-3xl">
                <Lock size={48} className="text-primary" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Login Required</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              Please sign in to your account to add items to your shopping cart and enjoy a personalized experience.
            </p>
            
            <div className="flex flex-col gap-3">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-colors" 
                onClick={() => window.location.href = "/login"}
              >
                <LogIn size={18} />
                Go to Login
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#f1f5f9" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold transition-colors" 
                onClick={onClose}
              >
                Maybe Later
              </motion.button>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginRequiredModal;


