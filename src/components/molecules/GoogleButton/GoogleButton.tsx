import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@atoms/icons/GoogleIcon';
import React from 'react';

const GoogleButton = () => {
  return (
    <Button
      variant={'outline'}
      className="transition-shadow duration-300 hover:bg-accent hover:border-accent-foreground "
    >
      Continue with Google
      <GoogleIcon />
    </Button>
  );
};

export default GoogleButton;
