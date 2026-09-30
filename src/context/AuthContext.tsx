import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../services/mockData';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAsVictim: (params: { caseId: string; pin?: string }) => { success: boolean; error?: string };
  loginAsProfessional: (params: {
    email: string;
    password?: string;
    role?: UserRole;
    displayName?: string;
    department?: string;
    district?: string;
    badgeId?: string;
  }) => { success: boolean; error?: string };
  loginAsDemo: (roleType: 'victim' | 'counsellor' | 'admin') => void;
  loginWithEmail: (email: string, role: UserRole, displayName?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'psynova_auth_user_v4';

// Prototype-only credentials. Production authentication should be delegated to Firebase/Auth/SSO.
const DEMO_CASE_PINS: Record<string, string> = {
  'PSY-1024': '1024',
  'PSY-1028': '1028',
  'PSY-1042': '1042',
};

const DEMO_OFFICIAL_EMAILS = new Set([
  'dr.asharma@dmhp.gov.in',
  's.verma@welfare.gov.in',
  'k.meenakshi@dlsa.gov.in',
]);
const DEMO_OFFICIAL_PASSWORD = 'password123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const loginAsVictim = ({ caseId, pin }: { caseId: string; pin?: string }) => {
    const cleanId = caseId.trim().toUpperCase();
    if (!cleanId) {
      return { success: false, error: 'Please enter a valid Participant Case ID.' };
    }

    const expectedPin = DEMO_CASE_PINS[cleanId];
    if (!expectedPin) {
      return { success: false, error: 'Case ID not found in this prototype. Use one of the registered demo cases.' };
    }
    if (!pin || pin.trim() !== expectedPin) {
      return { success: false, error: 'Incorrect access PIN for this prototype case.' };
    }

    // Check if existing case exists in storage
    const existingCase = storageService.getCaseById(cleanId);

    const user: UserProfile = {
      uid: `user-vic-${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      email: `${cleanId.toLowerCase()}@anonymized.psynova.gov.in`,
      displayName: existingCase?.victimPseudonym || `Participant (${cleanId})`,
      role: 'victim',
      caseId: cleanId,
      badge: 'Confidential Case Participant',
    };

    setCurrentUser(user);

    storageService.addAuditLog({
      id: `LOG-AUTH-${Date.now()}`,
      actorId: user.uid,
      actorName: user.displayName,
      actorRole: 'victim',
      action: 'VICTIM_LOGIN',
      targetCaseId: cleanId,
      timestamp: new Date().toISOString(),
      details: `Participant signed in with confidential Case ID: ${cleanId}.`,
    });

    return { success: true };
  };

  const loginAsProfessional = ({
    email,
    password,
    role = 'counsellor',
    displayName,
    department,
    district,
    badgeId,
  }: {
    email: string;
    password?: string;
    role?: UserRole;
    displayName?: string;
    department?: string;
    district?: string;
    badgeId?: string;
  }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid official government or department email.' };
    }

    // The current build intentionally supports a small, explicit demo credential registry.
    // It must not be presented as production authentication.
    if (!DEMO_OFFICIAL_EMAILS.has(cleanEmail) || password !== DEMO_OFFICIAL_PASSWORD) {
      return { success: false, error: 'Prototype access denied. Select a registered demo official and use the displayed demo password.' };
    }

    const assignedName = displayName || (role === 'counsellor' ? 'Dr. Anita Sharma, M.Phil' : 'S. K. Verma, IAS');
    const assignedBadge = department || (role === 'counsellor' ? 'District Mental Health Program (DMHP)' : 'District Protection Officer');

    const user: UserProfile = {
      uid: `user-prof-${Date.now()}`,
      email: cleanEmail,
      displayName: assignedName,
      role: role === 'admin' ? 'admin' : 'counsellor',
      badge: assignedBadge,
      phone: '+91 94421 00812',
    };

    setCurrentUser(user);

    storageService.addAuditLog({
      id: `LOG-AUTH-${Date.now()}`,
      actorId: user.uid,
      actorName: user.displayName,
      actorRole: user.role,
      action: 'PROFESSIONAL_LOGIN',
      targetCaseId: district ? `DISTRICT-${district.toUpperCase()}` : 'SYSTEM',
      timestamp: new Date().toISOString(),
      details: `Prototype demo official session started: ${assignedName} (${cleanEmail}) [${assignedBadge} - ${district || 'Jurisdiction'}].`,
    });

    return { success: true };
  };

  const loginAsDemo = (roleType: 'victim' | 'counsellor' | 'admin') => {
    const user = DEMO_USERS[roleType];
    setCurrentUser(user);
    storageService.addAuditLog({
      id: `LOG-AUTH-${Date.now()}`,
      actorId: user.uid,
      actorName: user.displayName,
      actorRole: user.role,
      action: 'DEMO_LOGIN',
      targetCaseId: user.caseId || 'SYSTEM',
      timestamp: new Date().toISOString(),
      details: `User logged in using 1-click demo persona: ${user.displayName} (${user.role}).`,
    });
  };

  const loginWithEmail = (email: string, role: UserRole, displayName?: string) => {
    const newUser: UserProfile = {
      uid: `usr-${Date.now()}`,
      email,
      displayName: displayName || (email.split('@')[0].toUpperCase()),
      role,
      caseId: role === 'victim' ? 'PSY-1024' : undefined,
      badge: role === 'victim' ? 'Verified Participant' : (role === 'counsellor' ? 'Clinical Counsellor' : 'District Protection Official'),
    };
    setCurrentUser(newUser);
    storageService.addAuditLog({
      id: `LOG-AUTH-${Date.now()}`,
      actorId: newUser.uid,
      actorName: newUser.displayName,
      actorRole: newUser.role,
      action: 'CUSTOM_LOGIN',
      targetCaseId: newUser.caseId || 'SYSTEM',
      timestamp: new Date().toISOString(),
      details: `Custom authentication for ${email} with role: ${role}.`,
    });
  };

  const logout = () => {
    if (currentUser) {
      storageService.addAuditLog({
        id: `LOG-AUTH-${Date.now()}`,
        actorId: currentUser.uid,
        actorName: currentUser.displayName,
        actorRole: currentUser.role,
        action: 'LOGOUT',
        targetCaseId: currentUser.caseId || 'SYSTEM',
        timestamp: new Date().toISOString(),
        details: `User signed out.`,
      });
    }
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loginAsVictim,
        loginAsProfessional,
        loginAsDemo,
        loginWithEmail,
        logout,
        switchRole,
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
