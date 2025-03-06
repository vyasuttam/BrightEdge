export default function CourseCard() {
    return (
      <div className="max-w-xs rounded-2xl shadow-lg border border-gray-200 overflow-hidden bg-white">
        <div className="relative">
          <img
            src="/courseImage.png"
            alt="Course"
            className="w-full h-40 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Perfect Diet & Meal Plan - Complete Course
          </h3>
          <p className="text-sm text-gray-500">
            By <span className="font-semibold">fehemmedia</span> in Featured, Health & Fitness
          </p>
        </div>
        <div className="p-4">
          <button className="w-full bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition">
            Enroll Course
          </button>
        </div>
      </div>
    );
  }
  
