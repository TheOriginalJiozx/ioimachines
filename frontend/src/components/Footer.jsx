export default function Footer() {
  return (
    <footer className="bg-[#F7F6F6] font-source-sans-pro">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-[16px] font-medium font-sans mr-4 text-[#929292]">Follow us</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-[99px] flex items-center justify-center">
              <i className="fab fa-facebook-f text-[#7A7A7A]" aria-hidden="true"></i>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-[99px] flex items-center justify-center text-gray-500">
              <i className="fab fa-x text-[#7A7A7A]" aria-hidden="true"></i>
              <span className="sr-only">X</span>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#EBEBEB] rounded-[99px] flex items-center justify-center text-gray-500">
              <i className="fab fa-linkedin-in text-[#7A7A7A]" aria-hidden="true"></i>
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="newsletter-email" className="text-sm text-[#929292] font-medium">Get the Newsletter</label>
            <form className="flex items-center" onSubmit={(e)=>e.preventDefault()}>
              <input id="newsletter-email" type="email" aria-label="email" placeholder="Your email address" className="px-4 py-2 border border-gray-300 rounded-l-md w-56 focus:outline-none" />
              <button className="bg-[#444444] text-white px-4 py-2 font-semi-bold rounded-r-md">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-6">
          <hr className="mx-auto" style={{width: '100%', borderTop: '1px solid #EBEBEB'}} />
        </div>

        <nav className="max-w-xl mx-auto flex items-center justify-between mt-6 text-center" aria-label="Footer navigation">
          <a href="/about" className="text-sm text-[#7A7A7A] hover:text-[#444444]">About Us</a>
          <span aria-hidden="true" className="mx-4 text-[#7A7A7A]">|</span>
          <a href="/blog" className="text-sm text-[#7A7A7A] hover:text-[#444444]">Blog</a>
          <span aria-hidden="true" className="mx-4 text-[#7A7A7A]">|</span>
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
