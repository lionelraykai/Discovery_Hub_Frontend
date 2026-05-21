import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrafts, useDeleteDraftMutation } from '../hooks/useDraftHooks';
import { FileText, Trash2, Edit3, Clock, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function DraftsFeed() {
  const navigate = useNavigate();
  const { data: drafts, isLoading, error } = useDrafts();
  const { mutate: deleteDraft } = useDeleteDraftMutation();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [draftToDelete, setDraftToDelete] = React.useState(null);

  const handleResume = (draft) => {
    if (draft.type === 'blog') {
      navigate('/post-blog', { state: { draft } });
    } else {
      navigate('/post', { state: { draft } });
    }
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDraftToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (draftToDelete) {
      deleteDraft(draftToDelete);
      setModalOpen(false);
      setDraftToDelete(null);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      <div className="page-header" style={{ maxWidth: '800px', margin: '4rem auto 2rem' }}>
        <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
          WORK IN PROGRESS
        </p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Drafts</h1>
        <p style={{ color: 'var(--on-surface-variant)' }}>Pick up where you left off. Only you can see these.</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Thinking...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--error)' }}>
          Failed to load drafts. {error.message}
        </div>
      ) : (!drafts || drafts.length === 0) ? (
        <div style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center', 
          backgroundColor: 'var(--surface-container-low)', 
          borderRadius: 'var(--radius-md)',
          margin: '2rem auto',
          maxWidth: '600px'
        }}>
          <div style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
             <FileText size={64} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No pending drafts</h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>When you start a blog or knot and save it for later, it will appear here.</p>
        </div>
      ) : (
        <div className="masonry-grid" style={{ marginTop: '2rem' }}>
           {drafts.map(draft => (
             <div 
               key={draft._id} 
               className="masonry-item blog-card" 
               style={{ cursor: 'pointer', position: 'relative' }}
               onClick={() => handleResume(draft)}
             >
               <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    backgroundColor: 'var(--surface-container-high)', 
                    borderRadius: '8px', 
                    color: draft.type === 'blog' ? 'var(--primary)' : 'var(--on-surface-variant)' 
                  }}>
                    {draft.type === 'blog' ? <Edit3 size={18} /> : <HelpCircle size={18} />}
                  </div>
                  <span className="label-caps" style={{ fontSize: '0.65rem' }}>
                    {draft.type === 'blog' ? 'Thought Draft' : 'Knot Draft'}
                  </span>
                  <div style={{ marginLeft: 'auto', color: 'var(--on-surface-variant)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    {format(new Date(draft.updatedAt), 'MMM d')}
                  </div>
               </div>

               <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                 {draft.title || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Untitled</span>}
               </h3>
               
               <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', minHeight: '3rem' }}>
                 {draft.type === 'blog' 
                    ? (draft.sections?.find(s => s.type === 'text')?.content?.substring(0, 100) || 'No text content yet...')
                    : (draft.content?.substring(0, 100) || 'No description yet...')
                 }
               </p>

               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-container-high)' }}>
                 <button 
                   className="btn-tertiary" 
                   style={{ color: 'var(--error)', padding: '0.5rem' }}
                   onClick={(e) => handleDeleteClick(e, draft._id)}
                 >
                   <Trash2 size={16} />
                 </button>
                 <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                   Resume
                 </button>
               </div>
             </div>
           ))}
        </div>
      )}

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Discard Draft?"
        message="This will permanently delete this draft. This action cannot be undone."
      />
    </div>
  );
}
