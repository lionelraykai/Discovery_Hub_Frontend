import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get('/blogs');
      return response.data;
    },
  });
};

export const useBlog = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData) => {
      const response = await api.post('/blogs', blogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
    },
  });
};

export const useLikeBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId) => {
      const response = await api.post(`/blogs/${blogId}/like`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog', variables]);
      queryClient.invalidateQueries(['blogs']);
    },
  });
};

export const useCommentBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogId, content }) => {
      const response = await api.post(`/blogs/${blogId}/comment`, { content });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog', variables.blogId]);
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId) => {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
    },
  });
};
