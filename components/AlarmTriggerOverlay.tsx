
import React, { useEffect, useRef, useState } from 'react';
import { Alarm, UserProfile } from '../types';
import { speakMessage } from '../services/geminiService';
import { Power, User } from 'lucide-react';

interface Props {
  alarm: Alarm;
  profile: UserProfile;
  onDismiss: () => void;
}

const AlarmTriggerOverlay: React.FC<Props> = ({ alarm, profile, onDismiss }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextStarted = useRef(false);

  useEffect(() => {
    const triggerAudio = async () => {
      setIsSpeaking(true);
      const message = `Hello ${profile.name}. It is ${alarm.time}. Time to wake up and start your session for ${alarm.label}.`;
      await speakMessage(message, profile.voiceName);
      setIsSpeaking(false);
    };

    // Auto-trigger on mount
    triggerAudio();
  }, [alarm, profile]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-cyan-900/5 animate-pulse-slow pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 bg-[radial-gradient(circle,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Hologram Section */}
      <div className="relative w-full max-w-sm aspect-square mb-12 flex items-center justify-center">
        {/* Hologram Base Beam */}
        <div className="absolute bottom-[-20%] w-[120%] h-[40%] bg-cyan-500/20 blur-3xl rounded-[100%] animate-pulse" />
        <div className="absolute bottom-0 w-[60%] h-1 bg-cyan-500 shadow-[0_0_20px_rgba(0,255,255,1)] blur-sm" />

        {/* The "3D" Head */}
        <div className="hologram-effect relative w-64 h-64 md:w-80 md:h-80 transition-all duration-700">
           {/* Scanline Animation */}
           <div className="scanline" />
           
           <div className="w-full h-full rounded-full border-4 border-cyan-500/20 overflow-hidden bg-black/40 relative shadow-[0_0_50px_rgba(0,255,255,0.2)]">
             {profile.photoBase64 ? (
               <img 
                 src={`data:image/png;base64,${profile.photoBase64}`} 
                 className={`w-full h-full object-cover grayscale brightness-125 sepia-[0.3] hue-rotate-[160deg] contrast-125 ${isSpeaking ? 'scale-105 opacity-100' : 'scale-100 opacity-80'} transition-all duration-300`} 
                 alt="Hologram" 
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-cyan-500/30">
                 <User size={120} />
               </div>
             )}
             
             {/* Digital Noise / Glitch Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent pointer-events-none" />
           </div>

           {/* Audio Visualizer Rings */}
           {isSpeaking && (
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping opacity-20" />
                <div className="absolute -inset-4 border border-cyan-400 rounded-full animate-pulse opacity-10" />
             </div>
           )}
        </div>
      </div>

      <div className="text-center z-10">
        <h2 className="text-5xl font-mono text-cyan-400 mb-2 drop-shadow-glow">{alarm.time}</h2>
        <p className="text-xl font-light uppercase tracking-[0.3em] text-white/70 mb-12">
          {alarm.label}
        </p>
        
        <button 
          onClick={onDismiss}
          className="group relative flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          <Power className="group-hover:rotate-12 transition-transform" />
          Terminate Wake Sequence
        </button>
      </div>

      <style>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6));
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AlarmTriggerOverlay;
