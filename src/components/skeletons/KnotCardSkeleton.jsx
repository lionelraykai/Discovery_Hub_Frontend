import React from 'react';
import Skeleton from '../common/Skeleton.jsx';

const KnotCardSkeleton = () => {
  return (
    <div className="masonry-item" style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-6)' }}>
      {/* Status & Votes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Skeleton width="60px" height="24px" style={{ borderRadius: 'var(--radius-full)' }} />
        <Skeleton width="40px" height="18px" />
      </div>
      
      {/* Image (Optional but seen in cards) */}
      <Skeleton width="100%" height="180px" style={{ marginBottom: '1.25rem', borderRadius: '0.5rem' }} />
      
      {/* Title */}
      <Skeleton width="85%" height="1.5rem" style={{ marginBottom: '0.75rem' }} />
      <Skeleton width="50%" height="1.5rem" style={{ marginBottom: '0.75rem' }} />
      
      {/* Excerpt */}
      <div style={{ marginBottom: '2rem' }}>
        <Skeleton width="100%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="95%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="60%" height="0.8rem" />
      </div>
      
      {/* Author Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--surface-variant)', paddingTop: '1.25rem' }}>
        <Skeleton width="24px" height="24px" circle />
        <Skeleton width="120px" height="0.75rem" />
      </div>
    </div>
  );
};

export default KnotCardSkeleton;
