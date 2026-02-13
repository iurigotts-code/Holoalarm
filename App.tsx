
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alarm, UserProfile, AppView } from './types';
import { speakMessage, stylizeAvatar } from './services/geminiService';
import MainDashboard from './components/MainDashboard';
import SettingsView from './components/SettingsView';
import AlarmTriggerOverlay from './components/AlarmTriggerOverlay';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.MAIN);
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('holo_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('holo_profile');
    return saved ? JSON.parse(saved) : { name: 'User', photoBase64: null, voiceName: 'Kore' };
  });
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('holo_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('holo_profile', JSON.stringify(profile));
  }, [profile]);

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check alarms
      const currentHM = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const triggered = alarms.find(a => a.enabled && a.time === currentHM);
      if (triggered && !activeAlarm && view !== AppView.ALARMING) {
        setActiveAlarm(triggered);
        setView(AppView.ALARMING);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, activeAlarm, view]);

  const handleAddAlarm = (alarm: Alarm) => {
    setAlarms(prev => [...prev, alarm]);
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const stopAlarm = () => {
    setView(AppView.MAIN);
    setActiveAlarm(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white relative flex flex-col items-center">
      {view === AppView.MAIN && (
        <MainDashboard 
          currentTime={currentTime}
          alarms={alarms}
          onAdd={handleAddAlarm}
          onDelete={handleDeleteAlarm}
          onToggle={handleToggleAlarm}
          onOpenSettings={() => setView(AppView.SETTINGS)}
          profile={profile}
        />
      )}

      {view === AppView.SETTINGS && (
        <SettingsView 
          profile={profile}
          onSave={(p) => {
            handleUpdateProfile(p);
            setView(AppView.MAIN);
          }}
          onBack={() => setView(AppView.MAIN)}
        />
      )}

      {view === AppView.ALARMING && activeAlarm && (
        <AlarmTriggerOverlay 
          alarm={activeAlarm}
          profile={profile}
          onDismiss={stopAlarm}
        />
      )}
    </div>
  );
};

export default App;
