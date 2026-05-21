import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog, useLikeBlogMutation, useCommentBlogMutation, useDeleteBlogMutation } from '../hooks/useBlogHooks';
import { Heart, MessageSquare, ArrowLeft, Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();
  const { data: blog, isLoading, isError } = useBlog(id);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlogMutation();
  const { mutate: commentBlog, isPending: isCommenting } = useCommentBlogMutation();
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlogMutation();
  
  const [commentContent, setCommentContent] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteBlog(blog._id, {
      onSuccess: () => navigate('/blogs')
    });
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (isError || !blog) {
    return <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--error)' }}>Failed to load the thought.</div>;
  }

  const isLiked = user && blog.likes?.includes(user.id);

  const handleLike = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    likeBlog(blog._id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }
    if (!commentContent.trim()) return;

    commentBlog({ blogId: blog._id, content: commentContent }, {
      onSuccess: () => setCommentContent('')
    });
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      {/* Back button */}
      <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
        <Link to="/blogs" className="btn-tertiary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Feed
        </Link>
      </div>

      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '2rem', wordBreak: 'break-word' }}>{blog.title}</h1>
        
        {/* Author info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--surface-container-high)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={blog.author?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=48&h=48'} 
              alt={blog.author?.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{blog.author?.name || 'Anonymous User'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </div>
          
          {user && (blog.author?._id === user || blog.author === user) && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
              title="Delete Thought"
            >
              <Trash2 size={20} /> {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        {/* Content sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem', lineHeight: 1.8 }}>
          {blog.sections?.map((section, index) => {
            if (section.type === 'image') {
              return (
                <img 
                  key={index}
                  src={section.content} 
                  alt={`Blog visual ${index}`} 
                  style={{ width: '100%', borderRadius: '0.75rem', margin: '1rem 0' }}
                />
              );
            }
            return (
              <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p>
            );
          })}
        </div>

        {/* Interaction Bar */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem', padding: '1.5rem 0', borderTop: '1px solid var(--surface-container-high)', borderBottom: '1px solid var(--surface-container-high)' }}>
          <button 
            onClick={handleLike}
            disabled={isLiking}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: isLiked ? 'var(--error)' : 'var(--on-surface)',
              fontWeight: 600, fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <Heart size={24} fill={isLiked ? 'var(--error)' : 'none'} />
            {blog.likes?.length || 0}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>
            <MessageSquare size={24} />
            {blog.comments?.length || 0} Comments
          </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Responses</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '3rem', position: 'relative' }}>
            <textarea
              placeholder="What are your thoughts?"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{ minHeight: '120px', paddingBottom: '4rem' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isCommenting || !commentContent.trim()}
              style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.5rem 1rem' }}
            >
              <Send size={16} /> Publish
            </button>
          </form>

          {/* Comment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map(comment => (
                <div key={comment._id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <img 
                    src={comment.user?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=48&h=48'} 
                    alt={comment.user?.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{comment.user?.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>No responses yet.</p>
            )}
          </div>
        </div>
      </article>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete this thought?"
        message="This will permanently remove this entry from the archive. This action cannot be undone."
      />
    </div>
  );
}
