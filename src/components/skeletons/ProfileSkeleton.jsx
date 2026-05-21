import React from 'react';
import Skeleton from '../common/Skeleton.jsx';

const ProfileSkeleton = () => {
  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Profile Header */}
      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
         <Skeleton width="160px" height="160px" circle style={{ margin: '0 auto 2rem' }} />
         <Skeleton width="280px" height="3rem" style={{ margin: '0 auto 1rem' }} />
         <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            <Skeleton width="100%" height="1rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="90%" height="1rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="40%" height="1rem" style={{ margin: '0 auto' }} />
         </div>
         <Skeleton width="150px" height="1rem" style={{ margin: '0 auto 2rem' }} />
         <Skeleton width="160px" height="3rem" style={{ margin: '0 auto' }} />
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem', 
        marginBottom: '4rem' 
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card-lifted" style={{ textAlign: 'center', padding: '2rem' }}>
             <Skeleton width="50%" height="2.5rem" style={{ margin: '0 auto 0.5rem' }} />
             <Skeleton width="70%" height="0.65rem" style={{ margin: '0 auto' }} />
          </div>
        ))}
      </div>

      {/* Contributions Section Titles */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Skeleton width="200px" height="2rem" />
        <Skeleton width="60px" height="1rem" />
      </div>

      {/* Contributions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1, 2].map(i => (
          <div key={i} className="card-lifted" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', alignItems: 'center' }}>
             <Skeleton width="240px" height="140px" style={{ borderRadius: '0.75rem' }} className="hidden-mobile" />
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                   <Skeleton width="60px" height="1.2rem" style={{ borderRadius: 'var(--radius-full)' }} />
                   <Skeleton width="80px" height="1rem" />
                </div>
                <Skeleton width="80%" height="1.5rem" style={{ marginBottom: '0.75rem' }} />
                <Skeleton width="95%" height="0.9rem" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="40%" height="0.9rem" style={{ marginBottom: '1.5rem' }} />
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                   <Skeleton width="40px" height="1.2rem" />
                   <Skeleton width="40px" height="1.2rem" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
