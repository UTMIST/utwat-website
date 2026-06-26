import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import OrgSpotlight from '../components/OrgSpotlight';
// import Missions from '../components/Missions';
import Sponsors from '../components/Sponsors';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-on-surface font-sans selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Cyber Grid Network background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#11131c]/60" />
        <div className="absolute inset-0 network-pattern opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Translucent Navigation */}
        <Navbar />

        {/* Full Page Main sections */}
        <main className="flex-grow">
          {/* Cyber countdown hero introduction */}
          <Hero />

          {/* Core concept introduction */}
          <About />

          {/* Host Organizations comparison stats showcase */}
          <OrgSpotlight />

          {/* Hackathon track missions command center */}
          {/* <Missions /> */}

          {/* Sponsor titan grids */}
          <Sponsors />

          {/* Accordion protocols briefing */}
          <Faq />
        </main>

        {/* Cyber bottom footer information log */}
        <Footer />
      </div>
    </div>
  );
}
