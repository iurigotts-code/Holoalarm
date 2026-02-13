
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, Camera, User, Volume2, Sparkles } from 'lucide-react';
import { stylizeAvatar } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ profile, onSave, onBack }) => {
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState(profile.photoBase64);
  const [voice, setVoice] = useState(profile.voiceName);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIHologram = async () => {
    if (!photo) return;
    setIsProcessing(true);
    const stylized = await stylizeAvatar(photo);
    if (stylized) {
      setPhoto(stylized);
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-lg px-6 py-12 min-h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold tracking-widest uppercase">Profile Settings</h2>
      </div>

      <div className="flex flex-col items-center mb-10 group relative">
        <div className="w-40 h-40 rounded-full border-4 border-cyan-500/30 overflow-hidden bg-gray-900 relative">
          {photo ? (
            <img src={`data:image/png;base64,${photo}`} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <User size={48} className="mb-2 opacity-20" />
              <span className="text-[10px] uppercase tracking-tighter">No Image</span>
            </div>
          )}
          
          <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera size={24} className="text-cyan-500" />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        
        {photo && (
          <button 
            onClick={generateAIHologram}
            disabled={isProcessing}
            className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <Sparkles size={14} />
            {isProcessing ? "Processing..." : "AI Hologramify"}
          </button>
        )}
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 px-1">Identity</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
            <User size={18} className="text-cyan-500" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white font-medium"
              placeholder="Your Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 px-1">AI Voice Modulation</label>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
            <Volume2 size={18} className="text-cyan-500" />
            <select 
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white font-medium appearance-none cursor-pointer"
            >
              <option value="Kore" className="bg-gray-900">Kore (Authoritative)</option>
              <option value="Puck" className="bg-gray-900">Puck (Cheerful)</option>
              <option value="Charon" className="bg-gray-900">Charon (Calm)</option>
              <option value="Zephyr" className="bg-gray-900">Zephyr (Soft)</option>
              <option value="Fenrir" className="bg-gray-900">Fenrir (Deep)</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSave({ name, photoBase64: photo, voiceName: voice })}
        className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 active:scale-95 transition-all mt-8"
      >
        Sync Profile
      </button>
    </div>
  );
};

export default SettingsView;
