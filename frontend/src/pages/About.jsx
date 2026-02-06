import { useEffect } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function About() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("About Us");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans">
      <section className="relative w-full">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/about_us1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                About Us
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[34px] font-semibold text-[#222222]">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed">
              Our mission is to empower manufacturers with reliable, AI-driven machine vision
              systems that detect defects early, reduce waste, and increase throughput. We
              combine advanced computer vision, optimized hardware, and seamless integration to
              deliver turnkey solutions that work on the factory floor today and scale for
              tomorrow.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/about_us2.jpg" alt="contact" className="w-full md:h-[28rem] object-cover rounded shadow" />
            </div>
            <div>
              <h2 className="text-[40px] font-semibold text-[#222222]">Why Choose Us</h2>

              <div>
                <p>
                  IOIMACHINES develops and manufactures custom machine vision solutions for vision-based quality control on the factory floor.
                </p>

                <p>
                  Our solutions are based on innovative methods of feature detection and state-of-the-art artificial intelligence.
                </p>

                <p className="mt-4">Our vision software runs on:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Standard industrial vision computers</li>
                  <li>Proprietary vision computers supplied with FPGA-based accelerators</li>
                </ul>

                <p className="mt-4">We also provide custom turnkey solutions including:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Industrial 2D cameras</li>
                  <li>3D sensors for accurate measurements of defects with 3D illumination units</li>
                  <li>Automation systems to present product for inspection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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
