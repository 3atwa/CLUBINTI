import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Profile } from './pages/Profile';
import { ClubProfile } from './pages/ClubProfile';
import { TopClubs } from './pages/TopClubs';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeToggle } from './components/ThemeToggle';
import { useAuth } from './context/AuthContext';

function App() {
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={isAuthenticated? <Profile />: <Navigate to='/login' />} />
        <Route path="/club/:id" element={<ClubProfile />} />
        <Route path="/top-clubs" element={<TopClubs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      
      {/* Mobile theme toggle */}
      <div className="fixed bottom-20 right-4 sm:hidden z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App;