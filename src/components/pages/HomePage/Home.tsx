import { useTheme } from '@/features/theme/useTheme';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Link } from 'react-router';
const Home = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="">
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant={'outline'}>
        {theme === 'dark' ? <Moon /> : <Sun />}
      </Button>
      <h1 className="text-2xl">Homepage</h1>
      <Button asChild>
        <Link to={'/signup'}>Get started </Link>
      </Button>
    </div>
  );
};

export default Home;
