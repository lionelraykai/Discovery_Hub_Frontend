import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';

export const useKnots = (category = '') => {
  return useQuery({
    queryKey: ['knots', category],
    queryFn: async () => {
      const response = await api.get('/knots', {
        params: { category }
      });
      return response.data;
    },
  });
};

export const useCreateKnotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (knotData) => {
      const response = await api.post('/knots', knotData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knots']);
    },
  });
};

export const useVoteKnotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (knotId) => {
      const response = await api.post(`/knots/${knotId}/vote`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knots']);
    },
  });
};
export const useDownvoteKnotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (knotId) => {
      const response = await api.post(`/knots/${knotId}/downvote`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knots']);
    },
  });
};
export const useKnot = (id) => {
  return useQuery({
    queryKey: ['knot', id],
    queryFn: async () => {
      const response = await api.get(`/knots/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
export const useAddSolutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ knotId, content }) => {
      const response = await api.post(`/knots/${knotId}/solutions`, { content });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['knot', variables.knotId]);
    },
  });
};

export const useMarkSolutionCorrectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ knotId, solutionId }) => {
      const response = await api.patch(`/knots/${knotId}/solutions/${solutionId}/correct`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['knot', variables.knotId]);
    },
  });
};

export const useVoteSolutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ knotId, solutionId }) => {
      const response = await api.patch(`/knots/${knotId}/solutions/${solutionId}/vote`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['knot', variables.knotId]);
    },
  });
};

export const useAddReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ knotId, solutionId, content }) => {
      const response = await api.post(`/knots/${knotId}/solutions/${solutionId}/reply`, { content });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['knot', variables.knotId]);
    },
  });
};
