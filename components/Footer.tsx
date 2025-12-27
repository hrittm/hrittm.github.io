import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 py-12 md:px-12 border-t border-white/5 bg-black z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Copyright / Left Text */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
            Est. 2025 &copy; Hrittick
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex-1 flex justify-center gap-8 order-1 md:order-2">
          <SocialLink href="https://github.com/hrittm" label="GitHub">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </SocialLink>
          
          <SocialLink href="https://x.com/hrittm" label="Twitter">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </SocialLink>

          <SocialLink href="https://instagram.com/0xhrit" label="Instagram">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </SocialLink>

          <SocialLink href="https://linkedin.com/in/hrittick" label="LinkedIn">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </SocialLink>

          <SocialLink href="mailto:thathrimondal@gmail.com" label="Email">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </SocialLink>
        </div>

        {/* Status / Right Text */}
        <div className="flex-1 text-center md:text-right order-3">
          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
            :: On Development
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, children, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-gray-500 hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </a>
);

export default Footer;