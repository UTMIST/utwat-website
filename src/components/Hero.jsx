import { useState, useEffect } from 'react';
import { Calendar, MapPin, Terminal } from 'lucide-react';
import handImg from '../assets/hand.png';
import wataiLogoImg from '../assets/wat-ai-logo.avif';
import utmistLogoWithTextImg from '../assets/utmist-logo-with-text.png';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2026-06-26T09:00:00-04:00');

    const updateTimer = () => {
      const difference = +targetDate - +new Date();
      
      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isExpired: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      const offset = 80;
      window.scrollTo({
        top: el.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-16">
      {/* Background Graphic System */}
      <div className="absolute inset-0 z-0 bg-transparent">
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-primary-container/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary-container/10 blur-[130px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 network-pattern opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-gutter text-center">
        
        {/* Location & Time Indicator badge */}
        <div className="inline-block animate-float rounded-full border border-primary/20 bg-primary-container/10 px-6 py-2 backdrop-blur-md mb-8">
          <span className="flex items-center justify-center gap-3 font-mono text-xs font-semibold tracking-wider text-primary-fixed-dim uppercase">
            <MapPin size={14} className="text-secondary-fixed animate-pulse" /> 
            TORONTO, ONTARIO, CANADA
            <span className="h-1.5 w-1.5 rounded-full bg-primary/45" /> 
            <Calendar size={14} className="text-primary" />
            LATE JUNE 2026
          </span>
        </div>

        {/* ========== MAIN TITLE CARD ========== */}
        <div
          className="relative mx-auto max-w-4xl px-4 select-none z-10 mb-64 sm:mb-80"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="relative transition-transform duration-500 flex flex-col items-center"
            style={{ transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'none' }}
          >
            {/* Layer 1: Box Background & Border */}
            <div className="absolute inset-0 rounded-[1.5rem] border border-primary/40 bg-surface-container-lowest/40 backdrop-blur-sm shadow-[0_0_40px_rgba(46,91,255,0.15)] z-0" />
            
            {/* Layer 2: Hand Image */}
            <img 
              src={handImg}
              alt=""
              className="absolute -bottom-56 sm:-bottom-72 left-1/2 -translate-x-1/2 w-[110%] max-w-[700px] pointer-events-none z-10"
              style={{ objectFit: 'contain' }}
            />

            {/* Presenters Badge */}
            <div className="relative z-20 mt-8 sm:mt-10 flex items-center gap-3.5 select-none">
              <img src={utmistLogoWithTextImg} alt="UTMIST" className="h-8 sm:h-11 w-auto object-contain" />
              <span className="text-white/25 text-xs sm:text-sm font-mono font-bold">x</span>
              <img src={wataiLogoImg} alt="Wat.ai" className="h-8 sm:h-11 w-auto object-contain" />
            </div>

            {/* Layer 3: Text */}
            <h1 className="relative z-20 font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-0 uppercase leading-[1.05] text-center px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim via-primary-container to-secondary-fixed">
              BATTLE OF THE
              <br />
              <span className="italic text-secondary-fixed drop-shadow-[0_0_35px_rgba(255,225,109,0.85)]">
                SCHOOLS
              </span>
            </h1>
          </div>
        </div>

        <p className="relative z-10 font-sans text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          The ultimate inter-collegiate arena for the next generation of AI pioneers. Represent your school, solve challenging ML problems, and claim the ultimate glory for your institution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button onClick={() => handleScroll('#organizations')} className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyber-blue to-primary-container px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-glow-blue transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Terminal size={16} className="text-secondary-fixed animate-pulse" />
            Enter the Arena
          </button>
          
          {/* <button onClick={() => handleScroll('#missions')} className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-10 py-5 text-sm font-bold uppercase tracking-widest text-primary-fixed-dim hover:border-primary hover:bg-primary/10 transition-all duration-300 active:scale-[0.98]">
            <Cpu size={16} className="text-secondary-container" />
            View Missions
          </button> */}
        </div>

        {!timeLeft.isExpired && (
          <div className="glass-panel max-w-3xl mx-auto p-8 rounded-3xl border border-primary/10 backdrop-blur-2xl">
            <div className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-outline mb-4 font-bold flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              HACKATHON STARTS IN
            </div>
            
            <div className="grid grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.value !== undefined ? timeLeft.hours : timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((timeUnit, i) => (
                <div key={timeUnit.label} className="relative py-2 sm:py-4">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl" />
                  <div className="relative font-mono text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-on-surface to-on-surface-variant drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] leading-none mb-2">
                    {String(timeUnit.value).padStart(2, '0')}
                  </div>
                  <div className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-primary-fixed-dim font-bold">
                    {timeUnit.label}
                  </div>
                  {i < 3 && (
                    <span className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 font-mono text-2xl text-primary/30">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
