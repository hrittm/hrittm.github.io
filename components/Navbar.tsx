import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'py-4 bg-black/60 backdrop-blur-md border-b border-white/5 pointer-events-auto' 
          : 'py-6 md:py-8 bg-transparent pointer-events-none'
      }`}
    >
      {/* Logo / Name */}
      <div className="pointer-events-auto">
        <a href="/" className="text-xl md:text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
          hrit.
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-4 md:gap-8 pointer-events-auto">
        <a 
          href="#about" 
          className="text-[10px] md:text-xs font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
        >
          About
        </a>
        <a 
          href="#projects" 
          className="text-[10px] md:text-xs font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
        >
          Projects
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
