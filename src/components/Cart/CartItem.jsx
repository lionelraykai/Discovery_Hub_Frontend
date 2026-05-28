import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../store/cartSlice';
import ConfirmModal from '../ConfirmModal';

const CartItem = ({ item, updating, onUpdateQty }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemove = async () => {
    setIsModalOpen(false);
    await dispatch(removeItem(item.product._id));
    if (onUpdateQty) {
      onUpdateQty(); 
    }
  };
  return (
    <div className="cart-item">
      <img 
        src={item.product.images[0]} 
        alt={item.product.name} 
        className="cart-item-image" 
      />
      <div className="cart-item-info">
        <div className="cart-item-top-info">
          <span className="cart-item-category">{item.product.category}</span>
          <Link to={`/product/${item.product._id}`} className="cart-item-name">
            {item.product.name}
          </Link>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>{item.product.brand || 'Premium Selection'}</p>
        </div>
        
        <div className="cart-item-bottom-actions">
          <div className="quantity-control">
            <button 
              className="qty-btn" 
              onClick={() => onUpdateQty(item.product._id, item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
            >
              −
            </button>
            <div className="qty-value">{item.quantity}</div>
            <button 
              className="qty-btn" 
              onClick={() => onUpdateQty(item.product._id, item.quantity + 1)}
              disabled={updating}
            >
              +
            </button>
          </div>
          <button 
            className="remove-btn"
            onClick={() => setIsModalOpen(true)}
            disabled={updating}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
      <div className="cart-item-price">${item.product.price.toFixed(2)}</div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Remove from Bag?"
        message={`Are you sure you want to remove ${item.product.name} from your shopping bag? This action cannot be undone.`}
        onConfirm={handleRemove}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CartItem;
