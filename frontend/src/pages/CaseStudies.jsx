import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function CaseStudies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Case Studies");
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api';
        const res = await fetch(`${API_BASE}/case-studies/vision-inspection-rotors`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        let content = json.content || json.contentJson || "";
        try { content = typeof content === 'string' ? JSON.parse(content) : content; } catch (e) { }
        setCaseData({ title: json.title, heroImage: json.heroImage, content });
      } catch (e) {
        setError("Failed to load case study: " + e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function renderBlock(block, idx) {
    if (!block) return null;
    switch (block.type) {
      case 'paragraph':
        return <p key={idx} className="text-sm text-[#606060] mb-4">{block.text}</p>;
      case 'heading':
        if (block.level === 2) return <h2 key={idx} className="text-2xl font-bold mb-3">{block.text}</h2>;
        if (block.level === 3) return <h3 key={idx} className="text-xl font-semibold mb-2">{block.text}</h3>;
        return <h4 key={idx} className="font-semibold mb-2">{block.text}</h4>;
      case 'image':
        return (
          <div key={idx} className="w-full max-w-xs md:max-w-sm mb-4">
            <img src={block.src} alt={block.alt || ''} className="object-contain w-full h-auto" />
          </div>
        );
      case 'list':
        return (
          <ul key={idx} className={`list-${block.style || 'disc'} pl-5 text-sm text-[#606060] mb-4`}>
            {(block.items || []).map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        );
      default:
        return <div key={idx} dangerouslySetInnerHTML={{ __html: block.html || '' }} />;
    }
  }

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
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && caseData && (
              <div>
                {caseData.title && <h2 className="text-3xl font-bold mb-6">{caseData.title}</h2>}
                {(Array.isArray(caseData.content) ? caseData.content : [caseData.content]).map((blk, i) => renderBlock(blk, i))}
              </div>
            )}
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
