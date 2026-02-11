import { useState } from "react";

export default function RequestConsultation({ onClose, modal = false, variant = "default" }) {
  const [captchaA, setCaptchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB, setCaptchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
      const API_BASE = process.env.REACT_APP_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
      const res = await fetch(`${API_BASE}/consultation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
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

  const content = (
    <div className={variant === "contact" ? "relative w-full max-w-2xl mx-4 z-10" : "relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 z-10"}>
      <div className={variant === "contact" ? "p-0 mt-4" : "p-6"}>
        {modal && (
          <div className="flex items-start justify-between">
            <h3 className={variant === "contact" ? "text-lg font-semibold text-white" : "text-lg font-semibold text-gray-800"}>
              Request A Consultation
            </h3>
            <button onClick={() => onClose && onClose()} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        )}

        <div className={modal && variant !== "contact" ? "mt-4" : ""}>
          <form
            className={variant === "contact" ? "w-full max-w-2xl" : "w-full"}
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmit();
            }}
          >
          <div className="space-y-4">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full Name" className={variant === "contact" ? "w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70" : "w-full px-4 py-3 rounded border border-gray-300 bg-white text-[#444444] placeholder-gray-400"} />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" type="email" className={variant === "contact" ? "w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70" : "w-full px-4 py-3 rounded border border-gray-300 bg-white text-[#444444] placeholder-gray-400"} />
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Enter your message here" rows={5} className={variant === "contact" ? "w-full px-4 py-3 rounded border border-white bg-transparent text-white placeholder-white/70" : "w-full px-4 py-3 rounded border border-gray-300 bg-white text-[#444444] placeholder-gray-400"} />

            <div className="flex items-center justify-between">
              <div className={"flex items-center space-x-4 text-sm " + (variant === "contact" ? "text-white" : "text-[#444444]")}>
                <div>Type in the answer to the sum:</div>
                <div className="ml-2">
                  {captchaA} + {captchaB} =
                </div>
                <input value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value)} className={variant === "contact" ? "w-16 px-2 py-1 rounded text-black" : "w-16 px-2 py-1 rounded border border-gray-300"} />
              </div>

              <div>
                <button disabled={sending} type="submit" className="bg-black text-white px-6 py-3 rounded">
                  {sending ? "Sending..." : "SEND MESSAGE"}
                </button>
              </div>
            </div>

            {status && <div className={"text-sm " + (variant === "contact" ? "text-white" : "text-[#444444]")}>{status}</div>}
          </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (modal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => onClose && onClose()} />
        {content}
      </div>
    );
  }

  return content;
}
