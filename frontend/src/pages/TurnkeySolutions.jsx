import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";

export default function TurnkeySolutions() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Turnkey Solutions");
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

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
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/turnkey_img1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                Turnkey Solutions
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <img src="/turnkey_img2.jpg" alt="turnkey-solutions" className="w-full md:h-[28rem] object-cover rounded shadow" />
              <div className="mt-4 text-[#444444] text-[15px] space-y-3">
                <div>IOIMACHINES develops custom machine vision systems for different applications such as surface inspection and fabric quality control.</div>
                <div>Our systems build on our proprietary algorithms for feature detection combined with machine learning and artificial intelligence.</div>
                <div>Our software runs on Windows-based computers with GPUs to accelerate computations.</div>
                <div>For extreme high-speed applications we implement our proprietary FPGA-based acceleration hardware.</div>
                <h3 className="text-[24px] font-semibold text-[#222222]">Service Description</h3>
                <div>IOIMACHINES Vision engineers have extensive experience in designing, manufacturing, implementing, testing and validating machine vision solutions.</div>
                <ul className="mt-4 list-disc list-outside pl-8 space-y-2 text-[15px]">
                  <li className="text-[#444444]">Starting at your production site, we evaluate possibility to build in-line machine vision inspection station.</li>
                  <li className="text-[#444444]">Produce a specification document describing desired performance parameters and system components.</li>
                  <li className="text-[#444444]">Build the system at our production facilities and perform tests to identify any issues and correct them prior to shipment.</li>
                  <li className="text-[#444444]">Install the system at your site and perform a site acceptance test to ensure that it works optimally in the production environment.</li>
                </ul>
                <h3 className="text-[24px] font-semibold text-[#222222]">Inhouse Competencies</h3>
                <div>Our competency area covers:</div>
                <ul className="mt-4 list-disc list-outside pl-8 space-y-2 text-[15px]">
                  <li className="text-[#444444]">Machine and computer vision algorithms.</li>
                  <li className="text-[#444444]">Design and implementation of vision algorithms in FPGAs and SoCs (System on Chip).</li>
                  <li className="text-[#444444]">2D industrial cameras.</li>
                  <li className="text-[#444444]">3D sensors for 3D measurements of defect size.</li>
                  <li className="text-[#444444]">Lighting technologies and schemes.</li>
                  <li className="text-[#444444]">Design and implementation of automation systems including PLCs, robotics and conveyor belts.</li>
                  <li className="text-[#444444]">Sensor interfaces.</li>
                  <li className="text-[#444444]">Electronic and mechanical system design.</li>
                </ul>
                <img src="/turnkey_components.png" alt="turnkey-components" className="" />
              </div>
            </div>
            <div>
              <h2 className="text-[40px] font-semibold text-[#222222]">Process</h2>
              <ul className="mt-4 list-disc list-inside space-y-2 text-[15px]">
                <li className="text-[#444444]">Budget and Milestones.</li>
                <li className="text-[#444444]">Pre-Assessment.</li>
                <li className="text-[#444444]">Service Implementation.</li>
              </ul>

              <div className="mt-10 flex justify-start">
                <button onClick={() => setShowModal(true)} className="text-black px-6 py-3 border border-black uppercase">
                  Request a Consultation
                </button>
              </div>
              <div className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
                <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
                <ul className="list-decimal pl-5 space-y-2 text-[15px] text-[#444444]">
                  <li>Initial site visit to define requirements and capture sample images.</li>
                  <li>Data analysis to evaluate technical feasibility and constraints.</li>
                  <li>Prototype design and validation on representative samples.</li>
                  <li>Final report with recommendations, BOM and project timeline.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      {showModal && <RequestConsultation modal onClose={() => setShowModal(false)} />}

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <GetAdvice />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <Features />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <ContactCase />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>
    </div>
  );
}
