export const Textarea = ({ className, ...props }) => {
    return (
      <textarea
        className={`border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
        {...props}
      />
    );
  };
  