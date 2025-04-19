import React, { useEffect, useState, useRef } from 'react';
import toast from "react-hot-toast";
import { RiSendPlane2Fill } from "react-icons/ri";
import { API } from '../services/apiService';
import { LiaTimesSolid } from 'react-icons/lia';

const SongComments = ({ setShowComments, userProfile, userId, songId, songname }) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [songComments, setSongComments] = useState(null);
    const [rows, setRows] = useState(1);
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.rows = 1;
            const lineHeight = 24;
            const lines = Math.floor(textarea.scrollHeight / lineHeight);
            const newRows = Math.min(lines, 5);
            textarea.rows = newRows;
            setRows(newRows);
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [comment]);

    const handleComment = async () => {
        if (comment.trim() === '') {
            toast.error("Please enter a comment...");
            return;
        }
        const tempComment = {
            _id: `temp-${Date.now()}`,
            comment,
            userId: {
                _id: userId,
                name: "You",
                profilePic: userProfile,
            }
        };
        setSongComments((prev) => [...prev, tempComment]);

        setComment("");
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });

        try {
            const { data } = await API.post("/comments/", { songId, comment });
            fetchAllComments();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
            setSongComments((prev) => prev.filter((c) => c._id !== tempComment._id));
        }
    };


    const initialLoad = useRef(true); // using this to track if it's first render...

    const fetchAllComments = async () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        try {
            if (initialLoad.current) {
                setLoading(true);
            }
            const { data } = await API.get(`/comments/${songId}`);
            setSongComments(data.data);
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            if (initialLoad.current) {
                setLoading(false);
                initialLoad.current = false; // turn off for future calls
            }
        }
    };

    useEffect(() => {
        fetchAllComments();
    }, []);

    return (
        <div className='fixed z-50 top-0 left-0 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm'>
            <div className="w-full bg-white transition-all duration-500 max-w-xl mx-auto shadow-lg md:rounded-3xl p-4 flex flex-col md:h-[500px] h-full">
                {/* Header */}
                <div className="flex items-center cursor-auto mb-3 justify-between">
                    <h2 className="md:text-base font-poppins text-sm font-semibold text-black">
                        Feelings & Comments for <span className='font-bold'>{songname}</span>
                    </h2>
                    <button onClick={() => setShowComments(false)} className="p-1 text-xl rounded-full text-black hover:bg-gray-200">
                        <LiaTimesSolid />
                    </button>
                </div>

                {/* Chat Area */}
                <div
                className="flex-1 border cursor-auto no-scrollbar p-3 bg-[#e3dbd331] rounded-3xl overflow-y-auto pr-2">

                    {songComments?.length === 0 && (
                        <div className='flex items-center text-black justify-center h-full'>
                            <p className='text-2xl font-bold'>No Comments</p>
                        </div>
                    )}
                    {loading && (
                        <div className='flex items-center text-black justify-center h-full'>
                            <p className='text-2xl font-bold'>Please wait...</p>
                        </div>
                    )}

                    {songComments?.map((msg, index) => {
                        const isCurrentUser = msg.userId._id === userId;

                        const prevUserId = songComments[index - 1]?.userId?._id;
                        const nextUserId = songComments[index + 1]?.userId?._id;

                        const isFirst = msg.userId._id !== prevUserId;
                        const isLast = msg.userId._id !== nextUserId;

                        let bubbleClass = "rounded-2xl";

                        if (isFirst && isLast) {
                            bubbleClass = "rounded-2xl";
                        } else if (isFirst) {
                            bubbleClass = isCurrentUser
                                ? "rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl rounded-br-md"
                                : "rounded-tr-2xl rounded-br-2xl rounded-tl-2xl rounded-bl-md";
                        } else if (isLast) {
                            bubbleClass = isCurrentUser
                                ? "rounded-tr-md rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"
                                : "rounded-tl-md rounded-bl-2xl rounded-br-2xl rounded-tr-2xl";
                        } else {
                            bubbleClass = isCurrentUser
                                ? "rounded-r-md rounded-l-2xl"
                                : "rounded-l-md rounded-r-2xl";
                        }


                        return (
                            <div key={msg._id} className='relative'>
                                {isLast && <img src={`${import.meta.env.VITE_BASEURL}/assets/users/${msg.userId.profilePic}`} className={`absolute w-7 h-7 rounded-full ${isCurrentUser ? 'right-0 bottom-0' : 'left-0 bottom-0'}`} />}
                                <div

                                    className={`flex items-center ${isCurrentUser ? 'justify-end mr-9' : 'justify-start ml-9'} mb-1`}
                                >
                                    <div
                                        className={`
                                            p-2 px-3 text-black max-w-[75%] text-sm
                                            ${isCurrentUser ? 'bg-green-200' : 'bg-white border'}
                                            ${bubbleClass}
                                            ${isFirst && "mt-3"}
                                        `}
                                    >
                                        {isFirst && (
                                            <p className={`font-bold cursor-pointer mb-1 ${isCurrentUser ? 'text-green-500' : 'text-orange-500'}`}>
                                                {isCurrentUser ? "You" : msg.userId.name}
                                                {console.log(msg.userId.profilePic)}
                                            </p>
                                        )}
                                        <pre className='font-poppins text-wrap'>{msg.comment}</pre>
                                    </div>
                                </div>
                            </div>
                        );
                    })}


                    {/* Auto-scroll point */}
                    <div ref={scrollRef}></div>

                </div>

                {/* Input Section */}
                <div className="mt-4 flex items-center gap-2">
                    <textarea
                        ref={textareaRef}
                        value={comment}
                        rows={rows}
                        type="text"
                        className={`flex-1 font-poppins resize-none text-black focus:outline-none border px-4 py-2 text-sm ${rows > 1 ? 'rounded-xl' : 'rounded-full'
                            }`}
                        placeholder="Share your feeling..."
                        onChange={(e) => setComment(e.target.value)}
                        disabled={userId === undefined}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment();
                            }
                        }}
                    ></textarea>
                    <button
                        onClick={handleComment}
                        className={`bg-green-500 ${userId === undefined ? "pointer-events-none" : "hover:opacity-100"} text-white p-2 rounded-full text-xl opacity-70`}
                    >
                        <RiSendPlane2Fill />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SongComments;
