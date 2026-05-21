import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Plus } from 'lucide-react';
import { useKnots } from '../hooks/useKnotHooks';
import KnotCardSkeleton from '../components/skeletons/KnotCardSkeleton.jsx';
import KnotCard from '../components/KnotCard';

const CATEGORIES = [
  'All Knots',
  'Development',
  'Design',
  'Food',
  'Fitness',
  'Social Media',
  'Health Issues',
  'Education',
  'Technology',
  'Travel',
  'Lifestyle',
  'Business',
  'Entertainment',
  'Finance'
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All Knots');
  const { data: knots, isLoading, error } = useKnots(selectedCategory);

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Hero Section */}
      <div className="hero-grid-stack" style={{ margin: '4rem 0' }}>
        <div>
           <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
             THE KNOWLEDGE COLLECTIVE
           </p>
           <h1 style={{ fontSize: 'var(--text-display-hero)', lineHeight: 1.1, marginBottom: '2rem' }}>
             Quiet solutions for <br/>
             <i style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--primary)' }}>complex frictions.</i>
           </h1>
           <p style={{ fontSize: '1.125rem', maxWidth: '420px', lineHeight: 1.6, color: 'var(--on-surface-variant)', margin: '0 auto' }}>
             A curated archive of architectural, digital, and lifestyle challenges addressed through the lens of functional minimalism.
           </p>
        </div>
        <div style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img 
             src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000&h=700" 
             alt="Minimalist sideboard console with plant" 
             style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'cover', borderRadius: '1rem' }}
           />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="horizontal-scroll" style={{ margin: '3rem 0' }}>
         {CATEGORIES.map(category => (
           <button 
             key={category}
             className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
             onClick={() => setSelectedCategory(category)}
           >
             {category}
           </button>
         ))}
      </div>

      {/* Grid Content */}
      {!isLoading && !error && (!knots || knots.length === 0) ? (
        <div style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          backgroundColor: 'var(--surface-container-low)', 
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          margin: '2rem 0'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--surface-container-high)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--on-surface-variant)'
          }}>
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <div style={{ maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No Knots Found</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem' }}>
              This part of the archive is currently empty. Our collective knowledge grows when you share your challenges.
            </p>
          </div>
          <Link to="/post" className="btn-primary">
            <Plus size={18} />
            Publish the First Knot
          </Link>
        </div>
      ) : (
        <div className="masonry-grid">
           {isLoading ? (
             // Render 6 skeletons while loading
             [...Array(6)].map((_, i) => <KnotCardSkeleton key={i} />)
           ) : error ? (
             <div style={{ textAlign: 'center', padding: '4rem 0' }}>
               <h3 style={{ color: 'var(--error)' }}>Error fetching Knots</h3>
               <p>{error.message}</p>
             </div>
           ) : (
             knots.map(knot => <KnotCard key={knot._id} knot={knot} />)
           )}
        </div>
      )}
    </div>
  );
}
