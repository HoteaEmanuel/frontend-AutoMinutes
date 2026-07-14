import Home from '@pages/LandingPage/LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeContextProvider } from './features/theme/ThemeProvider';
import SignupPage from '@pages/Auth/SignupPage';
import LoginPage from '@pages/Auth/LoginPage';
import { Toaster } from 'sonner';
import Oauth from '@pages/Oauth/Oauth';
import ProtectedRoute from '@pages/Protected/ProtectedRoute';
import LandingPage from '@pages/LandingPage/LandingPage';
import UnprotectedRoute from '@pages/Unprotected/UnprotectedRoute';
import useInitAuth from '@/features/auth/hooks/useInitAuth';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Loader2 } from 'lucide-react';
function App() {
  useInitAuth();
  const status = useAuthStore((s) => s.status);
  if (status === 'pending') {
    return (
      <ThemeContextProvider>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin size-10" />
        </div>
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UnprotectedRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/oauth" element={<Oauth />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeContextProvider>
  );
}

export default App;
