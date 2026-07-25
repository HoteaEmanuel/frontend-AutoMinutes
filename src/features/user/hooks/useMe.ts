import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '../api';

export const userKeys = {
  me: ['me'] as const,
};

export const useMe = () =>
  useQuery({
    queryKey: userKeys.me,
    queryFn: fetchMe,
  });
