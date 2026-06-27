import { Mail, Globe, Sparkles } from "lucide-react";
import steelLogo from "../assets/steel-logo.svg";
import shopifyLogo from "../assets/shopify-logo.svg";

export default function Sponsors() {
  const premierSponsors = [
    {
      name: "Shopify",
      logoUrl: shopifyLogo,
      web: "https://shopify.com",
      borderGlow:
        "hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    },
    {
      name: "Steel",
      logoUrl: steelLogo,
      web: "https://steel.dev",
      borderGlow:
        "hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(245,217,10,0.18)]",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="sponsors">
      {/* Dynamic ambient graphic */}
      <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-secondary-container/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-container-max px-gutter relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-md border border-primary/10 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest font-bold">
            03 // SPONSORS
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
            Our <span className="text-primary italic">Sponsors</span>
          </h2>
          <p className="font-sans text-on-surface-variant leading-relaxed">
            The industry leaders driving machine learning innovation and funding
            the next generation of builders.
          </p>
        </div>

        {/* Sponsor Banner Box */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-primary/10 bg-surface-container-lowest/80 backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {premierSponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.web}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative bg-white/95 p-8 rounded-2xl flex items-center justify-center w-full max-w-[320px] h-36 shadow-xl hover:scale-105 transition-all duration-300 ${sponsor.borderGlow}`}
              >
                <img
                  alt={`${sponsor.name} Logo`}
                  className="max-h-16 max-w-full object-contain pointer-events-none"
                  src={sponsor.logoUrl}
                />

                {/* Micro interactive indicator */}
                <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[8px] font-mono text-gray-400 uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">
                  <Globe size={8} /> Visit Site
                </span>
              </a>
            ))}

            {/* More sponsors to come */}
            <div className="relative flex flex-col items-center justify-center gap-2 w-full max-w-[320px] h-36 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] text-center">
              <span className="font-display text-2xl font-black uppercase tracking-wider text-primary-fixed-dim">
                & More
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="mt-16 text-center space-y-4">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.25em] flex items-center justify-center gap-2">
              <Sparkles
                size={14}
                className="text-secondary-fixed animate-spin"
                style={{ animationDuration: "4s" }}
              />
              Interested in sponsoring?
            </p>
            <div>
              <a
                href="mailto:r342shar@uwaterloo.ca"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-primary/30 text-sm font-bold uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Mail
                  size={16}
                  className="text-primary-fixed-dim group-hover:animate-bounce"
                />
                Become a Partner
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
