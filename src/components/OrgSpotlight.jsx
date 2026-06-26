import { useState } from 'react';
import { BookOpen, GraduationCap, Compass, Users, Network, TrendingUp } from 'lucide-react';
import wataiLogoImg from '../assets/wat-ai-logo.avif';
import utmistLogoImg from '../assets/utmist-logo.png';
import utmistLogoWithTextImg from '../assets/utmist-logo-with-text.png';

export default function OrgSpotlight() {
  const [activeOrg, setActiveOrg] = useState('utmist'); // 'utmist' or 'watai'

  const utmistStats = [
    { label: 'AI/ML Projects', val: '60+', desc: 'Research & implementation models', icon: Compass },
    { label: 'Developers', val: '400+', desc: 'Active student contributors', icon: Users },
    { label: 'Articles', val: '50+', desc: 'Technical writeups published', icon: BookOpen },
    { label: 'Workshops', val: '25+', desc: 'Academic masterclasses taught', icon: GraduationCap }
  ];

  const wataiStats = [
    { label: 'AI/ML Projects', val: '40+', desc: 'Industry-partnered builds', icon: Compass },
    { label: 'Program Graduates', val: '450+', desc: 'Elite practitioners trained', icon: GraduationCap },
    { label: 'Articles & Notebooks', val: '20+', desc: 'Research artifacts published', icon: BookOpen },
    { label: 'Active Partnerships', val: '12+', desc: 'Enterprise integrations', icon: Network }
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="organizations">
      {/* Background Graphic Glow determined by active tab (Blue vs Gold) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-[160px] transition-all duration-700 ease-in-out opacity-25 ${
          activeOrg === 'utmist' ? 'bg-primary-container' : 'bg-secondary-container'
        }`} />
        <div className="absolute inset-0 network-pattern opacity-5" />
      </div>

      <div className="mx-auto max-w-container-max px-gutter relative z-10">
        
        {/* Header Brief */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-md border border-primary/10 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest font-bold">
            02 // HOSTED BY
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
            Our <span className="text-primary italic">Organizers</span>
          </h2>
          <p className="font-sans text-on-surface-variant leading-relaxed">
            Brought to you by North America's premier undergraduate AI organizations. We are uniting our communities to host an unforgettable hackathon experience.
          </p>
        </div>

        {/* Dynamic Dual-Tab System (Combines U of T Blue and Waterloo Gold) */}
        <div className="flex justify-center mb-12">
          <div className="relative flex rounded-full border border-white/10 bg-surface-container-lowest p-1.5 backdrop-blur-xl">
            {/* Sliding backdrop */}
            <div 
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-12px)] rounded-full transition-all duration-300 ease-out ${
                activeOrg === 'utmist' 
                  ? 'translate-x-0 bg-primary-container/20 border border-primary/30 shadow-[0_0_15px_rgba(46,91,255,0.25)]' 
                  : 'translate-x-full bg-secondary-container/10 border border-secondary-container/20 shadow-[0_0_15px_rgba(255,219,60,0.15)]'
              }`}
            />
            
            <button 
              onClick={() => setActiveOrg('utmist')}
              className={`relative z-10 px-8 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center ${
                activeOrg === 'utmist' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <img src={utmistLogoImg} alt="UTMIST" className="h-5 w-auto object-contain" />
            </button>
            
            <button 
              onClick={() => setActiveOrg('watai')}
              className={`relative z-10 px-8 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center ${
                activeOrg === 'watai' ? 'text-secondary-fixed' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <img src={wataiLogoImg} alt="Waterloo AI" className="h-5 w-auto object-contain" />
            </button>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Organization Summary & Dynamic Stats (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* dynamic background panel card */}
            <div className={`glass-panel p-8 sm:p-10 rounded-3xl border transition-all duration-500 ease-in-out ${
              activeOrg === 'utmist' ? 'glass-panel-blue' : 'glass-panel-gold'
            }`}>
              
              {/* Org Introduction Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-black text-white flex items-center">
                      {activeOrg === 'utmist' ? (
                        <img src={utmistLogoWithTextImg} alt="UTMIST" className="h-9 sm:h-11 w-auto object-contain" />
                      ) : (
                        <img src={wataiLogoImg} alt="Waterloo AI" className="h-9 sm:h-11 w-auto object-contain" />
                      )}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-outline">
                      {activeOrg === 'utmist' ? 'University of Toronto Community' : 'Waterloo Artificial Intelligence Club'}
                    </p>
                  </div>
                </div>

                <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed font-light">
                  {activeOrg === 'utmist' 
                    ? "UTMIST is North America’s largest undergraduate AI/ML community! We run student-led projects, hands-on workshops, and flagship conferences and hackathons, making AI/ML accessible to everyone who’s curious and motivated."
                    : "Our goal is to establish an environment to enable the continued growth of AI talent and suitable access to opportunities within the Waterloo community. We provide opportunities for undergraduate and graduate students to engage in impactful projects through collaboration with companies and internal research."
                  }
                </p>
              </div>

              {/* Dynamic stats cards list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
                {(activeOrg === 'utmist' ? utmistStats : wataiStats).map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-primary/60 font-mono text-[10px] uppercase tracking-wider">
                        <Icon size={12} className={activeOrg === 'utmist' ? 'text-primary' : 'text-secondary-fixed'} />
                        {stat.label}
                      </div>
                      
                      <div className={`font-mono text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                        activeOrg === 'utmist' ? 'text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(184,195,255,0.3)]' : 'text-secondary-fixed drop-shadow-[0_0_8px_rgba(255,225,109,0.2)]'
                      }`}>
                        {stat.val}
                      </div>
                      
                      <p className="font-sans text-[10px] sm:text-xs text-outline leading-tight">{stat.desc}</p>
                    </div>
                  );
                })}
              </div>

            </div>



          </div>

          {/* Right Column: Social Media Reach Cards (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Instagram Statistics Card */}
            <div className={`glass-panel p-6 rounded-2xl border bg-surface-container-low/60 backdrop-blur-xl hover:translate-y-[-2px] transition-all duration-300 ${
              activeOrg === 'utmist' ? 'border-primary/10' : 'border-secondary-container/10'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-outline">Instagram</span>
                  <h4 className="font-display text-base font-bold text-white mt-1">Community</h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-white">
                    {activeOrg === 'utmist' ? '5,400+' : '1,600+'}
                  </span>
                  <span className="font-sans text-xs text-outline">followers</span>
                </div>


              </div>
            </div>

            {/* LinkedIn Statistics Card */}
            <div className={`glass-panel p-6 rounded-2xl border bg-surface-container-low/60 backdrop-blur-xl hover:translate-y-[-2px] transition-all duration-300 ${
              activeOrg === 'utmist' ? 'border-primary/10' : 'border-secondary-container/10'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-outline">LinkedIn</span>
                  <h4 className="font-display text-base font-bold text-white mt-1">Network</h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-white">
                    {activeOrg === 'utmist' ? '3,600+' : '2,000+'}
                  </span>
                  <span className="font-sans text-xs text-outline">subscribers</span>
                </div>


              </div>
            </div>



          </div>

        </div>

      </div>
    </section>
  );
}
