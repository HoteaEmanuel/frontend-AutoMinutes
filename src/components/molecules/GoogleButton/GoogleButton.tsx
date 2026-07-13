import { Button } from '@/components/ui/button';
import { googleAuth } from '@/features/auth/api/auth.api';
import { GoogleIcon } from '@atoms/icons/GoogleIcon';
import { toast } from 'sonner';

const GoogleButton = () => {
  const handleGoogleAuth = () => {
    try {
      googleAuth();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Button
      variant={'outline'}
      type="button"
      onClick={handleGoogleAuth}
      className="transition-shadow duration-300 hover:bg-accent hover:border-accent-foreground "
    >
      Continue with Google
      <GoogleIcon />
    </Button>
  );
};

export default GoogleButton;
