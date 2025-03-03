import React from "react";

function InputType({
  value,
  placeholder,
  onChange,
  name,
  inputType,
  labelText,
  labelFor,
  error,
}) {
  return (
    <div className="mb-1 w-full">
      <label
        className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        htmlFor={labelFor}
      >
        {labelText}
      </label>
      <input
      required={false}
        type={inputType}
        id={labelFor}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={` text-gray-900 text-sm rounded-xl focus:ring-2 focus:outline-none block w-full p-2.5 dark:bg-gray-800 dark:placeholder-gray-500 dark:text-gray-100 ${
          error ? "border-red-500 focus:ring-red-500 bg-red-50" : "focus:ring-blue-500 bg-slate-100"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default InputType;
