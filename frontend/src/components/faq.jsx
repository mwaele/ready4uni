import React, { useState } from "react";
import { faqData } from "../data";

const Faq = () => {
  // State to track which FAQ item is currently open
  const [openIndex, setOpenIndex] = useState(null);

  //   Toggle function for FAQ items - If the clicked item is already open, close it (set to null)
  //  If a different item is clicked, open that one instead
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* heading */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-300">
            {/* Button that toggles the FAQ answer visibility */}
            <button
              className="w-full flex justify-between items-center text-left p-4"
              onClick={() => toggleFAQ(index)} // Click event toggles open/close state
            >
              {/* Display the question */}
              <h3 className="text-lg font-semibold text-gray-700">
                {item.question}
              </h3>

              {/* Icon for expanding/collapsing FAQ item */}
              <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-500">
                {/* If this FAQ item is open, show "-" else show "+" */}
                {openIndex === index ? "-" : "+"}
              </span>
            </button>

            {/* FAQ answer - only shown if the corresponding question is open */}
            {openIndex === index && (
              <p className="p-4 text-gray-600">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
