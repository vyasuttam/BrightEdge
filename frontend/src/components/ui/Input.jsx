export const Input = ({ className, ...props }) => {
    return (
      <input
        className={`border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
        {...props}
      />
    );
  };
  