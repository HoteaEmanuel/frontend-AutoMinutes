import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createActionItem, deleteActionItem, updateActionItem } from '../api';
import { actionItemsKeys } from './useActionItems';

export const useCreateActionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActionItem,
    onSuccess: () => {
      toast.success('Action item created successfully!');
      queryClient.invalidateQueries({ queryKey: actionItemsKeys.all });
    },
  });
};

export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActionItem,
    onSuccess: () => {
      toast.success('Action item updated successfully!');
      queryClient.invalidateQueries({ queryKey: actionItemsKeys.all });
    },
  });
};

export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActionItem,
    onSuccess: () => {
      toast.success('Action item deleted successfully!');
      queryClient.invalidateQueries({ queryKey: actionItemsKeys.all });
    },
  });
};
