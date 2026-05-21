import React from 'react';
import Skeleton from '../common/Skeleton.jsx';

const KnotDetailSkeleton = () => {
  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Editorial Header & Title Skeleton */}
      <header style={{ maxWidth: '800px', margin: 'var(--spacing-8) auto 2rem auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Skeleton width="120px" height="1rem" />
        </div>
        
        <Skeleton width="90%" height="3rem" style={{ margin: '0 auto 0.75rem auto' }} />
        <Skeleton width="60%" height="3rem" style={{ margin: '0 auto 1.5rem auto' }} />
        
        {/* Author Metabar Skeleton */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          borderTop: '1px solid var(--surface-variant)', 
          borderBottom: '1px solid var(--surface-variant)', 
          padding: '1.5rem 0' 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Skeleton width="40px" height="40px" circle />
              <div style={{ textAlign: 'left' }}>
                  <Skeleton width="80px" height="0.9rem" style={{ marginBottom: '0.4rem' }} />
                  <Skeleton width="120px" height="0.75rem" />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <Skeleton width="80px" height="32px" style={{ borderRadius: 'var(--radius-full)' }} />
               <Skeleton width="24px" height="24px" circle />
               <Skeleton width="24px" height="24px" circle />
            </div>
        </div>
      </header>

      {/* Main Content Area Skeleton */}
      <article style={{ maxWidth: '800px', margin: '0 auto var(--spacing-12)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Skeleton width="100%" height="1.15rem" style={{ marginBottom: '0.8rem' }} />
          <Skeleton width="98%" height="1.15rem" style={{ marginBottom: '0.8rem' }} />
          <Skeleton width="95%" height="1.15rem" style={{ marginBottom: '0.8rem' }} />
          <Skeleton width="90%" height="1.15rem" />
        </div>
        
        {/* Figure Skeleton */}
        <div style={{ margin: '3rem 0' }}>
           <Skeleton width="100%" height="400px" style={{ borderRadius: 'var(--radius-md)' }} />
           <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
             <Skeleton width="50%" height="0.8rem" />
           </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <Skeleton width="100%" height="1.15rem" style={{ marginBottom: '0.8rem' }} />
          <Skeleton width="97%" height="1.15rem" style={{ marginBottom: '0.8rem' }} />
          <Skeleton width="85%" height="1.15rem" />
        </div>
      </article>

      {/* Solutions Section Skeleton */}
      <div style={{ maxWidth: '800px', margin: '0 auto', borderTop: '2px solid var(--surface-variant)', paddingTop: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Skeleton width="200px" height="1.5rem" />
        </div>
        
        {[1, 2].map((i) => (
          <div key={i} className="section-soft" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton width="36px" height="36px" circle />
                <div>
                  <Skeleton width="100px" height="0.9rem" style={{ marginBottom: '0.4rem' }} />
                  <Skeleton width="60px" height="0.75rem" />
                </div>
              </div>
              <Skeleton width="40px" height="24px" />
            </div>
            <Skeleton width="100%" height="1rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="95%" height="1rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="80%" height="1rem" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnotDetailSkeleton;
