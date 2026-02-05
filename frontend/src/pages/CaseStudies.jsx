import { useEffect } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function CaseStudies() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Case Studies");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans">
      <section className="relative w-full mb-16">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/success_stories.jpg" alt="Case hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                Case Studies
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-[#404D56] overflow-hidden flex items-center justify-center">
          <img src="/cases-1.png" className="object-contain h-3/4 w-auto" alt="heroTwo" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}></h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Vision Inspection of Rotors for rotary screw air compressors</h2>

            <div className="flex flex-col items-start gap-8 mb-6">
              <div className="w-full max-w-xs md:max-w-sm flex-shrink-0 self-start">
                <img src="/rotorsCompressor-e1566565817235.png" alt="case" className="object-contain w-full h-auto" />
              </div>
              <div className="flex-1 text-sm text-[#606060] whitespace-pre-line">
                Rotors of rotary screw type air compressors have complex geometry. When they come out of grinding machines, various pores happen to appear on the surface.
                <br />
                Some of these pores are big enough to consider as defects. These pores have arbitrary shapes and geometries and present a challenge to detect using conventional machine vision systems if they lie in shadowed areas caused by the geometry or at edges.
                <br />
                IOIMACHINES demonstrated a solution for this problem. The solution is based on
                <br />
                advanced feature detection combined with powerful machine learning techniques.
                <br />
                The solution is tested on a collection of images of both good and bad rotors of different sizes and geometries. Test results show that we can achieve 100% accuracy in detecting all types of defects over a predefined size.
                <br />
                The solution distinguishes between types of defects and the system learned to distinguish real defects from oil films and droplets as well as air bubbles in dirty oil, shades and shavings.
                <br />
                In the solution, new types of defects and artifacts are learned quickly with minor intervention from qualified operators.
                <br />
                Main advantages seen by the customer are:
              </div>
            </div>

            <ul className="list-disc pl-5 text-sm text-[#606060] mb-6">
              <li>No reprogramming or re-engineering is required</li>
              <li>Zero downtime</li>
              <li>Zero escapements</li>
              <li>Seamless solution for different rotors of different shapes and sizes</li>
            </ul>

            <div className="text-sm text-[#606060] mb-6">
              The solution is provided for all types of grinded objects.
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <img src="/solution.png" alt="solution" className="w-full h-40 object-contain mb-4" />
              <h3 className="text-xl font-semibold">The Solution</h3>
              <p className="text-sm text-[#606060] mt-2">Solution text here</p>
            </div>
          </aside>
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
