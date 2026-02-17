import { useState } from "react";

export default function ContactCase() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api';
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setStatus('Message sent — thank you.');
      setName(''); setEmail(''); setMessage('');
    } catch (error) {
      setStatus('Error sending message');
      console.error(error);
    } finally { setSending(false); }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#444444]">We want to hear about your case</h3>
      <p className="text-[#606060] text-sm sm:text-base mt-2">Contact us for a demo tailored for your needs</p>
      <form className="mt-6 sm:mt-8" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <input required value={name} onChange={(event)=>setName(event.target.value)} className="w-full max-w-lg sm:max-w-md border rounded px-4 py-3 mx-auto text-sm" placeholder="Full Name" />
          <input required value={email} onChange={(event)=>setEmail(event.target.value)} className="w-full max-w-lg sm:max-w-md border rounded px-4 py-3 mx-auto text-sm" placeholder="Email address" type="email" />
          <textarea required value={message} onChange={(event)=>setMessage(event.target.value)} className="w-full max-w-lg sm:max-w-md border rounded px-4 py-3 mx-auto text-sm" rows={4} placeholder="Briefly describe your case" />
        </div>
        <div className="mt-6 flex justify-center">
          <button disabled={sending} className="w-full max-w-lg sm:max-w-md bg-[#444444] text-white px-6 py-3 rounded text-sm">{sending ? 'Sending...' : 'CONTACT US'}</button>
        </div>
        {status && <div className="mt-4 text-sm text-[#444444]">{status}</div>}
      </form>
    </section>
  );
}