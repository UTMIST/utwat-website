import { FaLinkedin } from "react-icons/fa";
import { FiMail, FiTerminal } from "react-icons/fi";

function LinkedInIcon(props) {
  return <FaLinkedin aria-hidden="true" {...props} />;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-surface-container-lowest relative border-t border-primary/10 overflow-hidden">
      {/* Subtle glowing lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="px-gutter py-16 max-w-container-max mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Brand Column */}
          <div className="space-y-4 text-center md:text-left max-w-sm">
            <a
              href="#"
              onClick={handleScrollToTop}
              className="font-display text-3xl font-black tracking-tight text-white uppercase"
            >
              BOTS{" "}
              <span className="text-secondary-fixed font-light text-2xl">
                2026
              </span>
            </a>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
              The premier inter-collegiate battlefield for artificial
              intelligence and machine learning. Co-hosted by North America's
              top AI clubs.
            </p>

            {/* Social & Contact Buttons */}
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="https://ca.linkedin.com/company/wat-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary hover:bg-amber-600 hover:text-white transition-all duration-300"
                aria-label="Wat AI LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href="https://ca.linkedin.com/company/utmist"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary hover:bg-[#002B5C] hover:text-white transition-all duration-300"
                aria-label="UTMIST LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>

              <a
                href="mailto:r342shar@uwaterloo.ca"
                className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300"
                aria-label="Email Contact"
              >
                <FiMail size={16} />
              </a>
            </div>
          </div>

          {/* Nav & Info Column */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <nav className="flex gap-8 font-sans text-xs uppercase tracking-widest">
              <a
                href="#about"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                About
              </a>
              {/* <a href="#missions" className="text-on-surface-variant hover:text-primary transition-colors">Missions</a> */}
              <a
                href="#organizations"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Organizers
              </a>
              <a
                href="#faq"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="space-y-1.5 text-center md:text-right">
              <div className="text-on-surface-variant text-xs font-mono tracking-wider flex items-center justify-center md:justify-end gap-1.5">
                <FiTerminal size={12} className="text-primary-fixed-dim" />
                HOSTED BY UTMIST X WAT.AI
              </div>
              <div className="text-outline text-[10px] font-sans">
                &copy; {currentYear} BATTLE OF THE SCHOOLS. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
