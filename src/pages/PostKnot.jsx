import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Upload, ChevronDown, Check, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateKnotMutation } from '../hooks/useKnotHooks';
import { useUpsertDraftMutation } from '../hooks/useDraftHooks';
import { uploadToCloudinary } from '../utils/cloudinary';

const CATEGORIES = [
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

const knotSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  category: z.enum(CATEGORIES),
  description: z.string().min(20, 'Please provide a more detailed description (min 20 chars)'),
});

export default function PostKnot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dropdownRef = useRef(null);
  const { mutate: createKnot, isPending, error: apiError } = useCreateKnotMutation();
  const { mutate: upsertDraft, isPending: isSavingDraft } = useUpsertDraftMutation();

  const initialDraft = location.state?.draft;
  const [draftId, setDraftId] = useState(initialDraft?._id || null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(knotSchema),
    defaultValues: {
      category: initialDraft?.category || 'Development',
      title: initialDraft?.title || '',
      description: initialDraft?.content || '',
    }
  });

  useEffect(() => {
    if (initialDraft?.image) {
      setImagePreview(initialDraft.image);
    }
  }, [initialDraft]);

  const selectedCategory = watch('category');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (category) => {
    setValue('category', category);
    setIsDropdownOpen(false);
  };

  const handleSaveDraft = () => {
    setSaveSuccess(false);
    const data = watch();
    
    const draftData = {
      draftId,
      type: 'knot',
      title: data.title,
      content: data.description,
      category: data.category,
      image: imagePreview // Cloudinary URL if uploaded
    };

    upsertDraft(draftData, {
      onSuccess: (data) => {
        setDraftId(data._id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    let imageUrl = '';

    try {
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      const knotData = {
        title: data.title,
        category: data.category,
        content: data.description,
        image: imageUrl,
        excerpt: data.description.substring(0, 120) + (data.description.length > 120 ? '...' : ''),
      };

      createKnot(knotData, {
        onSuccess: () => {
          navigate('/');
        },
      });
    } catch (err) {
      console.error('Knot creation/upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h1>Post a Knot</h1>
        <p>Detail your challenge with precision. Our collective knowledge archive is built on clear, actionable inquiries.</p>
      </header>

      <form className="card-lifted" onSubmit={handleSubmit(onSubmit)}>
        {apiError && (
          <div style={{ color: 'var(--error)', backgroundColor: 'rgba(186, 26, 26, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-default)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {apiError.response?.data?.message || 'Failed to post knot. Please try again.'}
          </div>
        )}

        <div className="form-group">
           <label>Title</label>
           <input 
             type="text" 
             placeholder="Be clear and descriptive..." 
             className={errors.title ? 'input-error' : ''}
             {...register('title')}
           />
           {errors.title ? (
             <span className="error-message">{errors.title.message}</span>
           ) : (
             <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
               Ensure your title is descriptive enough for experts to understand the core issue at a glance.
             </p>
           )}
        </div>

        <div className="form-group">
           <label>Category</label>
           <div className="custom-dropdown-container" ref={dropdownRef}>
             <div 
               className={`custom-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             >
               <span>{selectedCategory}</span>
               <ChevronDown 
                 size={18} 
                 style={{ 
                   transition: 'transform 0.3s ease', 
                   transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                   opacity: 0.5
                 }} 
               />
             </div>
             
             {isDropdownOpen && (
               <div className="custom-dropdown-menu">
                 {CATEGORIES.map((category) => (
                   <div 
                     key={category} 
                     className={`custom-dropdown-option ${selectedCategory === category ? 'selected' : ''}`}
                     onClick={() => handleCategorySelect(category)}
                   >
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       {category}
                       {selectedCategory === category && <Check size={14} />}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
           {errors.category && <span className="error-message">{errors.category.message}</span>}
        </div>

        <div className="form-group">
           <label>Description</label>
           <textarea 
             rows="8" 
             placeholder="Context, what you've tried, constraints..."
             className={errors.description ? 'input-error' : ''}
             {...register('description')}
           ></textarea>
           {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        <div className="form-group">
           <label>Visual Context</label>
           <div 
             onClick={() => document.getElementById('knot-image-input').click()}
             style={{ 
               padding: imagePreview ? '1rem' : '3rem', 
               border: '2px dashed var(--outline-variant)', 
               borderRadius: 'var(--radius-md)', 
               textAlign: 'center', 
               backgroundColor: 'var(--surface)', 
               cursor: 'pointer', 
               transition: 'all 0.2s ease',
               position: 'relative',
               overflow: 'hidden',
               minHeight: '120px',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center'
             }}
           >
             {imagePreview ? (
               <div style={{ width: '100%', position: 'relative' }}>
                 <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem' }} />
                 <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Click to change image</div>
               </div>
             ) : (
               <>
                 <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                 <p style={{ margin: 0 }}>Select or drag visual assets here</p>
                 <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.7 }}>PNG, JPG up to 5MB</p>
               </>
             )}
             <input 
               id="knot-image-input"
               type="file" 
               accept="image/*"
               onChange={onFileChange}
               style={{ display: 'none' }}
             />
           </div>
           <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
             Highlighting specific details or diagrams can help contextualize your knot more effectively.
           </p>
        </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'var(--spacing-8)', alignItems: 'center' }}>
            {saveSuccess && <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Draft saved!</span>}
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isSavingDraft ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Draft
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isPending || isUploading}
            >
              {isPending || isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Publish to Archive'}
            </button>
         </div>
      </form>
      <div className="spacer-y-8"></div>
    </div>
  );
}
