import * as React from "react";

export const Progress = ({ value }) => {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
