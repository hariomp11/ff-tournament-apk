import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { db } from './db';

/* ================= AUTH CONTEXT ================= */

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

/* ================= PROTECTED ROUTE ================= */

const ADMIN_EMAIL = 'gameversenexus@gmail.com';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && user.email !== ADMIN_EMAIL) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/* ================= IMPORT SCREENS ================= */

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

/* ================= APP ================= */

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------- Restore Session -------- */
  useEffect(() => {
    const savedUser = db.getCurrentUser();

    if (savedUser) {
      const freshUser = db.getUsers().find(u => u.id === savedUser.id);
      if (freshUser && !freshUser.isBlocked) {
        setUser(freshUser);
        db.setCurrentUser(freshUser);
      } else {
        db.setCurrentUser(null);
      }
    }

    setTimeout(() => setLoading(false), 1200);
  }, []);

  /* -------- LOGIN (FIXED) -------- */
  const login = async (email: string, pass: string): Promise<boolean> => {
    // Clear any old session
    db.setCurrentUser(null);
    setUser(null);

    const users = db.getUsers();
    const found = users.find(u => u.email === email);

    if (!found) return false;
    if (found.isBlocked) {
      alert('Your account is blocked.');
      return false;
    }

    // STRICT password check
    if (found.password !== pass) {
      return false;
    }

    setUser(found);
    db.setCurrentUser(found);
    return true;
  };

  /* -------- SIGNUP -------- */
  const signup = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ) => {
    const users = db.getUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      password: pass,
      role: email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.PLAYER,
      walletBalance: 0,
      isBlocked: false,
      createdAt: Date.now(),
    };

    db.setUsers([...users, newUser]);
    setUser(newUser);
    db.setCurrentUser(newUser);
  };

  /* -------- LOGOUT -------- */
  const logout = () => {
    db.setCurrentUser(null);
    setUser(null);
  };

  /* -------- REFRESH USER -------- */
  const refreshUser = () => {
    if (!user) return;
    const latest = db.getUsers().find(u => u.id === user.id);
    if (latest) {
      setUser(latest);
      db.setCurrentUser(latest);
    }
  };

  if (loading) return <SplashScreen />;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser }}>
      <Router>
        <div className="min-h-screen pb-20">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/home" /> : <LoginScreen />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/home" /> : <RegisterScreen />}
            />

            {/* PLAYER ROUTES */}
            <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute><MatchDetailsScreen /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletScreen /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositScreen /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawScreen /></ProtectedRoute>} />
            <Route path="/my-matches" element={<ProtectedRoute><MyMatchesScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />

            {/* ADMIN ROUTES */}
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
