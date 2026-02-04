import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";

export default function CaseStudies() {
  const [hero, setHero] = useState(null)
  const [heroTwo, setHeroTwo] = useState(null)

  const [contents, setContents] = useState({})

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
          if (Array.isArray(json) && json.length > 0) setHero(json[2])
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
    async function loadHeroTwo() {
      try {
        const base = process.env.REACT_APP_API_BASE || (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname.includes('azurestaticapps.net') ? 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net' : '')
        const url = base ? `${base}/api/heros` : '/api/heros'
        const res = await fetch(url)
        const content = res.headers.get('content-type') || ''
        if (!res.ok) return
        if (content.includes('application/json')) {
          const json = await res.json()
          if (!mounted) return
          if (Array.isArray(json) && json.length > 0) setHeroTwo(json[3])
        }
      } catch (error) {
        console.error('Error loading hero two', error)
      }
    }
    loadHeroTwo()
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
      window.setPageTitle("Case Studies");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans">
      <section className="relative w-full mb-16">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src={hero && hero.image_url ? hero.image_url : ''} className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))'}}>{hero && hero.title ? hero.title : ''}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-[#404D56] overflow-hidden flex items-center justify-center">
          <img src={heroTwo && heroTwo.image_url ? heroTwo.image_url : ''} className="object-contain h-3/4 w-auto" alt="heroTwo" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.50))'}}>{heroTwo && heroTwo.title ? heroTwo.title : ''}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">{contents.case_title || 'Vision Inspection of Rotors for rotary screw air compressors'}</h2>
            {contents.case_subtitle && <p className="text-sm text-gray-600 mb-6">{contents.case_subtitle}</p>}

            <div className="flex items-start gap-8 mb-6">
              <div className="w-48 flex-shrink-0">
                <img src={contents.case_image || ''} alt="case" className="object-contain w-full h-auto" />
              </div>
              <div className="flex-1 text-sm text-[#606060] whitespace-pre-line">
                {contents.case_body || `Rotors of rotary screw type air compressors have complex geometry. When they come out of grinding machines, various pores happen to appear on the surface. Some of these pores are big enough to consider as defects. These pores have arbitrary shapes and geometries and present a challenge to detect using conventional machine vision systems if they lie in shadowed areas caused by the geometry or at edges.`}
              </div>
            </div>

            <p className="text-sm text-[#606060] mb-3">{contents.case_lead || ''}</p>
            <ul className="list-disc pl-5 text-sm text-[#606060] mb-6">
              <li>{contents.case_b1 || 'No reprogramming or re-engineering is required'}</li>
              <li>{contents.case_b2 || 'Zero downtime'}</li>
              <li>{contents.case_b3 || 'Zero escapements'}</li>
              <li>{contents.case_b4 || 'Seamless solution for different rotors of different shapes and sizes'}</li>
            </ul>
          </div>

          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <img src={contents.case_solution_image || ''} alt="solution" className="w-full h-40 object-contain mb-4" />
              <h3 className="text-xl font-semibold">{contents.case_solution_title || 'The Solution'}</h3>
              <p className="text-sm text-[#606060] mt-2">{contents.case_solution_body || 'Solution text here'}</p>
            </div>
          </aside>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

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

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

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

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <ContactCase />

      <div class="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>
    </div>
  );
}
