import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import HeroEditor from "../components/HeroEditor";
import EditServicesCards from "../components/EditServicesCards";
import EditServicesSiteSection from "../components/EditServicesSiteSection";
import EditMaintenanceOwnership from "../components/EditMaintenanceOwnership";
import EditModalText from "../components/EditModalText";
import { fetchHero, fetchSection, fetchModalTexts, fetchSiteSectionAndCards } from "../utils/servicesApiUtils";

export default function Services() {
  
  const [hero, setHero] = useState({ title: "", imageUrl: "", altText: "", contentJson: "" });
  const adminToken =
    (typeof globalThis !== "undefined" && (globalThis.adminToken || globalThis.localStorage.getItem("adminToken"))) ||
    "";

  useEffect(() => {
    fetchHero(setHero, adminToken);
  }, [adminToken]);

  
  const [maintenanceTitle, setMaintenanceTitle] = useState("");
  const [maintenanceBody, setMaintenanceBody] = useState("");
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [maintenanceFooter, setMaintenanceFooter] = useState("");
  const [ownershipTitle, setOwnershipTitle] = useState("");
  const [ownershipBody, setOwnershipBody] = useState("");
  const [ownershipListTitle, setOwnershipListTitle] = useState("");
  const [ownershipList, setOwnershipList] = useState([]);
  const [ownershipFooter, setOwnershipFooter] = useState("");
  
  const [originalMaintenance, setOriginalMaintenance] = useState({});
  const [originalOwnership, setOriginalOwnership] = useState({});
  const [originalCards, setOriginalCards] = useState({
    card1: { title: "", text: "", icon: "" },
    card2: { title: "", text: "", icon: "" },
    card3: { title: "", text: "", icon: "" },
    section: { title: "", subtitle: "", body1: "", body2: [] },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [setModalOldTitle] = useState("");
  const [modalIconClass, setModalIconClass] = useState("");
  const [modalTexts, setModalTexts] = useState({});

  const [originalSiteSection, setOriginalSiteSection] = useState({});
  const [siteSectionTitle, setSiteSectionTitle] = useState("");
  const [siteSectionSubtitle, setSiteSectionSubtitle] = useState("");
  const [siteSectionBody1, setSiteSectionBody1] = useState("");
  const [siteSectionBody2, setSiteSectionBody2] = useState([]);
  
  const [card1Title, setCard1Title] = useState("");
  const [card1Text, setCard1Text] = useState("");
  const [card1Icon, setCard1Icon] = useState("");
  const [card2Title, setCard2Title] = useState("");
  const [card2Text, setCard2Text] = useState("");
  const [card2Icon, setCard2Icon] = useState("");
  const [card3Title, setCard3Title] = useState("");
  const [card3Text, setCard3Text] = useState("");
  const [card3Icon, setCard3Icon] = useState("");
  const [editSiteSection, setEditSiteSection] = useState(false);
  const [editCards, setEditCards] = useState(false);
  const [editMaintenanceOwnership, setEditMaintenanceOwnership] = useState(false);

  useEffect(() => {
    fetchSection({
      setMaintenanceTitle,
      setMaintenanceBody,
      setMaintenanceList,
      setMaintenanceFooter,
      setOwnershipTitle,
      setOwnershipBody,
      setOwnershipListTitle,
      setOwnershipList,
      setOwnershipFooter,
      setOriginalMaintenance,
      setOriginalOwnership,
    }, adminToken);
  }, [adminToken]);

  useEffect(() => {
    fetchModalTexts(setModalTexts, adminToken);
  }, [adminToken]);

  useEffect(() => {
    fetchSiteSectionAndCards({
      setSiteSectionTitle,
      setSiteSectionSubtitle,
      setSiteSectionBody1,
      setSiteSectionBody2,
      setCard1Title,
      setCard1Text,
      setCard1Icon,
      setCard2Title,
      setCard2Text,
      setCard2Icon,
      setCard3Title,
      setCard3Text,
      setCard3Icon,
    }, adminToken);
  }, [adminToken]);

  useEffect(() => {
    if (typeof globalThis !== "undefined" && typeof globalThis.setPageTitle === "function") {
      globalThis.setPageTitle("Services");
    }
  }, []);

  useEffect(() => {
    if (
      typeof globalThis === "undefined" ||
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

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
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Services page">
      <section className="relative w-full">
        <HeroEditor
          hero={hero}
          adminToken={adminToken}
          onSave={async (heroDraft) => {
            try {
              const API_BASE =
                import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/services`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
                },
                body: JSON.stringify({
                  title: heroDraft.title,
                  imageUrl: heroDraft.imageUrl,
                  altText: heroDraft.title,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setHero(data);
              }
            } catch (e) {
              console.error("Failed to save hero data", e);
            }
          }}
        />
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="border-text border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">Services</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(() => {
              
              let entries = Array.isArray(modalTexts) ? modalTexts : Object.entries(modalTexts);
              
              entries = entries.slice().sort((a, b) => {
                const aObj = Array.isArray(a) ? a[1] : a;
                const bObj = Array.isArray(b) ? b[1] : b;
                const aOrder = aObj.orderIndex ?? aObj.order_index ?? 0;
                const bOrder = bObj.orderIndex ?? bObj.order_index ?? 0;
                return aOrder - bOrder;
              });
              return entries.map((entry, i) => {
                const title = entry[0];
                const modalObj = entry[1];
                return (
                  <div
                    key={title}
                    className="bg-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 enter-up pop"
                    style={{ "--i": i }}>
                    <div className="w-16 h-16 flex-shrink-0 rounded-full border border-black bg-[#D6D6D6] flex items-center justify-center text-gray-500 overflow-hidden">
                      {modalObj.iconClass ? (
                        <i
                          className={modalObj.iconClass + " text-white text-2xl icon-tilt"}
                          aria-hidden="true"
                          style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}></i>
                      ) : (
                        <span className="w-8 h-8 block" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-base">{title}</h3>
                      <p className="mt-2 text-sm text-[#606060] whitespace-pre-line">
                        {modalObj.body && modalObj.body.length > 100
                          ? modalObj.body.slice(0, 100) + "..."
                          : modalObj.body || ""}
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const API_BASE =
                              import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
                            const res = await fetch(`${API_BASE}/modals/services`);
                            const json = res?.ok ? await res.json() : null;
                            setModalTexts(json || {});
                            setModalTitle(title);
                            setModalBody((json && json[title] && json[title].body) || "");
                            setModalIconClass((json && json[title] && json[title].iconClass) || "");
                            setModalOldTitle(title);
                          } catch {
                            setModalTitle(title);
                            setModalBody(modalObj.body || "");
                            setModalOldTitle(title);
                          }
                          setEditMode(null);
                          setModalOpen(true);
                        }}
                        className="mt-3 inline-block text-sm text-[#606060] hover:underline">
                        Read more
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE */}
          <div className="text-white">
            <button
              className="mt-2 mb-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded self-start"
              onClick={() => {
                setOriginalSiteSection({
                  title: siteSectionTitle,
                  subtitle: siteSectionSubtitle,
                  body1: siteSectionBody1,
                  body2: Array.isArray(siteSectionBody2) ? [...siteSectionBody2] : [],
                });
                setEditSiteSection((prev) => !prev);
              }}
            >
              Edit section
            </button>
            {!editSiteSection && (
              <>
                <h2 className="text-3xl font-bold">{siteSectionTitle}</h2>
                <h3 className="text-xl font-semibold mt-4">
                  {siteSectionSubtitle}
                </h3>
                <p className="mt-6 max-w-xl whitespace-pre-line">
                  {siteSectionBody1}
                </p>
                <div className="mt-6 bg-white text-black rounded-lg p-4">
                  <ul className="mt-2 space-y-2 text-sm">
                    {Array.isArray(siteSectionBody2) &&
                      siteSectionBody2.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <i
                            className={
                              item.icon + " mr-3 mt-1 text-[#0471AB]"
                            }
                          ></i>
                          {item.text}
                        </li>
                      ))}
                  </ul>
                </div>
              </>
            )}
            {editSiteSection && (
              <EditServicesSiteSection
                title={siteSectionTitle}
                subtitle={siteSectionSubtitle}
                body1={siteSectionBody1}
                body2={siteSectionBody2}
                setTitle={setSiteSectionTitle}
                setSubtitle={setSiteSectionSubtitle}
                setBody1={setSiteSectionBody1}
                setBody2={setSiteSectionBody2}
                saving={false}
                onCancel={() => {
                  setSiteSectionTitle(originalSiteSection.title || "");
                  setSiteSectionSubtitle(originalSiteSection.subtitle || "");
                  setSiteSectionBody1(originalSiteSection.body1 || "");
                  setSiteSectionBody2(
                    Array.isArray(originalSiteSection.body2)
                      ? [...originalSiteSection.body2]
                      : []
                  );
                  setEditSiteSection(false);
                }}
                onSave={async (title, subtitle, body1, body2) => {
                  const API_BASE =
                    import.meta.env.VITE_API_BASE ||
                    import.meta.env.VITE_API_BASE_ONLINE;
                  const adminToken =
                    globalThis.adminToken || globalThis.localStorage.getItem("adminToken") || "";
                  const sectionData = {
                    title,
                    content: JSON.stringify({ title, subtitle, body1, body2 }),
                    adminToken,
                  };
                  await fetch(`${API_BASE}/sections/services-vision`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      ...(adminToken
                        ? { Authorization: "Bearer " + adminToken }
                        : {}),
                    },
                    body: JSON.stringify(sectionData),
                  });
                  setEditSiteSection(false);
                }}
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            <button
              className="mb-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded self-start"
              onClick={() => {
                setOriginalCards({
                  card1: { title: card1Title, text: card1Text, icon: card1Icon },
                  card2: { title: card2Title, text: card2Text, icon: card2Icon },
                  card3: { title: card3Title, text: card3Text, icon: card3Icon },
                });
                setEditCards((prev) => !prev);
              }}
            >
              Edit cards
            </button>
            {!editCards && (
              <>
                {[ 
                  { title: card1Title, text: card1Text, icon: card1Icon },
                  { title: card2Title, text: card2Text, icon: card2Icon },
                  { title: card3Title, text: card3Text, icon: card3Icon }
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-6 shadow flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                      <i className={card.icon}></i>
                    </div>
                    <div>
                      <p className="font-semibold text-black">{card.title}</p>
                      <p className="text-sm text-black mt-1">{card.text}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {editCards && (
              <EditServicesCards
                card1={{ title: card1Title, text: card1Text, icon: card1Icon }}
                card2={{ title: card2Title, text: card2Text, icon: card2Icon }}
                card3={{ title: card3Title, text: card3Text, icon: card3Icon }}
                onCancel={() => {
                  setCard1Title(originalCards.card1.title);
                  setCard1Text(originalCards.card1.text);
                  setCard1Icon(originalCards.card1.icon);
                  setCard2Title(originalCards.card2.title);
                  setCard2Text(originalCards.card2.text);
                  setCard2Icon(originalCards.card2.icon);
                  setCard3Title(originalCards.card3.title);
                  setCard3Text(originalCards.card3.text);
                  setCard3Icon(originalCards.card3.icon);
                  setEditCards(false);
                }}
                onSave={async (card1, card2, card3) => {
                  const API_BASE =
                    import.meta.env.VITE_API_BASE ||
                    import.meta.env.VITE_API_BASE_ONLINE;
                  const adminToken =
                    globalThis.adminToken || globalThis.localStorage.getItem("adminToken") || "";
                  const payload = {
                    title: "Services cards",
                    content: JSON.stringify({ card1, card2, card3 }),
                  };
                  await fetch(`${API_BASE}/sections/services-cards`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      ...(adminToken
                        ? { Authorization: "Bearer " + adminToken }
                        : {}),
                    },
                    body: JSON.stringify(payload),
                  });
                  setEditCards(false);
                }}
              />
            )}
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <button
          className="mt-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded self-start"
          onClick={() => {
            setOriginalMaintenance({
              maintenanceTitle,
              maintenanceBody,
              maintenanceList: [...maintenanceList],
              maintenanceFooter,
            });
            setOriginalOwnership({
              ownershipTitle,
              ownershipBody,
              ownershipListTitle,
              ownershipList: [...ownershipList],
              ownershipFooter,
            });
            setEditMaintenanceOwnership((prev) => !prev);
          }}>
          Edit section
        </button>
        {!editMaintenanceOwnership && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-[#444444]">
                {maintenanceTitle.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < maintenanceTitle.split("\n").length - 1 ? <br /> : null}
                  </span>
                ))}
              </h3>
              <p className="font-semibold mt-4 text-gray-600">{maintenanceBody}</p>
              <div className="mt-6">
                <ul className="mt-3 text-gray-600 space-y-2 pl-5 list-disc">
                  {maintenanceList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-gray-700">{maintenanceFooter}</p>
            </div>
            <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-800">{ownershipTitle}</h4>
              <p className="mt-3 text-gray-600">{ownershipBody}</p>
              <p className="mt-4 font-semibold text-gray-700">{ownershipListTitle}</p>
              <ul className="mt-3 text-gray-600 space-y-2 pl-5 list-disc">
                {ownershipList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-gray-700">{ownershipFooter}</p>
            </aside>
          </div>
        )}
        {editMaintenanceOwnership && (
          <EditMaintenanceOwnership
            maintenance={{
              maintenanceTitle,
              maintenanceBody,
              maintenanceList,
              maintenanceFooter,
            }}
            setMaintenance={m => {
              setMaintenanceTitle(m.maintenanceTitle);
              setMaintenanceBody(m.maintenanceBody);
              setMaintenanceList(m.maintenanceList);
              setMaintenanceFooter(m.maintenanceFooter);
            }}
            ownership={{
              ownershipTitle,
              ownershipBody,
              ownershipListTitle,
              ownershipList,
              ownershipFooter,
            }}
            setOwnership={o => {
              setOwnershipTitle(o.ownershipTitle);
              setOwnershipBody(o.ownershipBody);
              setOwnershipListTitle(o.ownershipListTitle);
              setOwnershipList(o.ownershipList);
              setOwnershipFooter(o.ownershipFooter);
            }}
            saving={false}
            onCancel={() => {
              setMaintenanceTitle(originalMaintenance.maintenanceTitle || "");
              setMaintenanceBody(originalMaintenance.maintenanceBody || "");
              setMaintenanceList(Array.isArray(originalMaintenance.maintenanceList) ? [...originalMaintenance.maintenanceList] : []);
              setMaintenanceFooter(originalMaintenance.maintenanceFooter || "");
              setOwnershipTitle(originalOwnership.ownershipTitle || "");
              setOwnershipBody(originalOwnership.ownershipBody || "");
              setOwnershipListTitle(originalOwnership.ownershipListTitle || "");
              setOwnershipList(Array.isArray(originalOwnership.ownershipList) ? [...originalOwnership.ownershipList] : []);
              setOwnershipFooter(originalOwnership.ownershipFooter || "");
              setEditMaintenanceOwnership(false);
            }}
            onSave={async (m, o) => {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const adminToken = globalThis.adminToken || globalThis.localStorage.getItem("adminToken") || "";
              const payload = {
                title: m.maintenanceTitle,
                content: JSON.stringify({
                  title: m.maintenanceTitle,
                  maintenanceTitle: m.maintenanceTitle,
                  maintenanceBody: m.maintenanceBody,
                  maintenanceList: m.maintenanceList,
                  maintenanceFooter: m.maintenanceFooter,
                  ownershipTitle: o.ownershipTitle,
                  ownershipBody: o.ownershipBody,
                  ownershipListTitle: o.ownershipListTitle,
                  ownershipList: o.ownershipList,
                  ownershipFooter: o.ownershipFooter,
                })
              };
              await fetch(`${API_BASE}/sections/services-maintenance-ownership`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
                },
                body: JSON.stringify(payload),
              });
              setEditMaintenanceOwnership(false);
            }}
          />
        )}
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
            onClick={() => { setModalOpen(false); setEditMode(null); }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setModalOpen(false);
                setEditMode(null);
              }
            }}
          />
          {editMode === "modal" ? (
            <EditModalText
              modalTitle={modalTitle}
              modalBody={modalBody}
              modalIconClass={modalIconClass}
              setModalTitle={setModalTitle}
              setModalBody={setModalBody}
              setModalIconClass={setModalIconClass}
              saving={false}
              onCancel={() => { setModalOpen(false); setEditMode(null); }}
              onSave={async (title, body, iconClass) => {
                try {
                  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
                  let singleModal = {};
                  singleModal[title] = {
                    body,
                    iconClass,
                    orderIndex: 1,
                  };
                  const saveRes = await fetch(`${API_BASE}/modals/services`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(singleModal),
                  });
                  if (saveRes.ok) {
                    const res = await fetch(`${API_BASE}/modals/services`);
                    const json = res?.ok ? await res.json() : null;
                    setModalTexts(json || {});
                  }
                } catch (error) {
                  console.error("Error saving modal text:", error);
                }
                setModalOpen(false);
                setEditMode(null);
              }}
            />
          ) : (
            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
                <button
                  onClick={() => { setModalOpen(false); setEditMode(null); }}
                  className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">{modalBody}</div>
              {/* Icon class is only shown in edit mode, not in view mode */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setEditMode("modal")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded">
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
