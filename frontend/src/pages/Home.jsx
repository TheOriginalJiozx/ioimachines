import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function Home() {
  const cards = [
    { title: "Smarter Vision for Smarter Machines", desc: `IOIMACHINES delivers intelligent machine vision systems that help manufacturers detect defects, ensure product quality and improve safety — in real time, at production speed.`, icon: null },
    { title: "A Novel Approach", desc: "Historically, machine vision vendors relied \n on feature detection techniques to \n recognize objects and find abnormal...", icon: "/icon1.png" },
    { title: "HW Enabled High Performance", desc: "The algorithm runs at extreme high speed to \n achieve real time inspection. Therefore, \n parts of the algorithm run on a GPU...", icon: "/icon2.png" },
    { title: "The Right Solution", desc: "The method solves the problem of limited \n texture visibility on surfaces and provides \n invariance to large color variations...", icon: "/icon3.png" },
    { title: "Application Areas", desc: "Our innovative method is applicable in \n several areas such as texture analysis, \n medical image analysis and visionbased...", icon: "/icon4.png" },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  const modalTexts = {
    "Smarter Vision for Smarter Machines": `IOIMACHINES delivers intelligent machine vision systems that help manufacturers detect defects, ensure product quality and improve safety — in real time, at production speed. Our solutions combine high-resolution industrial imaging, deterministic illumination, and deep learning–based computer vision models to perform 100% inline inspection of products at production speed. The system detects surface defects, geometric deviations, assembly errors, and process anomalies with high precision and repeatability. The inspection pipeline is designed for robustness and adaptability: AI models are trained on real production data, tolerate normal product variation, and continuously improve through supervised retraining. This enables reliable defect classification while minimizing false positives and false negatives compared to rule-based vision systems. IOIMACHINES platforms are built for industrial integration, supporting standard automation interfaces and seamless connectivity with PLCs, MES, and SCADA systems. Real-time decision outputs enable immediate process feedback, reject handling, and traceability, improving yield, reducing scrap, and enforcing consistent quality standards across production lines.`,
    "A Novel Approach": `Historically, machine vision vendors relied on feature detection techniques to recognize objects and find abnormal features in images of surfaces. These techniques are hardcoded. It meant that their solutions were only applicable in highly controlled environments, such as inspecting a single type of object on a production line. Machine Learning based machine vision systems are far more flexible today. A single system handles many object types. It also adapts itself to accommodate for changes in the nature of defects and variations in surface appearance. Moreover, it is deployable in a range of circumstances. IOIMACHINES invented a new method of distinguishing between normal and abnormal features in images of surfaces based on a Machine Learning approach.`,
    "HW Enabled High Performance": `The algorithm runs at extreme high speed to achieve real time inspection. Therefore, Parts of the algorithm run on a GPU in a PC platform. The most critical part runs on a dedicated HW platform developed by IOIMACHINES. We also provide the SW solution as Software-as-a-service on the cloud.`,
    "The Right Solution": `The method solves the problem of limited texture visibility on surfaces and provides invariance to large color variations and variations in appearance, patterns, orientation and scale. The solution overcomes limited surface texture and high visual variability by virtue of model training on representative production data. Rather than relying on fixed rules or handcrafted features, the inspection models learn discriminative visual representations directly from real product samples, capturing both acceptable variation and defect characteristics. Through training, the system becomes invariant to large color shifts, changes in appearance, repeating or non-repeating patterns, orientation, and scale. This learned invariance allows reliable inspection even on low-contrast, reflective, or visually inconsistent surfaces where traditional machine vision approaches break down. Multi-scale feature learning enables the separation of normal process variation from true defects, reducing false rejects while maintaining high defect detection sensitivity. As new data becomes available, models can be retrained or fine-tuned to adapt to evolving materials, suppliers, or process conditions without redesigning the inspection logic. The trained models are optimized for real-time, inline operation, providing deterministic inspection results and seamless integration into automated production environments.`,
    "Application Areas": `Our innovative method is applicable in several areas such as Texture analysis, medical image analysis and vision based defect detection on surfaces of industrial objects.  The method is self-adaptive in the sense that it adapts itself to changes in appearance of both normal and defect surfaces. The method is applicable across a wide range of vision-based inspection and analysis tasks where robustness to visual variability is critical. In texture analysis, it enables reliable detection of subtle defects, irregularities, and anomalies on surfaces with weak, repetitive, or non-uniform texture, even under changing illumination and appearance conditions. In medical image analysis, the approach supports the identification of structural abnormalities and pattern deviations in images with high natural variability, where consistent feature representation and invariance to scale and orientation are essential. Model training allows the system to adapt to different imaging modalities and acquisition conditions while preserving sensitivity to clinically relevant features. More broadly, the method is well suited for vision-based industrial applications such as automated quality inspection, defect classification, and process monitoring. Its ability to generalize across product variants and operating conditions makes it particularly effective in environments where traditional rule-based vision systems struggle due to frequent changes in materials, surface finish, or product design.`,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Machine Intelligence for Machine Vision");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#444444] leading-tight">Smarter Vision for Smarter Machines</h1>
          <p className="text-sm sm:text-base mt-4 text-gray-600 max-w-xl whitespace-pre-line">{cards[0].desc}</p>
          <button
            type="button"
            onClick={() => {
              const card = cards[0];
              setModalTitle(card.title);
              setModalBody(modalTexts[card.title] || card.desc);
              setModalOpen(true);
            }}
            className="mt-6 bg-[#444444] text-white px-5 py-2 rounded shadow text-sm"
          >
            READ MORE
          </button>
        </div>
        <div className="flex justify-center md:justify-end mt-4 md:mt-0">
          <div className="w-full max-w-2xl h-56 sm:h-64 md:h-96 bg-gray-100 overflow-hidden flex items-center justify-center rounded">
            <img src="/ioimachinesbanner.jpg" alt="hero" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="border-text border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">Our Technology</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.slice(1).map(({ title, desc, icon }, i) => (
              <div key={title} className="bg-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 enter-up pop" style={{ "--i": i }}>
                <div className="w-16 h-16 flex-shrink-0 rounded-full border border-black bg-[#D6D6D6] flex items-center justify-center text-gray-500 overflow-hidden">{icon ? <img src={icon} alt={`${title} icon`} className="w-10 h-10 object-contain" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }} /> : <span className="w-8 h-8 block" aria-hidden="true" />}</div>

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
            <h2 className="text-3xl font-bold">What We Do</h2>
            <h3 className="text-xl font-semibold mt-4">End-to-End Machine Vision Solutions</h3>

            <p className="mt-6 max-w-xl">We design and deliver complete machine vision solutions — from cameras and lighting to intelligent software and high-performance computing.</p>

            <p className="mt-6 max-w-xl">Instead of hard-coded inspection rules, IOIMACHINES uses machine-learning–based vision technology that evolves with your production process.</p>

            <div className="mt-6 bg-white text-black rounded-lg p-4">
              <p className="mt-2 text-sm">Our systems are designed for real-time inspection — even in extreme high-speed applications.</p>
              <p className="mt-2 text-sm">By combining intelligent software with high-performance computing, IOIMACHINES ensures accurate inspection without slowing down your production line.</p>
            </div>

            <p className="mt-6 text-white font-semibold">One partner. One system. Total accountability.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 0 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-check-circle icon-tilt"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">Fewer false rejects</p>
                <p className="text-sm text-black mt-1">Reduce waste and rework by minimizing incorrect rejects with learned inspection models.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 1 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-stopwatch icon-tilt"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">Faster setup and changeover</p>
                <p className="text-sm text-black mt-1">Shorter setup times and easy retraining let you adapt quickly to new products.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 2 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-shield-alt icon-tilt"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">Long-term reliability as products and materials change</p>
                <p className="text-sm text-black mt-1">Robust inspection that maintains accuracy as materials, surfaces, and defect types evolve.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className="fas fa-server"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-black">Designed to Scale With You</h4>
                <p className="mt-3 text-sm text-black">IOIMACHINES solutions can be deployed:</p>
                <ul className="mt-2 text-sm text-black list-inside pl-4 space-y-1">
                  <li className="flex items-start">
                    <i className="fas fa-desktop text-[#0471AB] mr-3 mt-1" aria-hidden="true"></i>
                    <span>On industrial PCs</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-microchip text-[#0471AB] mr-3 mt-1" aria-hidden="true"></i>
                    <span>On high-performance vision computers</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-cloud text-[#0471AB] mr-3 mt-1" aria-hidden="true"></i>
                    <span>Or as cloud-based software</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-black">From single stations to large-scale production, our systems grow with your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-[#444444]">Why IOIMACHINES</h3>
            <h4 className="text-xl font-semibold mt-4">Built for Real-World Production</h4>

            <p className="mt-4 text-gray-600">Traditional vision systems work only in tightly controlled environments.</p>
            <p className="mt-3 text-gray-600">IOIMACHINES systems adapt to real manufacturing conditions — variations, changes, and new defect types included.</p>
            <p className="mt-3 text-gray-600">Our solutions learn what "good" looks like and automatically detect what doesn’t.</p>
          </div>

          <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800">Performance &amp; Speed</h4>
            <h5 className="mt-3 font-semibold text-gray-700">Inspection at Production Speed</h5>

            <p className="mt-3 text-gray-600">Our systems are designed for real-time inspection — even in extreme high-speed applications.</p>

            <p className="mt-3 text-gray-600">By combining intelligent software with high-performance computing, IOIMACHINES ensures accurate inspection without slowing down your production line.</p>
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
