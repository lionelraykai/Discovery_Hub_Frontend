import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';

export const useDrafts = () => {
  return useQuery({
    queryKey: ['drafts'],
    queryFn: async () => {
      const response = await api.get('/drafts');
      return response.data;
    },
  });
};

export const useDraft = (id) => {
  return useQuery({
    queryKey: ['draft', id],
    queryFn: async () => {
      const response = await api.get(`/drafts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpsertDraftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draftData) => {
      const response = await api.post('/drafts', draftData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['drafts']);
      queryClient.invalidateQueries(['draft', data._id]);
    },
  });
};

export const useDeleteDraftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draftId) => {
      const response = await api.delete(`/drafts/${draftId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['drafts']);
    },
  });
};
