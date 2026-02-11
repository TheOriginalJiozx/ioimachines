import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";

export default function IPCoreLicensing() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("IP Core Licensing");
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
          <img src="/ipcorelicensing_img1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                IP Core Licensing
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
              <img src="/ipcorelicensing_img2.png" alt="turnkey-solutions" className="w-full md:h-[30rem] object-cover rounded shadow" />
              <div className="mt-4 text-[#444444] text-[15px] space-y-3">
                <div>We license our proprietary machine vision IP core for use with Matlab or Labview.</div>
                <h3 className="text-[24px] font-semibold text-[#222222]">Signature Algorithm</h3>
                <div>The core component of the solutions provided by IOIMACHINES is a novel image analysis algorithm invented by the founder of the company.</div>
                <div>The algorithm runs several feature detection techniques on a given set of images and selects the most successful one for the given problem.</div>
                <div>Two of these feature detection techniques are invented by the company and they show superior performance to conventional techniques especially in detecting small deviations in surface appearance from normal cases.</div>
                <div>A machine learning technique is then used on the generated features where a neural network is trained to classify the feature vectors into predefined classes.</div>
                <div>Case studies show that the proprietary algorithm produces 100% accuracy in detecting small defects on surfaces even when they are obscured by shadows and other normal artifacts.</div>
                <div>Other case studies showed that the algorithm is powerful in detecting different types of defects on surfaces with highly varying background
                structures such as the inner surface of the wind turbine blade.</div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <img src="/RotorBlades.jpg" alt="rotor-blades" className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
                  <img src="/rotorsCompressor.png" alt="rotors" className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
                  <img src="/machine-all.jpg" alt="all" className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
                </div>
                <div>The IP core is delivered in an easy to use Graphical User Interface together with functions to:</div>
                <p className="mt-4 text-[#444444] text-[15px]">A simple GUI to let the user, via mouse clicks, do the following:</p>
                <ul className="mt-2 list-disc list-outside pl-8 space-y-2 text-[15px]">
                  <li className="text-[#444444]">Create new classification categories.</li>
                  <li className="text-[#444444]">Define Regions of interest in selected images.</li>
                  <li className="text-[#444444]">Assign images to defined classes for training, test and validation.</li>
                  <li className="text-[#444444]">Add new images to the training, test and validation database.</li>
                  <li className="text-[#444444]">Enter data of defects on each image.</li>
                  <li className="text-[#444444]">Create directories including different defect types.</li>
                  <li className="text-[#444444]">Generate feature vectors using a selected technique.</li>
                  <li className="text-[#444444]">Train the Neural Network.</li>
                  <li className="text-[#444444]">Test and validate the Neural network.</li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-[40px] font-semibold text-[#222222]">Process</h2>
              <ul className="mt-4 list-disc list-inside space-y-2 text-[15px]">
                <li className="text-[#444444]">Evaluate our Signature IP core.</li>
                <li className="text-[#444444]">Ask for enhancements or added functions and facilities.</li>
                <li className="text-[#444444]">Buy the IP Core</li>
                <li className="text-[#444444]">We help integrating and testing the IP core into your system.</li>
              </ul>

              <h2 className="mt-8 text-[40px] font-semibold mb-3 text-[#222222]">Let's Help You</h2>
              <div className="mt-0 flex justify-start">
                <button onClick={() => (window.location.href = "/contact")} className="text-black px-6 py-3 border border-black uppercase">
                  Request an Evaluation License
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
