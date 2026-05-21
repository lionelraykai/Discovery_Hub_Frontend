import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useVoteKnotMutation, useDownvoteKnotMutation } from '../hooks/useKnotHooks';
import { useAuth } from '../context/AuthContext';

// Helper to format distances in words (simplified version)
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const KnotCard = ({ knot }) => {
  const { user } = useAuth();
  const { mutate: upvote, isPending: upvoting } = useVoteKnotMutation();
  const { mutate: downvote, isPending: downvoting } = useDownvoteKnotMutation();

  const upvoters = knot.upvoters || [];
  const downvoters = knot.downvoters || [];
  const isUpvoted = user && upvoters.includes(user._id);
  const isDownvoted = user && downvoters.includes(user._id);
  const voteCount = upvoters.length - downvoters.length;

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return; // Could trigger login modal here
    upvote(knot._id);
  };

  const handleDownvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    downvote(knot._id);
  };

  return (
    <Link 
      to={`/knot/${knot._id}`} 
      className="masonry-item" 
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, alignItems: 'flex-start' }}>
          <span className="label-caps" style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {knot.category?.toUpperCase()}
          </span>
        </div>
        
        {/* Vote Control Pod - Single Icon Layout */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: 'var(--surface-container-low)', 
          borderRadius: 'var(--radius-full)', 
          padding: '0.2rem 0.6rem 0.2rem 0.3rem',
          border: '1px solid var(--surface-variant)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          gap: '0.4rem'
        }}>
          <button 
            onClick={handleUpvote}
            title={isUpvoted ? "Remove Upvote" : "Upvote"}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '0.4rem', 
              cursor: upvoting ? 'wait' : 'pointer',
              color: isUpvoted ? 'var(--on-primary)' : 'var(--on-surface-variant)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: isUpvoted ? 'var(--primary)' : 'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              if (!isUpvoted) {
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.backgroundColor = 'var(--surface-container-high)';
              } else {
                e.currentTarget.style.filter = 'brightness(1.2)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              if (!isUpvoted) {
                e.currentTarget.style.color = 'var(--on-surface-variant)';
                e.currentTarget.style.backgroundColor = 'transparent';
              } else {
                e.currentTarget.style.filter = 'brightness(1)';
              }
            }}
          >
            <ThumbsUp size={16} strokeWidth={isUpvoted ? 3 : 2.5} />
          </button>
          
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            color: isUpvoted ? 'var(--primary)' : 'var(--on-surface)',
            minWidth: '12px',
            textAlign: 'center',
            paddingRight: '0.2rem'
          }}>
            {upvoters.length >= 1000 ? (upvoters.length / 1000).toFixed(1) + 'k' : upvoters.length}
          </span>
        </div>
      </div>
      
      {knot.image && (
        <div style={{ marginBottom: '1.25rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <img src={knot.image} alt={knot.title} style={{ width: '100%', display: 'block' }} />
        </div>
      )}
      
      <h3 style={{ fontSize: '1.25rem', lineHeight: 1.4, marginBottom: '0.75rem', fontWeight: 500 }}>
        {knot.title}
      </h3>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '2rem' }}>
        {knot.excerpt}
      </p>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderTop: '1px solid var(--surface-variant)', 
        paddingTop: '1.25rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={knot.author?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=48&h=48'} 
            alt={knot.author?.name} 
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
            By {knot.author?.name || 'Anonymous'} • {formatTime(knot.createdAt)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--on-surface-variant)', fontSize: '0.75rem', fontWeight: 600 }}>
          <MessageSquare size={16} strokeWidth={2.5} />
          {knot.solutions?.length || 0}
        </div>
      </div>
    </Link>
  );
};

export default KnotCard;
