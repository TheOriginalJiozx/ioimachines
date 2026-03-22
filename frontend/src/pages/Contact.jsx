import { useState, useEffect } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { useAppState } from "../state/useAppState";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";
import ContactBlockEditor from "../components/ContactBlockEditor";
import { saveContactSection, handleContactCancel } from "../utils/contactSaveCancelUtils";
import { renderContactBlock } from "../utils/contactBlockRenderUtils";

export default function Contact() {
  useEffect(() => {
    if (typeof globalThis !== "undefined" && typeof globalThis.setPageTitle === "function") {
      globalThis.setPageTitle("Contact Us");
    }
  }, []);

  const [section, setSection] = useState(null);
                                <button onClick={() => {
                                  const {
                                    blocks,
                                    content,
                                    address,
                                    email,
                                    timing,
                                    phone
                                  } = parseAndInitContactBlocks(section, genId);
                                  setEditTitle(section?.title);
                                  setEditingBlocks(blocks);
                                  setContentEditor(content);
                                  setEditAddress(address);
                                  setEditEmail(email);
                                  setEditTiming(timing);
                                  setEditPhone(phone);
                                  setEditing(true);
                                }} className="px-3 py-1 rounded border">Edit</button></div>}
                    // Helper to parse and initialize blocks and contact fields for edit mode
                    function parseAndInitContactBlocks(section, genId) {
                      const parsed = section?.parsedContent || (section && section.content ? (() => {
                        try {
                          return JSON.parse(section.content)
                        } catch {
                          return null
                        }
                      })() : null);
                      let blocks = [];
                      let content = "";
                      if (parsed && parsed.intro) {
                        if (Array.isArray(parsed.intro)) {
                          const filteredBlocks = parsed.intro.filter((b) => b.type !== 'title');
                          blocks = filteredBlocks.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null }));
                          content = blocksToPlainText(filteredBlocks);
                        } else if (typeof parsed.intro === 'string') {
                          blocks = [{ _id: genId(), type: 'paragraph', text: parsed.intro, contactType: null }];
                          content = parsed.intro;
                        } else {
                          blocks = [{ _id: genId(), type: 'paragraph', text: '', contactType: null }];
                          content = "";
                        }
                      } else if (section && section.content) {
                        try {
                          const maybe = JSON.parse(section.content);
                          if (Array.isArray(maybe)) {
                            blocks = maybe.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null }));
                            content = blocksToPlainText(maybe);
                          } else if (typeof maybe === 'string') {
                            blocks = [{ _id: genId(), type: 'paragraph', text: maybe, contactType: null }];
                            content = maybe;
                          } else {
                            blocks = [{ _id: genId(), type: 'paragraph', text: '', contactType: null }];
                            content = "";
                          }
                          if (maybe && typeof maybe === 'object') {
                            if (maybe.address) blocks = (blocks || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.address, contactType: 'address' }]);
                            if (maybe.email) blocks = (blocks || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.email, contactType: 'email' }]);
                            if (maybe.timing) blocks = (blocks || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.timing, contactType: 'timing' }]);
                            if (maybe.phone) blocks = (blocks || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.phone, contactType: 'phone' }]);
                          }
                        } catch {
                          blocks = [{ _id: genId(), type: 'paragraph', text: section.content, contactType: null }];
                          content = section.content || "";
                        }
                      } else {
                        blocks = [{ _id: genId(), type: 'paragraph', text: '', contactType: null }];
                        content = "";
                      }
                      function parseField(field) {
                        if (!field) return undefined;
                        try {
                          return JSON.parse(field);
                        } catch {
                          return field;
                        }
                      }
                      return {
                        blocks,
                        content,
                        address: parseField(section && section.address),
                        email: parseField(section && section.email),
                        timing: parseField(section && section.timing),
                        phone: parseField(section && section.phone),
                      };
                    }
                    setSection,
                    adminToken,
                    editAddress,
                    editEmail,
                    editTiming,
                    editPhone,
                    contentEditor
                  )}
                />
              ) : (
                <>
                  {(() => {
                    const blocksSource = (section?.parsedContent && Array.isArray(section.parsedContent.intro))
                      ? section.parsedContent.intro
                      : null;

                    if (blocksSource) {
                      const imageBlock = blocksSource.find((b) => b && b.type === 'image');
                      const textBlocks = blocksSource.filter((b) => !b || b.type !== 'image');
                      return (
                        <div className="grid md:grid-cols-2 gap-12 items-center mt-4">
                          <div>
                            {imageBlock ? (
                              <img
                                src={imageBlock.src}
                                alt={imageBlock.alt}
                                className="w-full md:h-[28rem] object-cover rounded shadow"
                              />
                            ) : (
                              <div className="w-full md:h-[28rem] bg-gray-100 rounded shadow" />
                            )}
                          </div>
                          <div className="relative">
                            {adminToken && (
                              <div className="absolute right-0 top-0 z-10">
                                <button onClick={() => {
                                    const parsed = section?.parsedContent || (section && section.content ? (() => {
                                      try {
                                        return JSON.parse(section.content)
                                      } catch {
                                        return null
                                      }
                                    })() : null);
                                    setEditTitle(section?.title);
                                    if (parsed && parsed.intro) {
                                      if (Array.isArray(parsed.intro)) {
                                        const filteredBlocks = parsed.intro.filter((b) => b.type !== 'title');
                                        setEditingBlocks(filteredBlocks.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null })));
                                        setContentEditor(blocksToPlainText(filteredBlocks));
                                      } else if (typeof parsed.intro === 'string') {
                                        setEditingBlocks([{ _id: genId(), type: 'paragraph', text: parsed.intro, contactType: null }]);
                                        setContentEditor(parsed.intro);
                                      } else {
                                        setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                                        setContentEditor("");
                                      }
                                    } else if (section && section.content) {

                                      try {
                                        const maybe = JSON.parse(section.content);
                                        if (Array.isArray(maybe)) {
                                          setEditingBlocks(maybe.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null })));
                                          setContentEditor(blocksToPlainText(maybe));
                                        } else if (typeof maybe === 'string') {
                                          setEditingBlocks([{ _id: genId(), type: 'paragraph', text: maybe, contactType: null }]);
                                          setContentEditor(maybe);
                                        } else {
                                          setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                                          setContentEditor("");
                                        }

                                        if (maybe && typeof maybe === 'object') {
                                          if (maybe.address) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.address, contactType: 'address' }]));
                                          if (maybe.email) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.email, contactType: 'email' }]));
                                          if (maybe.timing) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.timing, contactType: 'timing' }]));
                                          if (maybe.phone) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.phone, contactType: 'phone' }]));
                                        }
                                      } catch {
                                        setEditingBlocks([{ _id: genId(), type: 'paragraph', text: section.content, contactType: null }]);
                                        setContentEditor(section.content || "");
                                      }
                                    } else {
                                      setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                                      setContentEditor("");
                                    }

                                    try {
                                      const a = section && section.address ? (function() {
                                        try {
                                          return JSON.parse(section.address)
                                        } catch {return section.address} })() : null; setEditAddress(a);
                                      } catch {
                                        setEditAddress();
                                      }
                                    try {
                                      const m = section && section.email ? (function() {
                                        try {
                                          return JSON.parse(section.email)
                                        } catch {
                                          return section.email
                                        }
                                      })() : null; setEditEmail(m);
                                    } catch {
                                      setEditEmail();
                                    }
                                    try {
                                      const t = section && section.timing ? (function() {
                                        try {
                                          return JSON.parse(section.timing)
                                        } catch {
                                          return section.timing
                                        }
                                      })() : null;
                                      setEditTiming(t);
                                    } catch {
                                      setEditTiming();
                                    }
                                    try {
                                      const p = section && section.phone ? (function() {
                                        try {
                                          return JSON.parse(section.phone)
                                        } catch {
                                          return section.phone}
                                        })() : null;
                                        setEditPhone(p);
                                      } catch {
                                        setEditPhone();
                                      }

                                    setEditingBlocks((prev) => {
                                      const arr = (prev || []).slice();
                                      const hasType = (type) => arr.some((b) => b.contactType === type);
                                      try {
                                        if (!hasType('address') && section && section.address) {
                                          const val = (function() {
                                            try {
                                              return JSON.parse(section.address)
                                          } catch {
                                            return section.address
                                          }
                                        })();
                                          arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'address' });
                                        }
                                      } catch (error) {
                                        console.error("Failed to parse address for editing", error);
                                      }
                                      try {
                                        if (!hasType('email') && section && section.email) {
                                          const val = (function() {
                                            try { return JSON.parse(section.email)
                                          } catch {
                                            return section.email
                                          }
                                        })();
                                          arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'email' });
                                        }
                                      } catch (error) {
                                        console.error("Failed to parse email for editing", error);
                                      }
                                      try {
                                        if (!hasType('timing') && section && section.timing) {
                                          const val = (function() {
                                            try {
                                              return JSON.parse(section.timing)
                                          } catch {
                                            return section.timing
                                          }
                                        })();
                                          arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'timing' });
                                        }
                                      } catch (error) {
                                        console.error("Failed to parse timing for editing", error);
                                      }
                                      try {
                                        if (!hasType('phone') && section && section.phone) {
                                          const val = (function() {
                                          try {
                                            return JSON.parse(section.phone)
                                          } catch {
                                            return section.phone}
                                        })();
                                          arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'phone' });
                                        }
                                      } catch (error) {
                                        console.error("Failed to parse phone for editing", error);
                                      }
                                      return arr;
                                    });

                                    setEditing(true);
                                  }} className="px-3 py-2 bg-gray-200 rounded">Edit section</button>
                              </div>
                            )}
                            <h2 className="text-[34px] font-semibold text-[#222222]">{section?.title}</h2>
                            <div className="mt-4 text-[15px] leading-relaxed">
                              {textBlocks.map((block, i) => renderContactBlock(block, i+1))}
                            </div>
                            {(section?.address || section?.email || section?.phone || section?.timing) && (
                              <div className="mt-8 grid md:grid-cols-2 gap-8 text-[#444444] text-[15px]">
                                <div>
                                  {section?.address && (
                                    <>
                                      <h3 className="text-xl font-semibold">Address</h3>
                                      <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: (section.address || '') }} />
                                    </>
                                  )}
                                  {section?.email && (
                                    <>
                                      <h3 className="mt-6 text-xl font-semibold">E-mail</h3>
                                      <div className="mt-3 text-sm">
                                        <a href={`mailto:${(section.email || '').replaceAll(/^"|"$/g, '')}`} className="text-[#444444] underline">{(section.email || '').replaceAll(/^"|"$/g, '')}</a>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div>
                                  {section?.timing && (
                                    <>
                                      <h3 className="text-xl font-semibold">Timing</h3>
                                      <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: (section.timing || '') }} />
                                    </>
                                  )}
                                  {section?.phone && (
                                    <>
                                      <h3 className="mt-6 text-xl font-semibold">Phone</h3>
                                      <div className="mt-3 text-sm">{(section.phone || '').replaceAll(/^"|"$/g, '')}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (section?.parsedContent && typeof section.parsedContent.intro === 'string') {
                      return (
                        <div className="mt-4 text-[#444444] text-[15px]">
                          <div dangerouslySetInnerHTML={{ __html: section.parsedContent.intro || '' }} />
                        </div>
                      );
                    }

                    return (
                      <p className="mt-4 text-[#444444] text-[15px]" dangerouslySetInnerHTML={{ __html: section?.content }} />
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-center text-white">Request a Consultation</h2>

          <div className="mt-10 flex justify-center">
              <RequestConsultation variant="contact" />
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
