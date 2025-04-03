import React from "react";
import { faqData } from "../data";

const Faq = () => {
    // State to track which FAQ item is currently open
    
    const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
      Frequently Asked Questions
    </h1>
    <div className="space-y-6">
    {faqData.map((item, index) => (
          // Create a container for each FAQ item
          <div key={index} className="border-b border-gray-200 pb-4">
            {/* Display the question as a heading */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.question}</h3>
            {/* Display the answer as a paragraph */}
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
    </div>
    </div>
    
  );
};

export default Faq;
