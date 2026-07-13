import Home from '@pages/LandingPage/LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeContextProvider } from './features/theme/ThemeProvider';
import SignupPage from '@pages/Auth/SignupPage';
import LoginPage from '@pages/Auth/LoginPage';
import { Toaster } from 'sonner';
function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeContextProvider>
  );
}

export default App;
