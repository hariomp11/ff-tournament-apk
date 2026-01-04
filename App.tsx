
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { db } from './db';

// --- Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- Protected Route ---
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== UserRole.ADMIN) return <Navigate to="/home" replace />;
  return <>{children}</>;
};

// --- Components ---
import Navbar from './components/Navbar';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MatchDetailsScreen from './screens/MatchDetailsScreen';
import WalletScreen from './screens/WalletScreen';
import DepositScreen from './screens/DepositScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import MyMatchesScreen from './screens/MyMatchesScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import CreateMatchScreen from './screens/admin/CreateMatchScreen';
import ManageMatchScreen from './screens/admin/ManageMatchScreen';
import PaymentApprovals from './screens/admin/PaymentApprovals';
import WithdrawApprovals from './screens/admin/WithdrawApprovals';
import UserManagement from './screens/admin/UserManagement';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      // Sync with latest DB state
      const allUsers = db.getUsers();
      const latest = allUsers.find(u => u.id === currentUser.id);
      if (latest) {
        setUser(latest);
        db.setCurrentUser(latest);
      }
    }
    
    // Fake splash delay
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users = db.getUsers();
    // In this mock, password is just 'password' or same as email for simplicity
    const found = users.find(u => u.email === email);
    if (found) {
      if (found.isBlocked) {
        alert("Your account is blocked. Please contact support.");
        return false;
      }
      setUser(found);
      db.setCurrentUser(found);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, phone: string, pass: string) => {
    const users = db.getUsers();
    if (users.find(u => u.email === email)) throw new Error("User already exists");
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role: email.includes('admin') ? UserRole.ADMIN : UserRole.PLAYER,
      walletBalance: 0,
      isBlocked: false,
      createdAt: Date.now()
    };
    
    const updated = [...users, newUser];
    db.setUsers(updated);
    setUser(newUser);
    db.setCurrentUser(newUser);
  };

  const logout = () => {
    setUser(null);
    db.setCurrentUser(null);
  };

  const refreshUser = () => {
    if (user) {
      const users = db.getUsers();
      const latest = users.find(u => u.id === user.id);
      if (latest) {
        setUser(latest);
        db.setCurrentUser(latest);
      }
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser }}>
      <Router>
        <div className="min-h-screen pb-20">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginScreen />} />
            <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterScreen />} />
            
            {/* Player Routes */}
            <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute><MatchDetailsScreen /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositScreen /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawScreen /></ProtectedRoute>} />
            <Route path="/my-matches" element={<ProtectedRoute><MyMatchesScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/create-match" element={<ProtectedRoute adminOnly><CreateMatchScreen /></ProtectedRoute>} />
            <Route path="/admin/manage-match/:id" element={<ProtectedRoute adminOnly><ManageMatchScreen /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute adminOnly><PaymentApprovals /></ProtectedRoute>} />
            <Route path="/admin/withdraws" element={<ProtectedRoute adminOnly><WithdrawApprovals /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
          {user && <Navbar />}
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
