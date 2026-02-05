import React from "react";

export default function ContactFeatures() {
  return (
    <section className="bg-[#F7F6F6]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
            <i className="fas fa-balance-scale text-2xl text-[#444444]" aria-hidden="true"></i>
          </div>
          <p className="mt-4 font-semibold text-[#444444]">Fast Feasibility, No Commitment</p>
          <p className="mt-2 text-sm text-[#444444]">Quickly understand whether your inspection task can be automated.</p>
        </div>

        <div>
          <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
            <i className="fas fa-bullseye text-2xl text-[#444444]" aria-hidden="true"></i>
          </div>
          <p className="mt-4 font-semibold text-[#444444]">Proven Accuracy on Your Real Products</p>
          <p className="mt-2 text-sm text-[#444444]">We test using your actual samples and edge cases to ensure reliable performance.</p>
        </div>

        <div>
          <div className="w-14 h-14 mx-auto rounded-xl bg-white flex items-center justify-center text-[#444444] mb-4 shadow-sm">
            <i className="fas fa-user-cog text-2xl text-[#444444]" aria-hidden="true"></i>
          </div>
          <p className="mt-4 font-semibold text-[#444444]">Expert Guidance from Vision Specialists</p>
          <p className="mt-2 text-sm text-[#444444]">Our engineers analyze your application and recommend the optimal vision setup.</p>
        </div>
      </div>
    </section>
  );
}
