import { useEffect, useState } from "react";
import EditWhatWeDoSection from "../components/EditWhatWeDoSection";
import EditHomeCards from "../components/EditHomeCards";
import EditWhySiteSection from "../components/EditWhySiteSection";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import EditModalText from "../components/EditModalText";
import HeroEditor from "../components/HeroEditor";
import { parseListBlockEditorValue } from "../utils/feasibilityListBlockUtils";

export default function Home() {
const [originalWhyPerf, setOriginalWhyPerf] = useState({});
const [originalWhatWeDo, setOriginalWhatWeDo] = useState({});
const [setOriginalModal] = useState({});
const [originalCards, setOriginalCards] = useState({});

const [editWhy, setEditWhy] = useState(false);
const [whyTitle, setWhyTitle] = useState("");
const [whySubtitle, setWhySubtitle] = useState("");
const [whyBody1, setWhyBody1] = useState("");
const [whyBody2, setWhyBody2] = useState("");
const [whyBody3, setWhyBody3] = useState("");
const [perfTitle, setPerfTitle] = useState("");
const [perfSubtitle, setPerfSubtitle] = useState("");
const [perfBody1, setPerfBody1] = useState("");
const [perfBody2, setPerfBody2] = useState("");
 
 const [modalOpen, setModalOpen] = useState(false);
 const [modalTitle, setModalTitle] = useState("");
 const [modalBody, setModalBody] = useState("");
 const [modalEdit, setModalEdit] = useState(false);
 const [modalIconClass, setModalIconClass] = useState("");
 const [oldModalTitle, setOldModalTitle] = useState("");

 const [modalTexts, setModalTexts] = useState([]);
 
 const [editSiteSection, setEditSiteSection] = useState(false);
 const [siteSectionTitle, setSiteSectionTitle] = useState("");
 const [siteSectionSubtitle, setSiteSectionSubtitle] = useState("");
 const [siteSectionBody1, setSiteSectionBody1] = useState("");
 const [siteSectionBody2, setSiteSectionBody2] = useState("");
 const [siteSectionBody3, setSiteSectionBody3] = useState("");
 const [siteSectionBody4, setSiteSectionBody4] = useState("");

 const [editCards, setEditCards] = useState(false);
 const [card1Title, setCard1Title] = useState("");
 const [card1Body, setCard1Body] = useState("");
 const [card1Icon, setCard1Icon] = useState("");
 const [card2Title, setCard2Title] = useState("");
 const [card2Body, setCard2Body] = useState("");
 const [card2Icon, setCard2Icon] = useState("");
 const [card3Title, setCard3Title] = useState("");
 const [card3Body, setCard3Body] = useState("");
 const [card3Icon, setCard3Icon] = useState("");
 const [card4Title, setCard4Title] = useState("");
 const [card4Body, setCard4Body] = useState("");
 const [card4Icon, setCard4Icon] = useState("");
 const [card4List, setCard4List] = useState([]);
 const [card4ListIcons, setCard4ListIcons] = useState([]);
 const [card4Footer, setCard4Footer] = useState("");

 
  const [heroImage, setHeroImage] = useState("");
  const adminToken = (typeof globalThis !== 'undefined' && (globalThis.adminToken || globalThis.localStorage.getItem('adminToken'))) || '';

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const res = await fetch(`${API_BASE}/page-heros/home`);
        if (res.ok) {
          const data = await res.json();
          setHeroImage(data.imageUrl);
        }
      } catch (e) {
        console.error("Failed to fetch hero image", e);
      }
    }
    fetchHeroImage();
  }, []);

    
    const fetchWhySection = async () => {
      const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
      try {
        const res = await fetch(`${API_BASE}/sections/home-why-ioimachines`);
        const json = res?.ok ? await res.json() : null;
        if (json && json.content) {
          let parsed = {};
          try {
            parsed = JSON.parse(json.content);
          } catch (e) {
            console.error("Failed to parse why section content", e);
          }
          setWhyTitle(parsed.whyTitle || whyTitle);
          setWhySubtitle(parsed.whySubtitle || whySubtitle);
          setWhyBody1(parsed.whyBody1 || whyBody1);
          setWhyBody2(parsed.whyBody2 || whyBody2);
          setWhyBody3(parsed.whyBody3 || whyBody3);
          setPerfTitle(parsed.perfTitle || perfTitle);
          setPerfSubtitle(parsed.perfSubtitle || perfSubtitle);
          setPerfBody1(parsed.perfBody1 || perfBody1);
          setPerfBody2(parsed.perfBody2 || perfBody2);
        }
      } catch (error) {
        console.error("Failed to fetch why section data", error);
      }
    };

    
    useEffect(() => {
      async function fetchWhySectionLocal() {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
          const res = await fetch(`${API_BASE}/sections/home-why-ioimachines`);
          const json = res?.ok ? await res.json() : null;
          if (json) {
            setWhyTitle(json.title || "");
            if (json.content) {
              let parsed = {};
              try {
                parsed = typeof json.content === "string" ? JSON.parse(json.content) : json.content;
              } catch(error) {
                console.error("Failed to parse why section content", error);
              }
              setWhySubtitle(parsed.whySubtitle || "");
              setWhyBody1(parsed.whyBody1 || "");
              setWhyBody2(parsed.whyBody2 || "");
              setWhyBody3(parsed.whyBody3 || "");
              setPerfTitle(parsed.perfTitle || "");
              setPerfSubtitle(parsed.perfSubtitle || "");
              setPerfBody1(parsed.perfBody1 || "");
              setPerfBody2(parsed.perfBody2 || "");
            }
          }
        } catch (error) {
          console.error("Failed to fetch why section data", error);
        }
      }
      fetchWhySectionLocal();
    }, []);

 useEffect(() => {
  async function fetchSiteSection() {
   try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/sections/home-what-we-do`);
    const json = res?.ok ? await res.json() : null;
    if (json) {
     setSiteSectionTitle(json.title || siteSectionTitle);
     if (json.content) {
      let parsed = {};
      try {
       parsed = JSON.parse(json.content);
      } catch (e) {
        console.error("Failed to parse site section content", e);
      }
      setSiteSectionSubtitle(parsed.subtitle || siteSectionSubtitle);
      setSiteSectionBody1(parsed.body1 || siteSectionBody1);
      setSiteSectionBody2(parsed.body2 || siteSectionBody2);
      setSiteSectionBody3(parsed.body3 || siteSectionBody3);
      setSiteSectionBody4(parsed.body4 || siteSectionBody4);
     }
    }
   } catch (error) {
    console.error("Failed to fetch site section data", error);
   }
  }
  fetchSiteSection();
 }, [siteSectionTitle, siteSectionSubtitle, siteSectionBody1, siteSectionBody2, siteSectionBody3, siteSectionBody4]);

 useEffect(() => {
  async function fetchCards() {
   try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/sections/home-cards`);
    const json = res?.ok ? await res.json() : null;
    if (json && json.content) {
     let parsed = {};
     try {
      parsed = JSON.parse(json.content);
     } catch (e) {
        console.error("Failed to parse cards content", e);
     }
     setCard1Title(parsed.card1Title || card1Title);
     setCard1Body(parsed.card1Body || card1Body);
     setCard1Icon(parsed.card1Icon || card1Icon);
     setCard2Title(parsed.card2Title || card2Title);
     setCard2Body(parsed.card2Body || card2Body);
     setCard2Icon(parsed.card2Icon || card2Icon);
     setCard3Title(parsed.card3Title || card3Title);
     setCard3Body(parsed.card3Body || card3Body);
     setCard3Icon(parsed.card3Icon || card3Icon);
     setCard4Title(parsed.card4Title || card4Title);
     setCard4Body(parsed.card4Body || card4Body);
     setCard4Icon(parsed.card4Icon || card4Icon);
     setCard4List(Array.isArray(parsed.card4List) ? parsed.card4List : card4List);
     setCard4ListIcons(Array.isArray(parsed.card4ListIcons) ? parsed.card4ListIcons : card4ListIcons);
     setCard4Footer(parsed.card4Footer || card4Footer);
    }
   } catch (error) {
    console.error("Failed to fetch cards data", error);
   }
  }
  fetchCards();
 }, [card1Title, card1Body, card1Icon, card2Title, card2Body, card2Icon, card3Title, card3Body, card3Icon, card4Title, card4Body, card4Icon, card4List, card4ListIcons, card4Footer]);

 useEffect(() => {
  async function fetchModalTexts() {
   try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/modals/home`);
    const json = res?.ok ? await res.json() : null;
    setModalTexts(Array.isArray(json) ? json : []);
   } catch {
    setModalTexts([]);
   }
  }
  fetchModalTexts();
 }, []);

 useEffect(() => {
  if (typeof globalThis !== "undefined" && typeof globalThis.setPageTitle === "function") {
   globalThis.setPageTitle("Machine Intelligence for Machine Vision");
  }
 }, []);

 useEffect(() => {
  if (typeof globalThis === "undefined" || globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Home page">
   <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid md:grid-cols-2 gap-6 items-center" aria-label="Home hero">
    <div>
     {(() => {
      const firstTitle = modalTexts[0]?.[0] || "";
      const firstObj = modalTexts[0]?.[1] ? { ...modalTexts[0][1] } : {};
      return (
       <>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#444444] leading-tight">{firstTitle}</h1>
        <p className="text-sm sm:text-base mt-4 text-gray-600 max-w-xl whitespace-pre-line">{firstObj.body ? (firstObj.body.length > 100 ? firstObj.body.slice(0, 100) + "..." : firstObj.body) : ""}</p>
        <button
         type="button"
         onClick={() => {
          setModalTitle(firstTitle);
          setModalBody(firstObj.body || "");
          setModalIconClass(firstObj.iconClass || "");
          setOldModalTitle(firstTitle);
          setModalOpen(true);
         }}
         className="mt-6 bg-[#444444] text-white px-5 py-2 rounded shadow text-sm"
        >
         READ MORE
        </button>
       </>
      );
     })()}
    </div>
    <div className="flex justify-center md:justify-end mt-4 md:mt-0">
      <div className="w-full max-w-2xl">
        <HeroEditor
          hero={{ imageUrl: heroImage }}
          adminToken={adminToken}
          hideTitleInput={true}
          onSave={async (heroDraft) => {
            try {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/home`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
                },
                body: JSON.stringify({
                  imageUrl: heroDraft.imageUrl,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setHeroImage(data.imageUrl || heroDraft.imageUrl);
              }
            } catch (e) {
              console.error("Failed to save hero data", e);
            }
          }}
        />
      </div>
    </div>
   </section>

   <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

   <section className="border-text border-gray-100">
    <div className="max-w-6xl mx-auto px-6 py-16">
     <h2 className="text-3xl font-bold text-center">Our Technology</h2>
     <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Array.isArray(modalTexts) && modalTexts.length > 1 && modalTexts.slice(1).every(Array.isArray) ? (
       modalTexts
        .slice(1)
        .filter((entry) => Array.isArray(entry) && entry[0] && entry[1] && typeof entry[1] === "object")
        .map(([title, modalObj], i) => {
         const iconClass = modalObj.iconClass || "";
         const body = modalObj.body || "";
         
         modalObj.orderIndex = 3;
         return (
          <div key={title + "-" + i} className="bg-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 enter-up pop" style={{ "--i": i }}>
           <div className="w-16 h-16 flex-shrink-0 rounded-full border border-black bg-[#D6D6D6] flex items-center justify-center text-gray-500 overflow-hidden">{iconClass ? <i className={iconClass + " text-white text-2xl icon-tilt"} aria-hidden="true" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}></i> : <span className="w-8 h-8 block" aria-hidden="true" />}</div>
           <div className="flex-1 text-left">
            <h3 className="font-semibold text-base">{title}</h3>
            <p className="mt-2 text-sm text-[#606060] whitespace-pre-line">{body.length > 100 ? body.slice(0, 100) + "..." : body}</p>
            <button
             type="button"
             onClick={() => {
              setModalTitle(title);
              setModalBody(body);
              setModalIconClass(iconClass);
              setOldModalTitle(title);
              setModalOpen(true);
             }}
             className="mt-3 inline-block text-sm text-[#606060] hover:underline"
            >
             Read more
            </button>
           </div>
          </div>
         );
        })
      ) : (
       <div className="text-center text-gray-500 py-8">No technology cards found.</div>
      )}
     </div>
    </div>
   </section>

   <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

   <section className="bg-[#0471AB]">
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-start">
     <div className="text-white">
      <button
        className="mt-2 mb-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded"
        onClick={() => {
          setOriginalWhatWeDo({
            siteSectionTitle,
            siteSectionSubtitle,
            siteSectionBody1,
            siteSectionBody2,
            siteSectionBody3,
            siteSectionBody4,
          });
          setEditSiteSection(true);
        }}
      >
        Edit section
      </button>
      {editSiteSection ? (
        <EditWhatWeDoSection
          title={siteSectionTitle}
          subtitle={siteSectionSubtitle}
          body1={siteSectionBody1}
          body2={siteSectionBody2}
          body3={siteSectionBody3}
          body4={siteSectionBody4}
          setTitle={setSiteSectionTitle}
          setSubtitle={setSiteSectionSubtitle}
          setBody1={setSiteSectionBody1}
          setBody2={setSiteSectionBody2}
          setBody3={setSiteSectionBody3}
          setBody4={setSiteSectionBody4}
          saving={false}
          onCancel={() => {
            setSiteSectionTitle(originalWhatWeDo.siteSectionTitle || "");
            setSiteSectionSubtitle(originalWhatWeDo.siteSectionSubtitle || "");
            setSiteSectionBody1(originalWhatWeDo.siteSectionBody1 || "");
            setSiteSectionBody2(originalWhatWeDo.siteSectionBody2 || "");
            setSiteSectionBody3(originalWhatWeDo.siteSectionBody3 || "");
            setSiteSectionBody4(originalWhatWeDo.siteSectionBody4 || "");
            setEditSiteSection(false);
          }}
          onSave={async (
            title,
            subtitle,
            body1,
            body2,
            body3,
            body4
          ) => {
            const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
            const adminToken = globalThis.adminToken || globalThis.localStorage.getItem("adminToken") || "";
            const sectionData = {
              title,
              content: JSON.stringify({
                title,
                subtitle,
                body1,
                body2,
                body3,
                body4,
              }),
              adminToken,
            };
            await fetch(`${API_BASE}/sections/home-what-we-do`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
              },
              body: JSON.stringify(sectionData),
            });
            
            try {
              const res = await fetch(`${API_BASE}/sections/home-what-we-do`);
              const json = res?.ok ? await res.json() : null;
              if (json) {
                setSiteSectionTitle(json.title || title);
                if (json.content) {
                  let parsed = {};
                  try {
                    parsed = JSON.parse(json.content);
                  } catch (e) {
                    console.error("Failed to parse site section content after saving", e);
                  }
                  setSiteSectionTitle(parsed.title || title);
                  setSiteSectionSubtitle(parsed.subtitle || subtitle);
                  setSiteSectionBody1(parsed.body1 || body1);
                  setSiteSectionBody2(parsed.body2 || body2);
                  setSiteSectionBody3(parsed.body3 || body3);
                  setSiteSectionBody4(parsed.body4 || body4);
                }
              }
            } catch (error) {
              console.error("Failed to fetch site section data after saving", error);
            }
            setEditSiteSection(false);
          }}
        />
      ) : (
       <>
        <h2 className="text-3xl font-bold">{siteSectionTitle}</h2>
        <h3 className="text-xl font-semibold mt-4">{siteSectionSubtitle}</h3>
        <p className="mt-6 max-w-xl">{siteSectionBody1}</p>
        <p className="mt-6 max-w-xl">{siteSectionBody2}</p>
        <div className="mt-6 bg-white text-black rounded-lg p-4">
         <p className="mt-2 text-sm whitespace-pre-line">{siteSectionBody3}</p>
        </div>
        <p className="mt-6 text-white font-semibold">{siteSectionBody4}</p>
       </>
      )}
     </div>

     <div className="space-y-4">
      <button
        className="mb-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded"
        onClick={() => {
          setOriginalCards({
            card1Title, card1Body, card1Icon,
            card2Title, card2Body, card2Icon,
            card3Title, card3Body, card3Icon,
            card4Title, card4Body, card4Icon,
            card4List: [...card4List],
            card4ListIcons: [...card4ListIcons],
            card4Footer,
          });
          setEditCards(true);
        }}
      >
        Edit cards
      </button>
      {editCards ? (
        <EditHomeCards
          card1={{ title: card1Title, text: card1Body, icon: card1Icon }}
          card2={{ title: card2Title, text: card2Body, icon: card2Icon }}
          card3={{ title: card3Title, text: card3Body, icon: card3Icon }}
          card4={{ title: card4Title, text: card4Body, icon: card4Icon }}
          setCard1={card => { setCard1Title(card.title); setCard1Body(card.text); setCard1Icon(card.icon); }}
          setCard2={card => { setCard2Title(card.title); setCard2Body(card.text); setCard2Icon(card.icon); }}
          setCard3={card => { setCard3Title(card.title); setCard3Body(card.text); setCard3Icon(card.icon); }}
          setCard4={card => { setCard4Title(card.title); setCard4Body(card.text); setCard4Icon(card.icon); }}
          card4List={card4List}
          setCard4List={setCard4List}
          card4ListIcons={card4ListIcons}
          setCard4ListIcons={setCard4ListIcons}
          card4Footer={card4Footer}
          setCard4Footer={setCard4Footer}
          onCancel={() => {
            setCard1Title(originalCards.card1Title || "");
            setCard1Body(originalCards.card1Body || "");
            setCard1Icon(originalCards.card1Icon || "");
            setCard2Title(originalCards.card2Title || "");
            setCard2Body(originalCards.card2Body || "");
            setCard2Icon(originalCards.card2Icon || "");
            setCard3Title(originalCards.card3Title || "");
            setCard3Body(originalCards.card3Body || "");
            setCard3Icon(originalCards.card3Icon || "");
            setCard4Title(originalCards.card4Title || "");
            setCard4Body(originalCards.card4Body || "");
            setCard4Icon(originalCards.card4Icon || "");
            setCard4List(Array.isArray(originalCards.card4List) ? [...originalCards.card4List] : []);
            setCard4ListIcons(Array.isArray(originalCards.card4ListIcons) ? [...originalCards.card4ListIcons] : []);
            setCard4Footer(originalCards.card4Footer || "");
            setEditCards(false);
          }}
          onSave={async (card1, card2, card3, card4, card4List, card4ListIcons, card4Footer) => {
            const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
            const adminToken = window.adminToken || localStorage.getItem("adminToken") || "";
            const cardContent = {
              card1Title: card1.title,
              card1Body: card1.text,
              card1Icon: card1.icon,
              card2Title: card2.title,
              card2Body: card2.text,
              card2Icon: card2.icon,
              card3Title: card3.title,
              card3Body: card3.text,
              card3Icon: card3.icon,
              card4Title: card4.title,
              card4Body: card4.text,
              card4Icon: card4.icon,
              card4List,
              card4ListIcons,
              card4Footer,
            };
            const cardData = {
              title: "Home Cards",
              content: JSON.stringify(cardContent),
              adminToken,
            };
            await fetch(`${API_BASE}/sections/home-cards`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
              },
              body: JSON.stringify(cardData),
            });
            
            try {
              const res = await fetch(`${API_BASE}/sections/home-cards`);
              const json = res?.ok ? await res.json() : null;
              if (json && json.content) {
                let parsed = {};
                try {
                  parsed = JSON.parse(json.content);
                } catch (e) {
                  console.error("Failed to parse cards content after saving", e);
                }
                setCard1Title(parsed.card1Title || card1.title);
                setCard1Body(parsed.card1Body || card1.text);
                setCard1Icon(parsed.card1Icon || card1.icon);
                setCard2Title(parsed.card2Title || card2.title);
                setCard2Body(parsed.card2Body || card2.text);
                setCard2Icon(parsed.card2Icon || card2.icon);
                setCard3Title(parsed.card3Title || card3.title);
                setCard3Body(parsed.card3Body || card3.text);
                setCard3Icon(parsed.card3Icon || card3.icon);
                setCard4Title(parsed.card4Title || card4.title);
                setCard4Body(parsed.card4Body || card4.text);
                setCard4Icon(parsed.card4Icon || card4.icon);
                setCard4List(Array.isArray(parsed.card4List) ? parsed.card4List : card4List);
                setCard4ListIcons(Array.isArray(parsed.card4ListIcons) ? parsed.card4ListIcons : card4ListIcons);
                setCard4Footer(parsed.card4Footer || card4Footer);
              }
            } catch (error) {
              console.error("Failed to fetch cards data after saving", error);
            }
            setEditCards(false);
          }}
        />
      ) : (
       <>
        <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 0 }}>
         <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
          <i className={card1Icon}></i>
         </div>
         <div className="flex-1">
          <p className="font-semibold text-black">{card1Title}</p>
          <p className="text-sm text-black mt-1">{card1Body}</p>
         </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 1 }}>
         <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
          <i className={card2Icon}></i>
         </div>
         <div className="flex-1">
          <p className="font-semibold text-black">{card2Title}</p>
          <p className="text-sm text-black mt-1">{card2Body}</p>
         </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ "--i": 2 }}>
         <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
          <i className={card3Icon}></i>
         </div>
         <div className="flex-1">
          <p className="font-semibold text-black">{card3Title}</p>
          <p className="text-sm text-black mt-1">{card3Body}</p>
         </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4">
         <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
          <i className={card4Icon}></i>
         </div>
         <div className="flex-1">
          <h4 className="font-semibold text-black">{card4Title}</h4>
          <p className="mt-3 text-sm text-black">{card4Body}</p>
          <ul className="mt-2 text-sm text-black list-inside pl-4 space-y-1">
           {card4List.map((item, idx) => (
            <li key={idx} className="flex items-start">
             <i className={`fas ${card4ListIcons[idx] || "fa-question-circle"} text-[#0471AB] mr-3 mt-1`} aria-hidden="true"></i>
             <span>{item}</span>
            </li>
           ))}
          </ul>
          <p className="mt-3 text-sm text-black">{card4Footer}</p>
         </div>
        </div>
       </>
      )}
     </div>
    </div>
   </section>

   <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

   <section className="max-w-6xl mx-auto px-6 py-12">
    <div className="grid md:grid-cols-2 gap-8 items-center">
     <div className="max-w-xl">
      {!editWhy ? (
        <>
          <button
            className="mt-2 mb-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded"
            onClick={() => {
              setOriginalWhyPerf({
                whyTitle,
                whySubtitle,
                whyBody1,
                whyBody2,
                whyBody3,
                perfTitle,
                perfSubtitle,
                perfBody1,
                perfBody2,
              });
              setEditWhy(true);
            }}
          >
            Edit section
          </button>
          <h3 className="text-2xl font-bold text-[#444444]">{whyTitle}</h3>
          <h4 className="text-xl font-semibold mt-4">{whySubtitle}</h4>
          <p className="mt-4 text-gray-600">{whyBody1}</p>
          <p className="mt-3 text-gray-600">{whyBody2}</p>
          <p className="mt-3 text-gray-600">{whyBody3}</p>
        </>
      ) : (
        <EditWhySiteSection
          whyTitle={whyTitle}
          whySubtitle={whySubtitle}
          whyBody1={whyBody1}
          whyBody2={whyBody2}
          whyBody3={whyBody3}
          perfTitle={perfTitle}
          perfSubtitle={perfSubtitle}
          perfBody1={perfBody1}
          perfBody2={perfBody2}
          setWhyTitle={setWhyTitle}
          setWhySubtitle={setWhySubtitle}
          setWhyBody1={setWhyBody1}
          setWhyBody2={setWhyBody2}
          setWhyBody3={setWhyBody3}
          setPerfTitle={setPerfTitle}
          setPerfSubtitle={setPerfSubtitle}
          setPerfBody1={setPerfBody1}
          setPerfBody2={setPerfBody2}
          saving={false}
          onCancel={() => {
            setWhyTitle(originalWhyPerf.whyTitle || "");
            setWhySubtitle(originalWhyPerf.whySubtitle || "");
            setWhyBody1(originalWhyPerf.whyBody1 || "");
            setWhyBody2(originalWhyPerf.whyBody2 || "");
            setWhyBody3(originalWhyPerf.whyBody3 || "");
            setPerfTitle(originalWhyPerf.perfTitle || "");
            setPerfSubtitle(originalWhyPerf.perfSubtitle || "");
            setPerfBody1(originalWhyPerf.perfBody1 || "");
            setPerfBody2(originalWhyPerf.perfBody2 || "");
            setEditWhy(false);
          }}
          onSave={async (
            whyTitle,
            whySubtitle,
            whyBody1,
            whyBody2,
            whyBody3,
            perfTitle,
            perfSubtitle,
            perfBody1,
            perfBody2
          ) => {
            const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
            const adminToken = window.adminToken || localStorage.getItem("adminToken") || "";
            const sectionData = {
              title: whyTitle,
              content: JSON.stringify({
                whyTitle,
                whySubtitle,
                whyBody1,
                whyBody2,
                whyBody3,
                perfTitle,
                perfSubtitle,
                perfBody1,
                perfBody2,
              }),
              adminToken,
            };
            await fetch(`${API_BASE}/sections/home-why-ioimachines`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
              },
              body: JSON.stringify(sectionData),
            });
            
            try {
              await fetchWhySection();
            } catch (error) {
              console.error("Failed to fetch why section data after saving", error);
            }
            setEditWhy(false);
          }}
        />
      )}
     </div>

     {!editWhy && (
       <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
         <h4 className="text-xl font-semibold text-gray-800">{perfTitle}</h4>
         <h5 className="mt-3 font-semibold text-gray-700">{perfSubtitle}</h5>
         <p className="mt-3 text-gray-600">{perfBody1}</p>
         <p className="mt-3 text-gray-600">{perfBody2}</p>
       </aside>
     )}
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
       <div
         className="absolute inset-0 bg-black/50"
         role="button"
         tabIndex={0}
         aria-label="Close modal"
         onClick={() => { setModalOpen(false); setModalEdit(false); }}
         onKeyDown={e => {
           if (e.key === 'Enter' || e.key === ' ') {
             setModalOpen(false);
             setModalEdit(false);
           }
         }}
       />
       {modalEdit ? (
         <EditModalText
           modalTitle={modalTitle}
           modalBody={modalBody}
           modalIconClass={modalIconClass}
           setModalTitle={setModalTitle}
           setModalBody={setModalBody}
           setModalIconClass={setModalIconClass}
           saving={false}
           onCancel={() => { setModalOpen(false); setModalEdit(false); }}
           onSave={async (title, body, iconClass) => {
             try {
               const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
               let singleModal = {};
               let existingModal = modalTexts.find((arr) => arr[0] === oldModalTitle);
               let orderIndex = existingModal ? existingModal[1].orderIndex : modalTexts[0]?.[0] === modalTitle ? 2 : 3;
               singleModal[title] = {
                 body,
                 iconClass,
                 orderIndex,
               };
               const saveRes = await fetch(`${API_BASE}/modals/home`, {
                 method: "PUT",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(singleModal),
               });
               if (saveRes.ok) {
                 const res = await fetch(`${API_BASE}/modals/home`);
                 const json = res?.ok ? await res.json() : null;
                 setModalTexts(Array.isArray(json) ? json : []);
               }
             } catch (error) {
                console.error("Failed to save modal data", error);
             }
             setModalEdit(false);
             setModalOpen(false);
           }}
         />
       ) : (
         <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-lg">
           <div className="flex items-start justify-between">
             <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
             <button onClick={() => { setModalOpen(false); setModalEdit(false); }} className="text-gray-500 hover:text-gray-700">✕</button>
           </div>
           <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">{typeof modalBody === "string" ? modalBody.replaceAll('<NL>', "\n") : modalBody}</div>
           <div className="mt-6 flex justify-end gap-2">
             <button
               onClick={() => {
                 setOriginalModal({
                   title: modalTitle,
                   body: modalBody,
                   iconClass: modalIconClass,
                 });
                 setModalEdit(true);
               }}
               className="bg-indigo-600 text-white px-4 py-2 rounded"
             >
               Edit
             </button>
           </div>
         </div>
       )}
     </div>
   )}
  </div>
 );
}
