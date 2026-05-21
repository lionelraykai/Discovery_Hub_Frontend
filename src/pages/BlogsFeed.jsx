import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, MessageSquare, Heart } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogHooks';
import { format } from 'date-fns';

export default function BlogFeed() {
  const { data: blogs, isLoading, error } = useBlogs();

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Hero Section */}
      <div className="hero-grid-stack" style={{ margin: '4rem 0' }}>
        <div>
           <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
             DOCUMENTED THOUGHTS
           </p>
           <h1 style={{ fontSize: 'var(--text-display-hero)', lineHeight: 1.1, marginBottom: '2rem' }}>
             Quiet reflections on <br/>
             <i style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--primary)' }}>personal experiences.</i>
           </h1>
           <p style={{ fontSize: '1.125rem', maxWidth: '420px', lineHeight: 1.6, color: 'var(--on-surface-variant)', margin: '0 auto' }}>
             A space to share in-depth stories, multi-layered thoughts, and beautiful imagery from your daily life.
           </p>
           <Link to="/post-blog" className="btn-primary" style={{ marginTop: '2rem' }}>
             <PenTool size={18} />
             Write a Thought
           </Link>
        </div>
        <div style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img 
             src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000&h=700" 
             alt="Notebook and coffee" 
             style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'cover', borderRadius: '1rem' }}
           />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading thoughts...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--error)' }}>
          Failed to load blogs. {error.message}
        </div>
      ) : (!blogs || blogs.length === 0) ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--on-surface-variant)' }}>No thoughts recorded yet. Be the first to write!</h3>
        </div>
      ) : (
        <div className="masonry-grid" style={{ marginTop: '2rem' }}>
           {blogs.map(blog => {
             // Find first image for the cover
             const coverBlock = blog.sections?.find(s => s.type === 'image');
             const snippetBlock = blog.sections?.find(s => s.type === 'text');
             const snippet = snippetBlock ? snippetBlock.content.substring(0, 150) + '...' : 'Photo essay';

             return (
               <Link to={`/blogs/${blog._id}`} key={blog._id} style={{ textDecoration: 'none' }}>
                 <div className="masonry-item blog-card" style={{ transition: 'transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                   {coverBlock && (
                     <img 
                       src={coverBlock.content} 
                       alt={blog.title} 
                       style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} 
                     />
                   )}
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{blog.title}</h3>
                   <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1rem', flex: 1 }}>{snippet}</p>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--surface-container-high)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <img 
                         src={blog.author?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=48&h=48'} 
                         alt={blog.author?.name} 
                         style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                       />
                       <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                         {blog.author?.name}
                       </span>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem', color: 'var(--on-surface-variant)', fontSize: '0.8rem' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                         <Heart size={14} /> {blog.likes?.length || 0}
                       </span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                         <MessageSquare size={14} /> {blog.comments?.length || 0}
                       </span>
                     </div>
                   </div>
                 </div>
               </Link>
             );
           })}
        </div>
      )}
    </div>
  );
}
