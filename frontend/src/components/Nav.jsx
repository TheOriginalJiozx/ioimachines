import { useState, useEffect } from 'react';

const navLinks = ['Home','Services','Case Studies','About Us','Contact'];

export default function Nav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    try {
      const path = window.location.pathname.replace('/', '') || 'Home';
      const idx = navLinks.findIndex(n => n.toLowerCase().includes(path.toLowerCase()));
      if (idx >= 0) setActive(idx);
    } catch (e) {}
  }, []);

  return (
    <nav className="top-0 left-0 right-0 bg-white z-50 border-b relative -mb-6">
      <div className="max-w-6xl mx-auto flex items-center">
        <a href="/" className="flex items-center">
          <img src="/ioimachines_logo.png" alt="IOIMachines logo" className="w-40 h-40 object-contain" />
        </a>
        <div className="hidden md:flex items-center ml-auto justify-end text-[14px] text-[#444444] font-semibold">
          {navLinks.map((link, index) => {
            const path = link === 'Home' ? '/' : `/${link.toLowerCase().replace(/\s+/g, '-').replace(/\/+$/,'')}`;
            return (
              <span key={link} className="flex items-center">
                <a
                  href={path}
                  onClick={() => setActive(index)}
                  className={`py-2 px-8 ${active === index ? 'bg-black text-white' : 'text-[#444444] hover:text-[#444444]'}`}
                >
                  {link}
                </a>
                {index < navLinks.length - 1 && <span aria-hidden="true" className="text-[#000000] text-xl">|</span>}
              </span>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
