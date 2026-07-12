import React from 'react';
import { X, Linkedin, Shield, Server, Cpu, Cloud, Globe, ExternalLink, Award } from 'lucide-react';

interface InstructorModalProps {
  onClose: () => void;
}

export function InstructorModal({ onClose }: InstructorModalProps) {
  return (
    <div className="fixed inset-0 bg-[#010915]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Cinematic Modal Container */}
      <div className="relative w-full max-w-lg bg-[#020f23]/95 border-2 border-[#113a5d] p-8 shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden">
        
        {/* Neon Aesthetic Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]" />

        {/* Ambient background grid or glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-radial from-[#2496ed]/15 to-transparent blur-3xl -z-10" />

        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#969696] hover:text-[#00f0ff] transition-colors cursor-pointer p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Instructor Content Profile Card */}
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Avatar Section (Interactive badge with Cyber Initials & Rotating Glow Rings) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2496ed] to-[#00f0ff] rounded-none blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            
            {/* Spinning decorative ring */}
            <div className="absolute -inset-1.5 border border-dashed border-[#00f0ff]/45 animate-[spin_20s_linear_infinite]" />
            
            <div className="relative w-24 h-24 bg-[#010a17] border-2 border-[#00f0ff] flex items-center justify-center select-none">
              <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ffffff] tracking-wider">
                AW
              </span>
              
              {/* Cyber indicator label */}
              <div className="absolute bottom-0 right-0 bg-[#00f0ff] text-[#010915] text-[7px] font-mono font-bold px-1 py-0.5 uppercase">
                Host
              </div>
            </div>
          </div>

          {/* Instructor Identity Info */}
          <div>
            <h2 className="text-[#ffffff] font-sans font-bold text-2xl uppercase tracking-[0.1em]">
              Ahmed Wael
            </h2>
            <p className="text-[#00f0ff] text-xs font-mono uppercase tracking-[0.18em] mt-1.5 flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5 animate-bounce" />
              Cloud Engineer & System Admin
            </p>
          </div>

          <div className="w-full border-t border-[#113a5d]/40 my-1" />

          {/* Bio Description Details */}
          <p className="text-xs text-[#969696] leading-relaxed max-w-sm font-sans">
            A seasoned professional specializing in designing enterprise-grade server architectures, containerized microservice deployments, and robust cloud-native system pipelines. Leading continuous deployment and systems engineering for high-availability setups.
          </p>

          {/* Tech stack highlights */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center py-2">
            <div className="bg-[#0c2336]/40 border border-[#113a5d]/70 p-2 flex flex-col items-center gap-1">
              <Cloud className="w-4 h-4 text-[#2496ed]" />
              <span className="text-[9px] font-mono uppercase text-white tracking-wider">Cloud Infra</span>
            </div>
            <div className="bg-[#0c2336]/40 border border-[#113a5d]/70 p-2 flex flex-col items-center gap-1">
              <Server className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-[9px] font-mono uppercase text-white tracking-wider">SysAdmin</span>
            </div>
            <div className="bg-[#0c2336]/40 border border-[#113a5d]/70 p-2 flex flex-col items-center gap-1">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono uppercase text-white tracking-wider">Containers</span>
            </div>
          </div>

          {/* Interactive LinkedIn CTA Link */}
          <a
            href="https://linkedin.com/in/ahmedmediaworkx"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-gradient-to-r from-[#2496ed]/20 to-[#00f0ff]/20 border border-[#2496ed] hover:from-[#2496ed] hover:to-[#00f0ff] text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(36,150,237,0.15)] group"
          >
            <Linkedin className="w-4 h-4 text-[#00f0ff] group-hover:text-white group-hover:scale-110 transition-all" />
            <span>Connect on LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Verification Badge */}
          <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase text-[#969696]">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Verified Course Instructor Profile</span>
          </div>

        </div>
      </div>
    </div>
  );
}
