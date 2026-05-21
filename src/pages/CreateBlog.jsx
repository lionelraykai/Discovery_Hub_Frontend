import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateBlogMutation } from '../hooks/useBlogHooks';
import { useUpsertDraftMutation } from '../hooks/useDraftHooks';
import { Plus, Image as ImageIcon, Type, Trash2, ArrowRight, Loader2, Save } from 'lucide-react';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CreateBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: createBlog, isPending } = useCreateBlogMutation();
  const { mutate: upsertDraft, isPending: isSavingDraft } = useUpsertDraftMutation();
  
  // Check if we are resuming a draft
  const initialDraft = location.state?.draft;
  
  const [draftId, setDraftId] = useState(initialDraft?._id || null);
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [sections, setSections] = useState(initialDraft?.sections?.length > 0 
    ? initialDraft.sections.map(s => ({ ...s, id: Math.random(), isUploading: false }))
    : [{ id: Date.now(), type: 'text', content: '', isUploading: false }]
  );
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSection = (type) => {
    setSections([...sections, { id: Date.now(), type, content: '', isUploading: false }]);
  };

  const handleRemoveSection = (id) => {
    if (sections.length === 1) return;
    setSections(sections.filter(s => s.id !== id));
  };

  const handleUpdateSection = (id, content) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return;
    try {
      setSections(prev => prev.map(s => s.id === id ? { ...s, isUploading: true } : s));
      const url = await uploadToCloudinary(file);
      setSections(prev => prev.map(s => s.id === id ? { ...s, content: url, isUploading: false } : s));
    } catch (err) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, isUploading: false } : s));
      setError('Image upload failed: ' + err.message);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, id) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        await handleFileUpload(id, file);
    }
  };

  const handleSaveDraft = () => {
    setError('');
    setSaveSuccess(false);

    const draftData = {
      draftId,
      type: 'blog',
      title,
      sections: sections.map(({ type, content }) => ({ type, content }))
    };

    upsertDraft(draftData, {
      onSuccess: (data) => {
        setDraftId(data._id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      },
      onError: (err) => setError('Failed to save draft: ' + err.message)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const validSections = sections.filter(s => s.content.trim() !== '');
    if (validSections.length === 0) {
      setError('Please add some content to your thought.');
      return;
    }

    createBlog(
      { title, sections: validSections.map(({ type, content }) => ({ type, content })) },
      {
        onSuccess: () => navigate('/blogs'),
        onError: (err) => setError(err.response?.data?.message || 'Failed to create blog')
      }
    );
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)' }}>
      <div className="page-header" style={{ maxWidth: '800px', margin: '4rem auto 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Write a Thought</h1>
        <p style={{ color: 'var(--on-surface-variant)' }}>Document personal experiences and layer images between your text.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--error)', color: 'white', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="form-group" style={{ marginBottom: '3rem' }}>
            <input 
              type="text" 
              placeholder="Give it a title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ 
                fontSize: '2.5rem', 
                border: 'none', 
                borderBottom: '2px solid var(--outline-variant)',
                padding: '1rem 0',
                backgroundColor: 'transparent',
                borderRadius: '0',
                fontFamily: 'var(--font-display)',
                boxShadow: 'none'
              }}
            />
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {sections.map((section, index) => (
              <div key={section.id} style={{ position: 'relative', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {section.type === 'text' ? (
                    <textarea 
                      placeholder="Start typing..."
                      value={section.content}
                      onChange={(e) => handleUpdateSection(section.id, e.target.value)}
                      style={{ 
                        minHeight: '150px', 
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        border: '1px dashed var(--outline-variant)'
                      }}
                    />
                  ) : (
                    <div 
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, section.id)}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="url"
                          placeholder="Paste URL or drag & drop image here..."
                          value={section.content}
                          onChange={(e) => handleUpdateSection(section.id, e.target.value)}
                          style={{ border: '1px dashed var(--outline-variant)', flex: 1 }}
                        />
                        <input 
                          type="file" 
                          accept="image/*" 
                          id={`file-${section.id}`} 
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(section.id, e.target.files[0])}
                        />
                        <label 
                          htmlFor={`file-${section.id}`} 
                          className="btn-secondary" 
                          style={{ cursor: 'pointer', padding: '0.5rem 1rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                        >
                          Browse File
                        </label>
                      </div>

                      {section.isUploading && (
                        <div style={{ padding: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Loader2 size={16} className="animate-spin" /> Uploading image to Cloudinary...
                        </div>
                      )}

                      {section.content && !section.isUploading && (
                        <div style={{ marginTop: '1rem' }}>
                          <img 
                            src={section.content} 
                            alt="Preview" 
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem', border: '1px solid var(--surface-container-high)' }}
                            onError={(e) => e.target.style.display = 'none'}
                            onLoad={(e) => e.target.style.display = 'block'}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {sections.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSection(section.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.5rem' }}
                    title="Remove Section"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Section Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '3rem 0', padding: '2rem 0', borderTop: '1px dashed var(--outline-variant)', borderBottom: '1px dashed var(--outline-variant)' }}>
            <button type="button" className="btn-secondary" onClick={() => handleAddSection('text')}>
              <Type size={18} /> Add Text
            </button>
            <button type="button" className="btn-secondary" onClick={() => handleAddSection('image')}>
              <ImageIcon size={18} /> Add Image
            </button>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
            {saveSuccess && <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Draft saved!</span>}
            <button 
              type="button" 
              className="btn-secondary" 
              disabled={isSavingDraft} 
              onClick={handleSaveDraft}
              style={{ padding: '1rem 2rem' }}
            >
              <Save size={18} /> {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
            <button type="submit" className="btn-primary" disabled={isPending} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {isPending ? 'Publishing...' : 'Publish Thought'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
