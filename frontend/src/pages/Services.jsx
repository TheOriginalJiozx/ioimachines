import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function Services() {
  const cards = [
    { title: "Long-Term Partnership & Support", desc: "We focus on building long-term partnerships with our customers, ensuring continuous support and close..." },
    { title: "System Maintenance & Upgrades", desc: "We provide ongoing system maintenance and upgrades to ensure optimal performance, even under unpredictable..." },
    { title: "IP Core Licensing", desc: "For customers seeking full ownership, we offer our IP core in encrypted form, enabling seamless integration while..." },
    { title: "Training & Knowledge Transfer", desc: "We conduct comprehensive training sessions to equip customer personnel with the skills needed to operate and maintain..." },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  const modalTexts = {
    "Long-Term Partnership & Support": `We focus on building long-term partnerships with our customers, ensuring continuous support and close collaboration throughout the system’s lifecycle to maximize value and satisfaction.`,
    "System Maintenance & Upgrades": `We provide ongoing system maintenance and upgrades to ensure optimal performance, even under unpredictable product variations and changing environmental conditions.`,
    "IP Core Licensing": `For customers seeking full ownership, we offer our IP core in encrypted form, enabling seamless integration while protecting intellectual property.`,
    "Training & Knowledge Transfer": `We conduct comprehensive training sessions to equip customer personnel with the skills needed to operate and maintain the system using in-house competencies.`,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Services");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.18 },
    );

    const els = Array.from(document.querySelectorAll(".enter-up"));
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans">
      <section className="relative w-full">
        <div className="w-full h-full md:h-200 bg-gray-100 overflow-hidden">
          <img src="/services.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))'}}>Services Offered</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="border-text border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">Services</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map(({ title, desc }, i) => (
              <div key={title} className="bg-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 enter-up pop" style={{ "--i": i }}>
                <div className="w-16 h-16 flex-shrink-0 rounded-full border border-black bg-[#D6D6D6] flex items-center justify-center text-gray-500 overflow-hidden">
                  {title === "Long-Term Partnership & Support" ? (
                    <i className="fas fa-handshake text-white text-2xl icon-tilt" aria-hidden="true" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))' }}></i>
                  ) : title === "System Maintenance & Upgrades" ? (
                    <i className="fas fa-tools text-white text-2xl icon-tilt" aria-hidden="true" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))' }}></i>
                  ) : title === "IP Core Licensing" ? (
                    <i className="fas fa-lock text-white text-2xl icon-tilt" aria-hidden="true" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))' }}></i>
                  ) : title === "Training & Knowledge Transfer" ? (
                    <i className="fas fa-user-graduate text-white text-2xl icon-tilt" aria-hidden="true" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))' }}></i>
                  ) : (
                    <span className="w-8 h-8 block" aria-hidden="true" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-base">{title}</h3>
                  <p className="mt-2 text-sm text-[#606060] whitespace-pre-line">{desc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalTitle(title);
                      setModalBody(modalTexts[title] || desc);
                      setModalOpen(true);
                    }}
                    className="mt-3 inline-block text-sm text-[#606060] hover:underline"
                  >
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-start">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Custom AI-Based Vision Solutions</h2>
            <div className="mt-6 bg-white/5 p-4 rounded">
              <p className="text-white">We design and implement custom machine vision solutions powered by AI, tailored to the specific requirements of each application and production environment.</p>
              <p className="mt-4 font-semibold">Our solutions are built to adapt to:</p>
              <ul className="mt-3 space-y-2 text-white text-sm list-inside pl-4">
                <li className="flex items-start">
                  <i className="fas fa-box mr-3 mt-1 text-white"></i>Product and surface variations
                </li>
                <li className="flex items-start">
                  <i className="fas fa-bug mr-3 mt-1 text-white"></i>New defect types
                </li>
                <li className="flex items-start">
                  <i className="fas fa-sync-alt mr-3 mt-1 text-white"></i>Changing production conditions
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 0 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-rocket icon-tilt"></i>
              </div>
              <div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Faster Deployment</p>
                  <p className="text-sm text-black mt-1">Quick, low-friction deployment so you start inspecting sooner.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 1 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-server icon-tilt"></i>
              </div>
              <div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Scalable Performance</p>
                  <p className="text-sm text-black mt-1">From single stations to high-throughput lines — performance scales with you.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 2 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-headset icon-tilt"></i>
              </div>
              <div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Continuous Support</p>
                  <p className="text-sm text-black mt-1">Ongoing service and expertise to keep your inspection running.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-[#444444]">
              System Maintenance and
              <br /> Continuous Optimization
            </h3>
            <p className="mt-4 text-gray-600">IOIMACHINES provides ongoing hardware and software maintenance services directly at the factory floor.</p>

            <div className="mt-6">
              <p className="font-semibold text-gray-700">Our services include:</p>
              <ul className="mt-3 text-gray-600 space-y-2 pl-5 list-disc">
                <li>Preventive and corrective system maintenance</li>
                <li>Software updates and algorithm improvements</li>
                <li>Hardware upgrades and system extensions</li>
                <li>Performance tuning to ensure stable, reliable inspection</li>
              </ul>
            </div>

            <p className="mt-4 text-gray-700">This ensures continuous, optimal operation over time — even in unpredictable production environments.</p>
          </div>

          <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800">Full Ownership Option</h4>
            <p className="mt-3 text-gray-600">For customers who require full ownership of their vision system, IOIMACHINES offers its proprietary IP core in encrypted form.</p>

            <p className="mt-4 font-semibold text-gray-700">To support independent operation, we provide:</p>
            <ul className="mt-3 text-gray-600 space-y-2 pl-5 list-disc">
              <li>Training sessions for engineering and maintenance teams</li>
              <li>Knowledge transfer for system operation and upkeep</li>
              <li>Support in building in-house competencies</li>
            </ul>

            <p className="mt-4 text-gray-700">This enables customers to operate, maintain, and evolve their systems independently while protecting IOIMACHINES’ intellectual property.</p>
          </aside>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <GetAdvice />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <Features />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <ContactCase />

      <div class="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">{modalBody}</div>
            <div className="mt-6 text-right">
              <button onClick={() => setModalOpen(false)} className="bg-[#444444] text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
