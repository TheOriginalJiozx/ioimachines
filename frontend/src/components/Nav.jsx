import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/ioimachines_logo.png'

const navLinks = ["Home", "Services", "Case Studies", "About Us", "Contact", "Admin"];
const navDropdown = {
  Services: [
    { name: "Feasibility Study", path: "/services/feasibility-study" },
    { name: "Turnkey Solutions", path: "/services/turnkey-solutions" },
    { name: "IP Core Licensing", path: "/services/ip-core-licensing" },
  ],
};

export default function Nav() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    try {
      const pathname = location.pathname.replace(/^\/+|\/+$/g, "");
      const slug = pathname.split("/")[0];

      const index = navLinks.findIndex((nav) => {
        const linkSlug = nav === "Home" ? "" : nav.toLowerCase().replace(/\s+/g, "-").replace(/\/+$/g, "");
        return linkSlug === slug;
      });
      setActive(index >= 0 ? index : 0);
    } catch (error) {
      alert("Navigation error: " + error.message);
    }
  }, [location]);

  useEffect(() => {
    try {
      const pathname = location.pathname.replace(/^\/+|\/+$/g, "");
      const slug = pathname.split("/")[0];

      const serviceIndex = navDropdown["Services"].findIndex((item) => {
        const itemSlug = item.path.replace(/^\/+|\/+$/g, "").split("/")[0];
        return itemSlug === slug;
      });
      if (serviceIndex >= 0) {
        setActive(navLinks.indexOf("Services"));
        return;
      }

      const index = navLinks.findIndex((nav) => {
        const linkSlug = nav === "Home" ? "" : nav.toLowerCase().replace(/\s+/g, "-").replace(/\/+$/g, "");
        return linkSlug === slug;
      });
      setActive(index >= 0 ? index : 0);
    } catch (error) {
      alert("Navigation error: " + error.message);
    }
  }, [location]);

  useEffect(() => {
    const check = () => setIsAdmin(!!localStorage.getItem("adminToken"));
    check();
    const onStorage = (event) => {
      if (event.key === "adminToken") check();
    };
    const onCustom = () => check();
    window.addEventListener("storage", onStorage);
    window.addEventListener("admin-auth-changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("admin-auth-changed", onCustom);
    };
  }, []);

  function logout() {
    localStorage.removeItem("adminToken");
    window.dispatchEvent(new Event("admin-auth-changed"));
    setActive(0);
    navigate("/");
  }

  return (
    <nav className="top-0 left-0 right-0 bg-white z-50 border-b relative -mb-6">
      <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
        <a href="/" className="flex items-center">
          <img src={logo} alt="IOIMachines logo" className="md:w-50 md:h-50 object-contain" />
        </a>
        <button onClick={() => setOpen((open) => !open)} className="ml-auto block md:hidden p-2 rounded focus:outline-none z-50" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        <div className="hidden md:flex items-center ml-auto justify-end text-[14px] text-[#444444] font-semibold">
          {navLinks.map((link, index) => {
            if (link === "Admin" && isAdmin) return null;
            const path = link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, "-").replace(/\/+$/g, "")}`;

            if (link === "Services") {
              return (
                <span key={link} className="relative group flex items-center">
                  <a href={path} onClick={() => setActive(index)} className={`py-2 px-8 ${active === index ? "bg-black text-white" : "text-[#444444] hover:text-[#444444]"}`}>
                    {link}
                  </a>
                  <div className="absolute left-0 top-full mt-0 bg-white border shadow-lg w-56 invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-10">
                    {navDropdown["Services"].map((item) => (
                      <a key={item.name} href={item.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {item.name}
                      </a>
                    ))}
                  </div>
                  {index < navLinks.length - 1 && (
                    <span aria-hidden="true" className="text-[#000000] text-xl">
                      |
                    </span>
                  )}
                </span>
              );
            }

            return (
              <span key={link} className="flex items-center">
                <a href={path} onClick={() => setActive(index)} className={`py-2 px-8 ${active === index ? "bg-black text-white" : "text-[#444444] hover:text-[#444444]"}`}>
                  {link}
                </a>
                {index < navLinks.length - 1 && (
                  <span aria-hidden="true" className="text-[#000000] text-xl">
                    |
                  </span>
                )}
              </span>
            );
          })}
          {isAdmin ? (
            <button onClick={logout} className="ml-4 bg-white border px-4 py-2 rounded text-sm text-[#444444] hover:bg-gray-100">
              Logout
            </button>
          ) : null}
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link, index) => {
              const path = link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, "-").replace(/\/+$/, "")}`;
              return (
                <a
                  key={link}
                  href={path}
                  onClick={() => {
                    setOpen(false);
                    setActive(index);
                  }}
                  className="block px-3 py-2 rounded text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  {link}
                </a>
              );
            })}
            {isAdmin ? (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left block px-3 py-2 rounded text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <a href="/admin" className="block px-3 py-2 rounded text-base font-medium text-gray-700 hover:bg-gray-100">
                Admin
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
