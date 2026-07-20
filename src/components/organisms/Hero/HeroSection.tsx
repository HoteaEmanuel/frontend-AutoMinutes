import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[radial-gradient(600px_300px_at_80%_-10%,rgba(45,196,176,0.35),transparent),linear-gradient(160deg,#084a44,#063733_70%)]">
      <h1 className="text-5xl text-white font-bold">Turn Minutes Into Actionable Minutes</h1>
      <Button className={'w-sm mx-auto p-5'}>
        <Link to={'/auth/signup'}>Get started</Link>
      </Button>
    </div>
  );
};

export default HeroSection;
