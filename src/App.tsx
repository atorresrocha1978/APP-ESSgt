/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { MainMenuHub } from './components/MainMenuHub';
import { WaitingRoomTV } from './components/WaitingRoomTV';
import { ReceptionView } from './components/ReceptionView';
import { DoctorRoomView } from './components/DoctorRoomView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ManagerReportsView } from './components/ManagerReportsView';
import { SettingsView } from './components/SettingsView';
import { CallModalAlert } from './components/CallModalAlert';

const AppContent: React.FC = () => {
  const { activeTab, currentUser } = useClinic();

  // If user is not authenticated, show the Login Screen
  if (!currentUser) {
    return <LoginView />;
  }

  // If user is in TV Totem mode and on TV tab, show full screen TV directly
  if (currentUser.role === 'painel_tv' && activeTab === 'tv') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans">
        <WaitingRoomTV />
        <CallModalAlert />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/60 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'menu' && <MainMenuHub />}
        {activeTab === 'tv' && <WaitingRoomTV />}
        {activeTab === 'recepcao' && <ReceptionView />}
        {activeTab === 'consultorios' && <DoctorRoomView />}
        {(activeTab === 'admin' || activeTab === 'usuarios') && <AdminDashboardView />}
        {activeTab === 'gestao' && <ManagerReportsView />}
        {activeTab === 'configuracoes' && <SettingsView />}
      </main>

      <CallModalAlert />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
}

