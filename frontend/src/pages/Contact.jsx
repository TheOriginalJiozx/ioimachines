import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function Contact() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Contact Us");
    }
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaA, setCaptchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB, setCaptchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit() {
    setStatus("");
    if (!name || !email || !message) {
      setStatus("Please fill all fields");
      return;
    }
    const expected = String(Number(captchaA) + Number(captchaB));
    if (String(captchaAnswer).trim() !== expected) {
      setStatus("Captcha incorrect");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message }) });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Message sent — we will contact you shortly.");
      setName("");
      setEmail("");
      setMessage("");
      setCaptchaAnswer("");
      setCaptchaA(Math.floor(Math.random() * 9) + 1);
      setCaptchaB(Math.floor(Math.random() * 9) + 1);
    } catch (error) {
      setStatus("Error sending message");
      alert("Error sending message: " + error.message);
    } finally {
      setSending(false);
    }
  }

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
          <img src="/contactus_banner.png" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                Contact Us
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/contactus_img1.png" alt="contact" className="w-full md:h-[28rem] object-cover rounded shadow" />
            </div>
            <div>
              <h2 className="text-[40px] font-semibold text-[#222222]">Get in Touch</h2>
              <p className="mt-4 text-[#444444] text-[15px]">Thank you for showing interest — let us get in touch. <br /> Fill the consultation form below and we'll contact you <br /> shortly to discuss your requirements.</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-semibold text-[#444444]">Address</h3>
                  <p className="mt-3 text-[#444444] text-[14px]">Hvidovrevej 44<br />2610 Rødovre<br />Denmark</p>

                  <h3 className="mt-6 text-2xl font-semibold text-[#444444]">E-mail</h3>
                  <p className="mt-3 text-[#444444] text-[14px]">mc@ioimachines.com</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#444444]">Timing</h3>
                  <p className="mt-3 text-[#444444] text-[14px]">Monday - Friday: 8 AM - 10 PM<br />Saturday: 8 AM - 12 PM<br />Sunday: 8 AM - 12 PM</p>

                  <h3 className="mt-6 text-2xl font-semibold text-[#444444]">Phone</h3>
                  <p className="mt-3 text-[#444444] text-[14px]">(+45) 30 32 89 64</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-center text-white">Request a consultation</h2>

          <div className="mt-10 flex justify-center">
            <form
              className="w-full max-w-2xl"
              onSubmit={async (error) => {
                error.preventDefault();
                await handleSubmit();
              }}
            >
              <div className="space-y-4">
                <input value={name} onChange={(error) => setName(error.target.value)} placeholder="Full Name" className="w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70" />
                <input value={email} onChange={(error) => setEmail(error.target.value)} placeholder="Email address" type="email" className="w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70" />
                <textarea value={message} onChange={(error) => setMessage(error.target.value)} placeholder="Enter your message here" rows={5} className="w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70"></textarea>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-white text-sm">
                    <div>Type in the answer to the sum:</div>
                    <div className="ml-2">
                      {captchaA} + {captchaB} =
                    </div>
                    <input value={captchaAnswer} onChange={(error) => setCaptchaAnswer(error.target.value)} className="w-16 px-2 py-1 rounded text-black" />
                  </div>

                  <div>
                    <button disabled={sending} type="submit" className="bg-black text-white px-6 py-3 rounded">
                      {sending ? "Sending..." : "SEND MESSAGE"}
                    </button>
                  </div>
                </div>

                {status && <div className="text-sm text-white">{status}</div>}
              </div>
            </form>
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
