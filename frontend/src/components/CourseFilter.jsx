import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const filters = [

  {
    title: "Topic",
    options: [
      "Python",
      "Artificial Intelligence (AI)",
      "Machine Learning",
      "Data Science",
      "Generative AI (GenAI)",
      "ChatGPT",
      "Deep Learning",
      "Data Analysis",
      "R (programming language)",
      "Statistics",
      "Learning Strategies",
      "Math",
      "Computer Vision",
      "NLP",
      "JavaScript",
      "SQL",
    ],
  },
  {
    title: "Level",
    options: ["Beginner", "Intermediate", "Advanced", "All Levels"],
  },
  {
    title: "Price",
    options: ["Free", "Paid"],
  },
];

export default function CourseFilters() {
  const [expanded, setExpanded] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleDropdown = (title) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleCheckboxChange = (title, option) => {
    setSelectedFilters((prev) => {
      const selected = prev[title] || [];
      return {
        ...prev,
        [title]: selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      };
    });
  };

  return (
    <div className="w-80 bg-white shadow-md p-4 rounded-md">
      {filters.map(({ title, options }) => (
        <div key={title} className="border-b last:border-b-0">
          <button
            className="w-full flex justify-between items-center py-3 text-left font-semibold"
            onClick={() => toggleDropdown(title)}
          >
            {title}
            {expanded[title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expanded[title] && (
            <div className="pb-3">
              {options.map((option) => (
                <label key={option} className="flex items-center space-x-2 mb-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFilters[title]?.includes(option) || false}
                    onChange={() => handleCheckboxChange(title, option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
