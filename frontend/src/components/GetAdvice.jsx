import React from "react";

export default function GetAdvice() {
  const options = [
    {
      title: "Send Us Sample Images",
      body: "Send us a number of images representing good and bad objects including corner samples.",
    },
    {
      title: "On-Site Image Capture by Our Experts",
      body: "Alternatively, we visit you on-site and take pictures ourselves of the test samples.",
    },
    {
      title: "Live Algorithm Evaluation",
      body: "Or send representative samples to our laboratories.",
    },
    {
      title: "Review Results & Next",
      body: "Get a free evaluation license of our IP core on your windows based computer. Run your own tests on your samples at your convenience.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h3 className="text-[36px] font-bold text-center text-[#606060]">GET ADVICE</h3>
      <h4 className="text-[14px] font-bold text-center text-[#606060]">How can we help you?</h4>
      <p className="text-center text-[#606060] mt-4">
        We perform a free evaluation of our solution on your specific
        <br /> inspection problem. We test our algorithm on the received images
        <br /> and run a live demo of the solution. You have the following options:
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 items-stretch">
        {options.map((opt, i) => (
          <div key={opt.title} className="p-6 border rounded text-left h-full flex items-start">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#606060]">{opt.title}</h4>
                <p className="text-sm text-[#606060] mt-2">{opt.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
