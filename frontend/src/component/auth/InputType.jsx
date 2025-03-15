import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";

function InputType({
  value,
  extraClass,
  placeholder,
  onChange,
  name,
  required,
  inputType,
  labelText,
  labelFor,
  error,
}) {
  const [commingValue, setCommingValue] = useState(value);
  
  return (
    <div className={`mb-1 w-full ${extraClass}`}>
      <label
        className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        htmlFor={labelFor}
      >
        {labelText}
      </label>
      <div className="relative group">
        <input
          required={required}
          type={inputType}
          id={labelFor}
          name={name}
          value={value}
          onChange={(e) => {setCommingValue(e.target.value); onChange(e.target.value)}}
          placeholder={placeholder}
          className={` w-full border-none px-5 py-3 rounded-2xl shadow-lg placeholder-gray-400 focus:outline focus:outline-2 outline-offset-2 ${error ? "border-red-500 focus:outline-red-500 bg-red-50" : "focus:outline-black "
            }`}
        />
        <LiaTimesSolid onClick={() => {onChange(''); setCommingValue('')}} className={`absolute top-1/2 right-2 cursor-pointer -translate-y-1/2 ${commingValue ? "group-hover:block hidden" : "hidden"}`}/>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default InputType;
