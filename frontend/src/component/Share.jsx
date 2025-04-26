import React, { useState } from 'react'
import { LiaTimesSolid } from "react-icons/lia";

function Share({audioFile,setShare}) {
    const [linkCopy, setLinkCopy] = useState(false);

    const handleCopyLink = () => {
      setLinkCopy(true);
      console.log(linkCopy);
  
      navigator.clipboard.writeText(`${import.meta.env.VITE_BASEURL}/songs/share/${audioFile}`);
  
      // Reset back to "Copy Link" after 3 seconds
      setTimeout(() => {
        setLinkCopy(false);
      }, 3000);
    };
    return (
        <div className="fixed flex p-5 justify-center cursor-auto items-center z-50 top-0 left-0 bg-black/70 w-full h-full">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl md:w-[600px] w-[360px] duration-500 transition-[width]">
                {/* Header */}
                <div className="flex justify-between border-b dark:border-white/20 pb-5 items-center text-black dark:text-white">
                    <h2 className="text-lg font-semibold ">Share public link to song</h2>
                    <button onClick={() => setShare(false)} className="p-1 rounded-full hover:bg-gray-200 hover:dark:bg-gray-600">
                        <LiaTimesSolid />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Your song link is ready to share. Copy the link and send it to your friends!
                </p>

                {/* Link Input */}
                <div className="flex md:flex-row md:gap-0 gap-2 flex-col md:items-center justify-between mt-3 md:p-2 md:pl-4 md:border md:dark:border-white/20 rounded-full md:bg-gray-100 md:dark:bg-slate-800">
                    <input
                        type="text"
                        value={`${import.meta.env.VITE_BASEURL}/songs/share/${audioFile}`}
                        readOnly
                        className="md:w-[70%] md:border-none border md:p-0 p-2 rounded-xl bg-transparent outline-none text-gray-600 dark:text-white"
                    />
                    <button
                        onClick={() => handleCopyLink()}
                        className="bg-black font-bold md:w-[130px] w-full text-white p-2 md:rounded-full rounded-xl"
                    >
                        {linkCopy ? "Link Copied" : "Copy Link"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Share
