export default function ContactCase() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h3 className="text-[30px] font-bold text-[#444444]">We want to hear about your case</h3>
      <p className="text-[#606060] text-[16px] mt-2">Contact us for a demo tailored for your needs</p>
      <form className="mt-8">
        <div className="flex flex-col items-center space-y-4">
          <input className="w-full max-w-sm border rounded px-4 py-3 mx-auto" placeholder="Full Name" />
          <input className="w-full max-w-sm border rounded px-4 py-3 mx-auto" placeholder="Email address" />
        </div>
        <div className="mt-6 flex justify-center">
          <button className="w-full max-w-sm bg-[#444444] text-white px-6 py-3 rounded">CONTACT US</button>
        </div>
      </form>
    </section>
  );
}
