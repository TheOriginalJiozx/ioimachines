import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function handleSubscribe(){
    setStatus('');
    if (!email || !email.includes('@')) { setStatus('Please enter a valid email'); return }
    setLoading(true);
    try{
      const res = await fetch('/api/newsletter', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setStatus('Subscribed — thank you!'); setEmail('');
    }catch(e){
      setStatus(e.message || 'Error subscribing');
    }finally{ setLoading(false) }
  }

  return (
    <footer className="bg-[#F7F6F6] font-source-sans-pro">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-sm font-medium text-[#929292]">Follow us</span>
            <div className="flex items-center space-x-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-full flex items-center justify-center">
                <i className="fab fa-facebook-f text-[#7A7A7A]" aria-hidden="true"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-full flex items-center justify-center">
                <i className="fab fa-x text-[#7A7A7A]" aria-hidden="true"></i>
                <span className="sr-only">X</span>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-full flex items-center justify-center">
                <i className="fab fa-linkedin-in text-[#7A7A7A]" aria-hidden="true"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label htmlFor="newsletter-email" className="text-sm text-[#929292] font-medium block sm:inline">Get the Newsletter</label>
            <form className="flex items-center mt-2 sm:mt-0" onSubmit={async (e)=>{e.preventDefault(); await handleSubscribe();}}>
              <input id="newsletter-email" type="email" aria-label="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-l-md w-full sm:w-56 focus:outline-none text-sm" />
              <button disabled={loading} className="bg-[#444444] text-white px-3 py-2 font-semi-bold rounded-r-md text-sm">{loading ? 'Sending...' : 'Subscribe'}</button>
            </form>
            {status && <div className="mt-2 text-sm text-[#444444]">{status}</div>}
          </div>
        </div>

        <div className="mt-6">
          <hr className="mx-auto" style={{width: '100%', borderTop: '1px solid #EBEBEB'}} />
        </div>

        <nav className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between mt-6 text-center space-y-2 sm:space-y-0" aria-label="Footer navigation">
          <a href="/about" className="text-sm text-[#7A7A7A] hover:text-[#444444]">About Us</a>
          <span aria-hidden="true" className="mx-2 text-[#7A7A7A] hidden sm:inline">|</span>
          <a href="/blog" className="text-sm text-[#7A7A7A] hover:text-[#444444]">Blog</a>
          <span aria-hidden="true" className="mx-2 text-[#7A7A7A] hidden sm:inline">|</span>
          <a href="/contact" className="text-sm text-[#7A7A7A] hover:text-[#444444]">Contact Us</a>
        </nav>

        <div className="mt-6">
          <hr className="mx-auto" style={{width: '50px', borderTop: '1px solid #EBEBEB'}} />
        </div>

        <div className="mt-6 text-center text-[12px] text-[#929292]">
          Hvidovrevej 44, 2610 Rødovre, Denmark<br />
          Copyright &copy; IOIMachines. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
