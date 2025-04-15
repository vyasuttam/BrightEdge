import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const filters = [
  { title: "Topic", options: ["Python", "AI/ML", "Data Science", "JavaScript"] },
  { title: "Price", options: ["Free", "Paid"] },
];

export default function CourseFilters() {

  const [expanded, setExpanded] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilters = Object.fromEntries(searchParams.entries());

  // const get

  const handleCheckboxChange = (title, option) => {
    const currentFilters = selectedFilters[title]?.split(",") || [];
    const updatedFilters = currentFilters.includes(option)
      ? currentFilters.filter((f) => f !== option)
      : [...currentFilters, option];

    if (updatedFilters.length > 0) {
      searchParams.set(title, updatedFilters.join(","));
    } else {
      searchParams.delete(title);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-64 bg-white p-4 shadow rounded">
      {filters.map(({ title, options }) => (
        <div key={title}>
          <button className="w-full flex justify-between py-2" onClick={() => setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))}>
            {title} {expanded[title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expanded[title] && (
            <div>
              {options.map((option) => (
                <label key={option} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFilters[title]?.split(",").includes(option) || false}
                    onChange={() => handleCheckboxChange(title, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}