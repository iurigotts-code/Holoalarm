
import React, { useState } from 'react';
import { Alarm, UserProfile } from '../types';
import { Clock, Plus, Settings, Trash2, Bell, BellOff } from 'lucide-react';

interface Props {
  currentTime: Date;
  alarms: Alarm[];
  onAdd: (a: Alarm) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onOpenSettings: () => void;
  profile: UserProfile;
}

const MainDashboard: React.FC<Props> = ({ currentTime, alarms, onAdd, onDelete, onToggle, onOpenSettings, profile }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState("08:00");
  const [newLabel, setNewLabel] = useState("");

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const handleSave = () => {
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      label: newLabel || "Alarm",
      enabled: true,
      repeat: []
    });
    setIsAdding(false);
    setNewLabel("");
  };

  return (
    <div className="w-full max-w-lg px-6 py-12 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-900">
            {profile.photoBase64 ? (
              <img src={`data:image/png;base64,${profile.photoBase64}`} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-cyan-500">?</div>
            )}
          </div>
          <span className="font-semibold text-cyan-500 uppercase tracking-widest text-xs">HoloAlarm v1.0</span>
        </div>
        <button onClick={onOpenSettings} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-7xl font-light tracking-tighter mb-2 font-mono">{timeString}</h1>
        <p className="text-gray-400 uppercase tracking-widest text-sm">{dateString}</p>
      </div>

      <div className="w-full space-y-4 mb-24">
        {alarms.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-500 italic">No alarms set</div>
        )}

        {alarms.map(alarm => (
          <div key={alarm.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-3xl font-mono text-white leading-none">{alarm.time}</span>
              <span className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{alarm.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onToggle(alarm.id)}
                className={`p-2 rounded-full transition-all ${alarm.enabled ? 'bg-cyan-500/20 text-cyan-500' : 'bg-gray-800 text-gray-500'}`}
              >
                {alarm.enabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
              <button 
                onClick={() => onDelete(alarm.id)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="bg-white/5 border-2 border-cyan-500/30 p-6 rounded-2xl animate-pulse-slow">
            <div className="flex flex-col gap-4">
              <input 
                type="time" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-transparent text-4xl font-mono text-center outline-none border-b border-white/20 pb-2"
              />
              <input 
                type="text" 
                placeholder="Label" 
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="bg-transparent text-sm text-center outline-none placeholder:text-gray-600"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-2 bg-cyan-500 text-black text-sm uppercase font-bold tracking-widest rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-10 p-5 bg-cyan-500 text-black rounded-full shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default MainDashboard;
