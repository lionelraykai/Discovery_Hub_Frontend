import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Remove", 
  cancelText = "Keep Item", 
  icon = "🗑️" 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white p-10 rounded-[2rem] max-w-[420px] w-full text-center shadow-2xl border border-slate-100" 
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-6 drop-shadow-lg"
            >
              {icon}
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">{message}</p>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#f1f5f9" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm transition-colors" 
                onClick={onCancel}
              >
                {cancelText}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-colors" 
                onClick={onConfirm}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;


