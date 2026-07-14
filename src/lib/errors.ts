import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message[0][0].toUpperCase() + data.message[0].slice(1)
        : data.message[0].toUpperCase() + data.message.slice(1);
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};
