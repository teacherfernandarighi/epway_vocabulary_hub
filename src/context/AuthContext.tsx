import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase/config';
import { syncUserProfile, updateUserProfile } from '../services/firebase/firestore';
import { UserProfile } from '../types';
import { EPWAY_AVATAR_URL } from '../constants/assets';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  role: 'admin' | 'student';
  isAdmin: boolean;
  isTeacherAccount: boolean;
  isStudentPreviewMode: boolean;
  toggleStudentPreviewMode: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsTeacherDemo: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  recordActivity: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback demo users
const DEMO_USER: UserProfile = {
  uid: 'demo_epway_student_01',
  displayName: 'Aluno EPWAY (Demo)',
  email: 'aluno.epway@exemplo.com',
  photoURL: EPWAY_AVATAR_URL,
  role: 'student',
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  theme: 'light',
  createdAt: new Date().toISOString(),
  isDemo: true,
};

const TEACHER_USER: UserProfile = {
  uid: 'demo_epway_teacher_01',
  displayName: 'Professora Fernanda Righi',
  email: 'teacherfernandarighi@gmail.com',
  photoURL: EPWAY_AVATAR_URL,
  role: 'admin',
  streak: 30,
  lastActiveDate: new Date().toISOString().split('T')[0],
  theme: 'light',
  createdAt: new Date().toISOString(),
  isDemo: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStudentPreviewMode, setIsStudentPreviewMode] = useState(false);

  useEffect(() => {
    // Check if demo user saved in session
    const savedDemo = sessionStorage.getItem('epway_demo_user');
    if (savedDemo) {
      setUser(JSON.parse(savedDemo));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const isTeacher =
          fbUser.email === 'teacherfernandarighi@gmail.com' ||
          fbUser.email?.toLowerCase().includes('teacher') ||
          fbUser.email?.toLowerCase().includes('professora');

        try {
          const profile = await syncUserProfile({
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            role: isTeacher ? 'admin' : 'student',
          });
          setUser(profile);
        } catch (err) {
          console.error('Failed to sync profile on auth change:', err);
          // Local profile fallback
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || (isTeacher ? 'Professora Fernanda' : 'Aluno EPWAY'),
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            role: isTeacher ? 'admin' : 'student',
            streak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            theme: 'light',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isTeacherAccount = Boolean(
    user?.role === 'admin' ||
    user?.email === 'teacherfernandarighi@gmail.com' ||
    user?.email?.toLowerCase().includes('teacher') ||
    user?.email?.toLowerCase().includes('professora')
  );

  const isAdmin = isTeacherAccount && !isStudentPreviewMode;
  const role: 'admin' | 'student' = isAdmin ? 'admin' : 'student';

  const toggleStudentPreviewMode = () => {
    setIsStudentPreviewMode((prev) => !prev);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google Popup blocked or failed, attempting redirect:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          console.error('Google Redirect failed:', redirectErr);
          throw redirectErr;
        }
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await firebaseUpdateProfile(res.user, { displayName: name });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = () => {
    sessionStorage.setItem('epway_demo_user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  };

  const loginAsTeacherDemo = () => {
    sessionStorage.setItem('epway_demo_user', JSON.stringify(TEACHER_USER));
    setUser(TEACHER_USER);
  };

  const logout = async () => {
    sessionStorage.removeItem('epway_demo_user');
    setIsStudentPreviewMode(false);
    if (firebaseUser) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (user.isDemo) {
      sessionStorage.setItem('epway_demo_user', JSON.stringify(updated));
    } else {
      await updateUserProfile(user.uid, updates);
    }
  };

  const recordActivity = async () => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate === todayStr) return;

    let newStreak = user.streak || 1;
    if (user.lastActiveDate) {
      const lastDate = new Date(user.lastActiveDate);
      const currDate = new Date(todayStr);
      const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await updateUser({
      streak: newStreak,
      lastActiveDate: todayStr,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        role,
        isAdmin,
        isTeacherAccount,
        isStudentPreviewMode,
        toggleStudentPreviewMode,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsDemoUser,
        loginAsTeacherDemo,
        logout,
        updateUser,
        recordActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
