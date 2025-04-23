import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CourseCategoryDropdown = ({ selectedCategories, setSelectedCategories }) => {
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const loadCategory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/course/loadCategory", {
        withCredentials: true,
      });

      console.log(res);

      if (res.data.categories) {
        const categoryNames = res.data.categories.map((cat) => cat.category_name);
        setCategoriesList(categoryNames);
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

  return (
    <div className="w-1/3 mt-5">
      <h2 className="text-lg font-semibold mb-2">Select Course Categories</h2>

      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
      >
        select categories
        {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="bg-white border rounded-lg shadow-md mt-2 max-h-60 overflow-y-auto">
          {categoriesList.map((category) => (
            <label
              key={category}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            > 
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      )}

      {/* Selected Tags */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap mt-3 gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="flex items-center bg-blue-500 text-white text-sm px-3 py-1 rounded-full"
            >
              {category}
              <button
                onClick={() => handleCategoryChange(category)}
                className="ml-2 text-white font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCategoryDropdown;
