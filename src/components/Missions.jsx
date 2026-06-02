import React, { useState } from 'react';
import { HeartPulse, FlaskConical, Cpu, ArrowRight, ShieldCheck, Database, Award } from 'lucide-react';

export default function Missions() {
  const [activeTrack, setActiveTrack] = useState('health');

  const tracks = [
    {
      id: 'health',
      title: 'ML in Health & Life Sciences',
      subtitle: 'Predictive bio-systems, health diagnostics, and medical imaging systems',
      icon: HeartPulse,
      accentClass: 'border-pink-500/20 text-pink-400 bg-pink-950/15',
      accentGlow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)] border-pink-500/40',
      tag: 'TRACK ALPHA',
      aim: 'Build ML models that analyze clinical telemetry, molecular compounds, or medical scans to predict anomalies with real-time feedback loops.',
      resources: [
        'Curated Healthcare Telemetry Datasets (e.g., mimic-iv, bio-signals)',
        'Compute Tokens for High-End GPU instances',
        'Biology Foundation Weights and Pre-trained Transformer Checkpoints'
      ],
      prizeCriteria: 'Clinical feasibility, low-latency prediction metrics, validation precision, and novel architecture choices.'
    },
    {
      id: 'science',
      title: 'Scientific ML & Physics Simulations',
      subtitle: 'Molecular modeling, quantum simulations, and chemistry ML engines',
      icon: FlaskConical,
      accentClass: 'border-blue-500/20 text-blue-400 bg-blue-950/15',
      accentGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/40',
      tag: 'TRACK BETA',
      aim: 'Accelerate scientific experimentation. Model molecular structures, predict chemical properties, or create low-fidelity physics simulation approximations using neural operators.',
      resources: [
        'Chemistry molecular property databases (QM9, PubChem bindings)',
        'Vite/WebGL client simulator frameworks',
        'Google Cloud High-Performance Compute nodes access'
      ],
      prizeCriteria: 'Solver acceleration factor, physical law conservation constraints, training efficiency, and visual simulation accuracy.'
    },
    {
      id: 'robotics',
      title: 'Edge AI & Intelligent Robotics',
      subtitle: 'Simulated robotics arms, navigation nets, and latency-optimized edge loops',
      icon: Cpu,
      accentClass: 'border-yellow-500/20 text-yellow-400 bg-yellow-950/15',
      accentGlow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)] border-yellow-500/40',
      tag: 'TRACK GAMMA',
      aim: 'Develop controllers and edge navigation models. program robotic manipulation arms, coordinate drones, or optimize models to run on latency-constrained edge hardware.',
      resources: [
        'Robotics kinematics simulations (Webots, MuJoCo interfaces)',
        'Edge device execution profiling tools',
        'Physical robotics assembly modules available on-site'
      ],
      prizeCriteria: 'Execution speed (FPS), mechanical motion precision, energy-efficiency profiles, and code robust-handling.'
    }
  ];

  const activeTrackData = tracks.find((t) => t.id === activeTrack);

  return (
    <section className="py-24 relative overflow-hidden bg-surface-container-low/30" id="missions">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-container-max px-gutter relative z-10">
        
        {/* Track Headers */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-md border border-primary/10 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest font-bold">
            03 // MISSION OBJECTIVES
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
            Arena <span className="text-primary italic">Missions</span>
          </h2>
          <p className="font-sans text-on-surface-variant leading-relaxed">
            The Battle of the Schools consists of three core engineering tracks. Select a mission below to view its specific briefings, compute resources, and prize criteria.
          </p>
        </div>

        {/* Missions Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Track Navigation list (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {tracks.map((track) => {
              const Icon = track.icon;
              const isActive = activeTrack === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl flex gap-5 items-center ${
                    isActive 
                      ? `glass-panel bg-surface-container-lowest/90 ${track.accentGlow}` 
                      : 'border-white/5 bg-surface-container-low/40 hover:bg-surface-container-low/80 hover:border-white/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    track.accentClass
                  } ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                    <Icon size={22} />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-outline-variant font-bold">
                      {track.tag}
                    </span>
                    <h3 className="font-display text-base font-bold text-white leading-tight">
                      {track.title}
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant font-light truncate max-w-[280px]">
                      {track.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Mission Briefing Display panel (7 Columns) */}
          <div className="lg:col-span-7">
            {activeTrackData && (
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-primary/10 bg-surface-container-lowest/80 backdrop-blur-2xl animate-fadeIn space-y-8">
                
                {/* Header tag */}
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <div>
                    <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
                      {activeTrackData.tag} // ARENA MISSION INTEL
                    </span>
                    <h4 className="font-display text-xl sm:text-2xl font-black text-white mt-1">
                      {activeTrackData.title}
                    </h4>
                  </div>
                  <span className="inline-block px-3 py-1 rounded bg-primary/15 border border-primary/20 font-mono text-[10px] text-primary-fixed-dim font-bold uppercase tracking-widest">
                    ACTIVE BRIEFING
                  </span>
                </div>

                {/* Core Objective Brief */}
                <div className="space-y-3">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-outline font-bold flex items-center gap-2">
                    <ShieldCheck size={14} className="text-primary" />
                    Mission Objective
                  </h5>
                  <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed font-light">
                    {activeTrackData.aim}
                  </p>
                </div>

                {/* Developer Resources & APIs */}
                <div className="space-y-4">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-outline font-bold flex items-center gap-2">
                    <Database size={14} className="text-secondary-fixed" />
                    Empowered Developer Resources
                  </h5>
                  <ul className="space-y-2.5">
                    {activeTrackData.resources.map((res, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-on-surface-variant font-sans">
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[9px] text-primary font-bold">
                          0{i + 1}
                        </span>
                        <span className="pt-0.5 font-light">{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evaluation Criteria */}
                <div className="rounded-2xl border border-white/5 bg-surface-container-low/50 p-6 space-y-3">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-outline font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-fixed">
                    <Award size={14} className="text-primary-fixed-dim" />
                    Maple Cup Evaluation Metrics
                  </h5>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-light">
                    {activeTrackData.prizeCriteria}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
