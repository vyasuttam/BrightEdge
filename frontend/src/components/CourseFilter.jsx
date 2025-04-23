import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

export default function CourseFilters() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilters = Object.fromEntries(searchParams.entries());

  const loadCategory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/course/loadCategory", {
        withCredentials: true,
      });
      if (res.data.categories) {
        const categoryNames = res.data.categories.map((cat) => cat.category_name);
        setCategories(categoryNames);
      } else {
        console.error("No categories found");
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const filters = [
    { title: "Topic", options: categories },
    { title: "Price", options: ["Free", "Paid"] },
  ];

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
          <button
            className="w-full flex justify-between py-2"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
            }
          >
            {title} {expanded[title] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expanded[title] && (
            <div>
              {options.length > 0 ? (
                options.map((option) => (
                  <label key={option} className="block text-sm">
                    <input
                      type="checkbox"
                      checked={selectedFilters[title]?.split(",").includes(option) || false}
                      onChange={() => handleCheckboxChange(title, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">Loading...</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
