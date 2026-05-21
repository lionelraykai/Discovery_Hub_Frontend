import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfile, useUpdateProfile } from '../hooks/useUserHooks';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Link as LinkIcon, Save, X, Trash2, Shield, Eye, Loader2, Camera } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be under 500 characters'),
  website: z.string().url('Invalid URL').or(z.string().length(0)),
  publicProfile: z.boolean(),
  avatar: z.string().optional(),
});

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const [charCount, setCharCount] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      website: '',
      publicProfile: true,
      avatar: '',
    }
  });

  const avatarValue = watch('avatar');

  const bioValue = watch('bio');

  useEffect(() => {
    if (profileData?.user) {
      const { user } = profileData;
      setValue('name', user.name);
      setValue('bio', user.bio || '');
      setValue('website', user.website || '');
      setValue('publicProfile', user.publicProfile);
      setValue('avatar', user.avatar || '');
      setAvatarPreview(user.avatar);
      setCharCount(user.bio?.length || 0);
    }
  }, [profileData, setValue]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    setIsUploading(true);
    setUploadError(null);

    try {
      const cloudinaryUrl = await uploadToCloudinary(file);
      console.log(cloudinaryUrl,'dslfs')
      setValue('avatar', cloudinaryUrl);
      setAvatarPreview(cloudinaryUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload image. Please try again.');
      // Revert to original if possible or show default
      setAvatarPreview(profileData?.user?.avatar);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setCharCount(bioValue?.length || 0);
  }, [bioValue]);

  const onSubmit = (data) => {
    updateProfile(data, {
      onSuccess: () => {
        navigate('/profile');
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-12)', maxWidth: '1000px' }}>
      <div style={{ margin: '3rem 0 4rem' }}>
        <p className="label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: '0.7rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
          ACCOUNT SETTINGS / EDIT PROFILE
        </p>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1 }}>
          Refine Your Identity.
        </h1>
        <p style={{ maxWidth: '520px', color: 'var(--on-surface-variant)', lineHeight: 1.6, fontSize: '1.1rem' }}>
          Your profile is the anchor of your contributions. Keep your information updated to maintain trust within the collective.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Avatar & Privacy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Avatar Component */}
          <div className="card-lifted" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 1.5rem' }}>
              <img 
                src={avatarPreview || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=48&h=48'} 
                alt="Profile Preview" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', opacity: isUploading ? 0.5 : 1 }} 
              />
              {isUploading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(140%, -140%)' }}>
                   <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                </div>
              )}
              <label 
                htmlFor="avatar-input"
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  right: '0', 
                  padding: '0.5rem', 
                  backgroundColor: 'var(--on-primary)', 
                  borderRadius: '50%', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid var(--surface-variant)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={20} color="var(--primary)" />
              </label>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Profile Picture</h3>
            {uploadError && <p style={{ color: 'var(--error)', fontSize: '0.7rem', marginBottom: '1rem' }}>{uploadError}</p>}
            <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>JPG or PNG. Max size 2MB.</p>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => document.getElementById('avatar-input').click()}
              disabled={isUploading}
            >
               {isUploading ? 'Uploading...' : 'Upload New'}
            </button>
          </div>

          {/* Visibility Box */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-low)', borderRadius: 'var(--radius-default)', border: '1px solid var(--surface-variant)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={16} color="var(--primary)" />
                  <h3 style={{ fontSize: '0.75rem', margin: 0, letterSpacing: '0.05em' }} className="label-caps">VISIBILITY</h3>
               </div>
               {/* Toggle Switch */}
               <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
                 <input 
                   type="checkbox" 
                   {...register('publicProfile')} 
                   style={{ opacity: 0, width: 0, height: 0 }}
                 />
                 <span className="slider round" style={{ 
                   position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                   backgroundColor: watch('publicProfile') ? 'var(--primary)' : '#ccc', 
                   transition: '.4s', borderRadius: '20px' 
                 }}>
                   <span style={{ 
                     position: 'absolute', height: '14px', width: '14px', left: watch('publicProfile') ? '17px' : '3px', bottom: '3px', 
                     backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                   }}></span>
                 </span>
               </label>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, margin: 0 }}>
               Your profile is currently <strong style={{ color: 'var(--on-surface)' }}>{watch('publicProfile') ? 'Public' : 'Private'}</strong>. Fellow problem solvers can {watch('publicProfile') ? 'view' : 'not view'} your bio and archive.
            </p>
          </div>
        </div>

        {/* Right Column: Main Form */}
        <div className="card-lifted" style={{ padding: '2.5rem' }}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="label-caps" style={{ fontSize: '0.65rem' }}>FULL NAME</label>
            <input 
              type="text" 
              {...register('name')}
              placeholder="Name" 
              style={{ padding: '1rem', backgroundColor: 'var(--surface-container-low)', border: 'none' }}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="label-caps" style={{ fontSize: '0.65rem' }}>PUBLIC BIO</label>
            <textarea 
              {...register('bio')}
              placeholder="A brief introduction..." 
              style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--surface-container-low)', 
                border: 'none',
                minHeight: '150px',
                resize: 'none'
              }}
              className={errors.bio ? 'input-error' : ''}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
               {errors.bio ? <span className="error-message">{errors.bio.message}</span> : <div />}
               <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>{charCount} / 500 CHARACTERS</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="label-caps" style={{ fontSize: '0.65rem' }}>WEBSITE / PORTFOLIO</label>
            <div style={{ position: 'relative' }}>
               <LinkIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', opacity: 0.5 }} />
               <input 
                 type="text" 
                 {...register('website')}
                 placeholder="https://your-site.com" 
                 style={{ padding: '1rem 1rem 1rem 3rem', backgroundColor: 'var(--surface-container-low)', border: 'none' }}
                 className={errors.website ? 'input-error' : ''}
               />
            </div>
            {errors.website && <span className="error-message">{errors.website.message}</span>}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes</>}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
          </div>

        </div>

      </form>

      {/* Account Privacy Section */}
      <div style={{ marginTop: '5rem', borderTop: '1px solid var(--surface-variant)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Account Privacy</h2>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Sensitive actions that affect your presence in the hub.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button type="button" style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--on-surface-variant)', 
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            <Shield size={18} />
            Deactivate Profile
          </button>
          <button type="button" style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--error)', 
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            <Trash2 size={18} />
            Delete Data
          </button>
        </div>
      </div>
    </div>
  );
}
