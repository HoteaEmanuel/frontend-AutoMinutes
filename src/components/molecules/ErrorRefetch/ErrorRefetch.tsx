import { Button } from '@/components/ui/button';
import { ERRORS } from '@/constants/errors';
import useRefresh from '@/features/auth/hooks/useRefresh';
import { CircleAlert } from 'lucide-react';

type ErrorRefetchProps = {
  errorMessage: string;
  refetch: () => void;
};
const ErrorRefetch = ({ errorMessage, refetch }: ErrorRefetchProps) => {
  const { mutate: refresh } = useRefresh();
  return (
    <Button
      onClick={() => {
        if (errorMessage === ERRORS.AUTHENTICATION) refresh();
        refetch();
      }}
      variant={'destructive'}
      className={'py-8 w-sm mx-auto'}
    >
      <div className="flex gap-2 items-center">
        <CircleAlert className="text-red-500 size-7" />
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold">Something went wrong!</p>
          <p className="text-xs">Try again</p>
        </div>
      </div>
    </Button>
  );
};

export default ErrorRefetch;
