
import React from 'react';
import StarBackground from './components/StarBackground';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Projects from './components/Projects';

const App: React.FC = () => {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black text-white font-sans antialiased">
      <StarBackground />
      <Navbar />
      
      <div className="relative z-10 flex flex-col">
        <Hero 
          title="hrittick" 
          subtitle="student [ philomath & tech-savvy ]" 
        />
        <About />
        <Projects />
      </div>

      <Footer />
    </main>
  );
};

export default App;