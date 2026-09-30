import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { PrivacyDisclaimer } from './components/common/PrivacyDisclaimer';
import { LandingPage } from './components/landing/LandingPage';
import { VictimDashboard } from './components/victim/VictimDashboard';
import { VictimLogin } from './components/victim/VictimLogin';
import { CheckInWizard } from './components/victim/CheckInWizard';
import { ProfessionalDashboard } from './components/professional/ProfessionalDashboard';
import { ProfessionalLogin } from './components/professional/ProfessionalLogin';

function MainApp() {
  const { currentUser, role, switchRole } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [targetCaseId, setTargetCaseId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToCase = (caseId: string) => {
    setTargetCaseId(caseId);
    if (role === 'victim' || !currentUser) {
      switchRole('counsellor');
    }
    setCurrentView('professional');
  };

  return (
    <div className="min-h-screen bg-[#070E0B] text-slate-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Prototype Privacy & Disclaimer Banner */}
      <PrivacyDisclaimer />

      {/* Primary Sticky Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {/* Victim Portal: Authenticated vs Login View */}
        {currentView === 'victim' && (
          currentUser && role === 'victim' ? (
            <VictimDashboard
              onStartCheckIn={() => handleNavigate('checkin')}
            />
          ) : (
            <VictimLogin
              onLoginSuccess={() => handleNavigate('victim')}
              onSwitchToProfessional={() => handleNavigate('professional-login')}
              onBackToHome={() => handleNavigate('landing')}
            />
          )
        )}

        {currentView === 'victim-login' && (
          <VictimLogin
            onLoginSuccess={() => handleNavigate('victim')}
            onSwitchToProfessional={() => handleNavigate('professional-login')}
            onBackToHome={() => handleNavigate('landing')}
          />
        )}

        {currentView === 'checkin' && (
          currentUser && role === 'victim' ? (
            <CheckInWizard
              onBack={() => handleNavigate('victim')}
              onCompleted={() => handleNavigate('victim')}
            />
          ) : (
            <VictimLogin
              onLoginSuccess={() => handleNavigate('checkin')}
              onSwitchToProfessional={() => handleNavigate('professional-login')}
              onBackToHome={() => handleNavigate('landing')}
            />
          )
        )}

        {/* Professional Portal: Authenticated vs Login View */}
        {currentView === 'professional' && (
          currentUser && (role === 'counsellor' || role === 'admin') ? (
            <ProfessionalDashboard
              initialCaseId={targetCaseId}
            />
          ) : (
            <ProfessionalLogin
              onLoginSuccess={() => handleNavigate('professional')}
              onSwitchToVictim={() => handleNavigate('victim-login')}
              onBackToHome={() => handleNavigate('landing')}
            />
          )
        )}

        {currentView === 'professional-login' && (
          <ProfessionalLogin
            onLoginSuccess={() => handleNavigate('professional')}
            onSwitchToVictim={() => handleNavigate('victim-login')}
            onBackToHome={() => handleNavigate('landing')}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
