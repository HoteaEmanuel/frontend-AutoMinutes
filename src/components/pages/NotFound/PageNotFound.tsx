import { Button } from '@/components/ui/button';
import { useRedirect } from '@/hooks/useRedirectAfterDelay';
import { Link, useNavigate } from 'react-router';
import { DELAY_MS } from '@/constants/delay';
const PageNotFound = () => {
  const navigate = useNavigate();
  useRedirect(DELAY_MS);
  return (
    <div className="max-6xl">
      <div className="flex flex-col gap-4 justify-center h-screen">
        <h1 className="font-bold text-9xl">404</h1>
        <p className="text-xl">Oops! This page was not found!</p>
        <div className="flex justify-center items-center gap-4">
          <Button variant={'link'}>
            <Link to={'/dashboard'}>Home</Link>
          </Button>

          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
