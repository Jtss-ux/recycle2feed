import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { KioskPage } from './pages/KioskPage';
import { ImpactPage } from './pages/ImpactPage';
import { OperatorPage } from './pages/OperatorPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-paper text-charcoal">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/kiosk" element={<KioskPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/operator" element={<OperatorPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
