import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";

export default function Home() {
  const [cards, setCards] = useState([])
  const [hero, setHero] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const base = process.env.REACT_APP_API_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('azurestaticapps.net') ? 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net' : '')
        const url = base ? `${base}/api/cards` : '/api/cards'
        const res = await fetch(url)
        const count = res.headers.get('content-type') || ''
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          console.error('/api/cards failed', res.status, text.slice ? text.slice(0,300) : text)
          return
        }
        if (count.includes('application/json')) {
          const json = await res.json()
          if (!mounted) return
          setCards(json.map(card => ({ id: card.id, title: card.title, desc: card.desc || card.description, icon: card.icon })))
        } else {
          const text = await res.text().catch(() => '')
          alert(`/api/cards returned unexpected content-type: ${count}\n\n${text.slice ? text.slice(0,300) : text}`)
        }
      } catch (error) {
        alert(error.message || error.toString());
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalTexts, setModalTexts] = useState({})
  const [contents, setContents] = useState({})

  useEffect(() => {
    let mounted = true
    async function loadModalTexts() {
      try {
        const base = process.env.REACT_APP_API_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('azurestaticapps.net') ? 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net' : '')
        const url = base ? `${base}/api/modal_texts` : '/api/modal_texts'
        const res = await fetch(url)
        const content = res.headers.get('content-type') || ''
        if (!res.ok) return
        if (content.includes('application/json')) {
          const json = await res.json()
          if (!mounted) return
          const map = {}
          json.forEach(map => { if (map.card_id) map[map.card_id] = map.content })
          setModalTexts(map)
        }
      } catch (error) {
        alert(error.message || error.toString());
      }
    }
    loadModalTexts()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadHero() {
      try {
        const base = process.env.REACT_APP_API_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('azurestaticapps.net') ? 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net' : '')
        const url = base ? `${base}/api/heros` : '/api/heros'
        const res = await fetch(url)
        const content = res.headers.get('content-type') || ''
        if (!res.ok) return
        if (content.includes('application/json')) {
          const json = await res.json()
          if (!mounted) return
          if (Array.isArray(json) && json.length > 0) setHero(json[0])
        }
      } catch (error) {
        console.error('Error loading hero', error)
      }
    }
    loadHero()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadContents() {
      try {
        const base = process.env.REACT_APP_API_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('azurestaticapps.net') ? 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net' : '')
        const url = base ? `${base}/api/contents` : '/api/contents'
        const res = await fetch(url)
        const contentType = res.headers.get('content-type') || ''
        if (!res.ok) return
        if (contentType.includes('application/json')) {
          const json = await res.json()
          if (!mounted) return
          const map = {}
          json.forEach(block => {
            if (block.key) map[block.key] = block.body
            if (block.key && block.icon) map[`${block.key}_icon`] = block.icon
          })
          setContents(map)
        }
      } catch (error) {
        alert(error.message || error.toString());
      }
    }
    loadContents()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Machine Intelligence for Machine Vision");
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.18 });

    const els = Array.from(document.querySelectorAll('.enter-up'));
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [cards]);

  const techCard = cards.find(card => card.title && card.title.toLowerCase() === 'our technology')
  const techTitle = techCard?.title || ''
  const techIntro = techCard?.desc || ''
  const visibleCards = cards.filter(card => !(card.title && card.title.toLowerCase() === 'our technology'))

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#444444] leading-tight">
            {hero && hero.title ? hero.title : ''}
          </h1>
          <p className="text-sm sm:text-base mt-4 text-gray-600 max-w-xl">
            {hero && hero.subtitle ? hero.subtitle : ''}
          </p>
          <button className="mt-6 bg-[#444444] text-white px-5 py-2 rounded shadow text-sm">READ MORE</button>
        </div>
        <div className="flex justify-center md:justify-end mt-4 md:mt-0">
            <div className="w-full max-w-2xl h-56 sm:h-64 md:h-96 bg-gray-100 overflow-hidden flex items-center justify-center rounded">
            <img src={hero && hero.image_url ? hero.image_url : ''} alt="hero" className="object-cover w-full h-full" />
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <section className="border-text border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center">{techTitle}</h2>
          {techIntro && <div className="mt-6 max-w-xl mx-auto text-center text-sm text-[#606060]">{techIntro}</div>}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {visibleCards.map(({ id, title, desc, icon }, i) => (
              <div key={id ?? title} className="bg-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 enter-up pop" style={{ '--i': i }}>
                <div className="w-16 h-16 flex-shrink-0 rounded-full border border-black bg-[#D6D6D6] flex items-center justify-center text-gray-500 overflow-hidden">
                  {icon ? (
                    <img src={icon} alt={`${title} icon`} className="w-10 h-10 object-contain" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))' }} />
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
                      setModalBody(modalTexts[id] || desc);
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

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-start">
          <div className="text-white">
            <h2 className="text-3xl font-bold">{contents.what_title || ''}</h2>
            <h3 className="text-xl font-semibold mt-4">{contents.what_subtitle || ''}</h3>

            <p className="mt-6 max-w-xl">{contents.what_p1 || ''}</p>

            <p className="mt-6 max-w-xl">{contents.what_p2 || ''}</p>

            <div className="mt-6 bg-white text-black rounded-lg p-4">
              <p className="mt-2 text-sm">{contents.what_p3 || ''}</p>
              <p className="mt-2 text-sm">{contents.what_p4 || ''}</p>
            </div>

            <p className="mt-6 text-white font-semibold">{contents.what_p5 || ''}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ '--i': 0 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className={contents.what_p6_icon || ''} aria-hidden="true"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">{contents.what_p6 || ''}</p>
                <p className="text-sm text-black mt-1">{contents.what_p7 || ''}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ '--i': 1 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className={contents.what_p8_icon || ''} aria-hidden="true"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">{contents.what_p8 || ''}</p>
                <p className="text-sm text-black mt-1">{contents.what_p9 || ''}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up" style={{ '--i': 2 }}>
              <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                <i className={contents.what_p10_icon || ''} aria-hidden="true"></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-black">{contents.what_p10 || ''}</p>
                <p className="text-sm text-black mt-1">{contents.what_p11 || ''}</p>
              </div>
            </div>
            
              <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
                  <i className={contents.what_p12_icon || ''} aria-hidden="true"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-black">{contents.what_p12 || ''}</h4>
                  <p className="mt-3 text-sm text-black">{contents.what_p13 || ''}</p>
                  <ul className="mt-2 text-sm text-black list-inside pl-4 space-y-1">
                    <li className="flex items-start"><i className={contents.what_p14_icon || ''} aria-hidden="true"></i><span>{contents.what_p14}</span></li>
                    <li className="flex items-start"><i className={contents.what_p15_icon || ''} aria-hidden="true"></i><span>{contents.what_p14}</span></li>
                    <li className="flex items-start"><i className={contents.what_p16_icon || ''} aria-hidden="true"></i><span>{contents.what_p14}</span></li>
                  </ul>
                  <p className="mt-3 text-sm text-black">{contents.what_p17 || ''}</p>
                </div>
              </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-[#444444]">{contents.why_title || ''}</h3>
            <h4 className="text-xl font-semibold mt-4">{contents.why_subtitle || ''}</h4>

            <p className="mt-4 text-gray-600">{contents.why_p1 || ''}</p>
            <p className="mt-3 text-gray-600">{contents.why_p2 || ''}</p>
            <p className="mt-3 text-gray-600">{contents.why_p3 || ''}</p>
          </div>

          <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800">{contents.why_p4 || ''}</h4>
            <h5 className="mt-3 font-semibold text-gray-700">{contents.why_p5 || ''}</h5>

            <p className="mt-3 text-gray-600">{contents.why_p6 || ''}</p>

            <p className="mt-3 text-gray-600">{contents.why_p7 || ''}</p>
          </aside>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-[36px] font-bold text-center text-[#606060]">{contents.advice_title}</h3>
        <h4 className="text-[14px] font-bold text-center text-[#606060]">{contents.advice_subtitle}</h4>
        <p className="text-center text-[#606060] mt-4">
          {contents.advice_p1 || ''}
          <br /> {contents.advice_p2 || ''}
          <br /> {contents.advice_p3 || ''}
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 items-stretch">
          {[
            contents.advice_p4 || '',
            contents.advice_p6 || '',
            contents.advice_p8 || '',
            contents.advice_p10 || ''
          ].map((text, i) => (
            <div key={text + i} card_id={text} className="p-6 border rounded text-left h-full flex items-start">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#606060]">{text}</h4>
                  {i === 0 && <p className="text-sm text-[#606060] mt-2">{contents.advice_p5 || ''}</p>}
                  {i === 1 && <p className="text-sm text-[#606060] mt-2">{contents.advice_p7 || ''}</p>}
                  {i === 2 && <p className="text-sm text-[#606060] mt-2">{contents.advice_p9 || ''}</p>}
                  {i === 3 && <p className="text-sm text-[#606060] mt-2">{contents.advice_p11 || ''}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <section className="bg-[#F7F6F6]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
              <i className={contents.us_p1_icon || ''} aria-hidden="true"></i>
            </div>
            <p className="mt-4 font-semibold text-[#444444]">{contents.us_p1 || ''}</p>
            <p className="mt-2 text-sm text-[#444444">{contents.us_p2 || ''}</p>
          </div>

          <div>
            <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
              <i className={contents.us_p3_icon || ''} aria-hidden="true"></i>
            </div>
            <p className="mt-4 font-semibold text-[#444444]">{contents.us_p3 || ''}</p>
            <p className="mt-2 text-sm text-[#444444]">{contents.us_p4 || ''}</p>
          </div>

          <div>
            <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
              <i className={contents.us_p5_icon || ''} aria-hidden="true"></i>
            </div>
            <p className="mt-4 font-semibold text-[#444444]">{contents.us_p5 || ''}</p>
            <p className="mt-2 text-sm text-[#444444]">{contents.us_p6 || ''}</p>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <ContactCase />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

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
