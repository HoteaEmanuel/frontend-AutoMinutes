import Home from '@pages/LandingPage/LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeContextProvider } from './features/theme/ThemeProvider';
import SignupPage from '@pages/Auth/SignupPage';
import LoginPage from '@pages/Auth/LoginPage';
import { Toaster } from 'sonner';
import Oauth from '@pages/Oauth/Oauth';
import ProtectedRoute from '@pages/Protected/ProtectedRoute';
function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/oauth" element={<Oauth />} />
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
