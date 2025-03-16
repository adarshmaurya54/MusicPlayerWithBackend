import React, { useState } from 'react'
import { LiaTimesSolid } from "react-icons/lia";

function Share({audioFile,setOpen}) {
    const [linkCopy, setLinkCopy] = useState(false);

    const handleCopyLink = () => {
      setLinkCopy(true);
      console.log(linkCopy);
  
      navigator.clipboard.writeText(`${import.meta.env.VITE_PRODUCTION_LINK}/song/${audioFile}`);
  
      // Reset back to "Copy Link" after 3 seconds
      setTimeout(() => {
        setLinkCopy(false);
      }, 3000);
    };
    return (
        <div className="fixed flex p-5 justify-center cursor-auto items-center z-50 top-0 left-0 bg-black/40 backdrop-blur-sm w-full h-full">
            <div className="bg-white p-5 rounded-3xl md:w-[600px] w-[360px] duration-500 transition-[width]">
                {/* Header */}
                <div className="flex justify-between border-b pb-5 items-center text-black">
                    <h2 className="text-lg font-semibold ">Share public link to song</h2>
                    <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                        <LiaTimesSolid />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-2">
                    Your song link is ready to share. Copy the link and send it to your friends!
                </p>

                {/* Link Input */}
                <div className="flex md:flex-row md:gap-0 gap-2 flex-col md:items-center justify-between mt-3 md:p-2 md:border rounded-full md:bg-gray-100">
                    <input
                        type="text"
                        value={`${import.meta.env.VITE_PRODUCTION_LINK}/song/${audioFile}`}
                        readOnly
                        className="md:w-[70%] md:border-none border md:p-0 p-2 rounded-xl bg-transparent outline-none text-gray-600"
                    />
                    <button
                        onClick={() => handleCopyLink()}
                        className="bg-black font-bold md:w-[130px] w-full text-white p-2 md:rounded-full rounded-xl"
                    >
                        {linkCopy ? "Link Copied" : "Copy Link"}
                    </button>
                </div>

                {/* Create Link Button */}
            </div>
        </div>
    )
}

export default Share
