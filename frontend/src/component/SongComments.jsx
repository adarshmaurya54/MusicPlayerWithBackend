import React, { useEffect, useState, useRef } from 'react';
import toast from "react-hot-toast";
import { RiSendPlane2Fill } from "react-icons/ri";
import chatbgimage from '../assets/chatbgimage.jpg';
import { API } from '../services/apiService';
import { LiaTimesSolid } from 'react-icons/lia';

const SongComments = ({ setShowComments, userId, songId, songname }) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [songComments, setSongComments] = useState([]);
    const scrollRef = useRef(null);

    const handleComment = async () => {
        if (comment.trim() === '') {
            toast.error("Please enter a comment...");
            return;
        }
        try {
            const { data } = await API.post("/comments/", { songId, comment });
            setComment("");
            fetchAllComments();
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const fetchAllComments = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/comments/${songId}`);
            setSongComments(data.data);
            setLoading(false);
            // scroll to bottom after rendering
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchAllComments();
    }, []);

    return (
        <div className='fixed z-50 top-0 left-0 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm'>
            <div className="w-full transition-all duration-500 max-w-xl mx-auto bg-white shadow-lg md:rounded-3xl p-4 flex flex-col md:h-[500px] h-full">
                {/* Header */}
                <div className="flex items-center mb-3 justify-between">
                    <h2 className="md:text-base text-sm font-semibold text-black">
                        Feelings & Comments for <span className='font-bold'>{songname}</span>
                    </h2>
                    <button onClick={() => setShowComments(false)} className="p-1 rounded-full text-black hover:bg-gray-200">
                        <LiaTimesSolid />
                    </button>
                </div>

                {/* Chat Area */}
                <div style={{ backgroundImage: `url(${chatbgimage})` }}
                    className="flex-1 no-scrollbar p-3 bg-center bg-cover bg-fixed rounded-3xl overflow-y-auto pr-2">

                    {songComments?.length === 0 && (
                        <div className='flex items-center justify-center h-full'>
                            <p className='text-2xl font-bold'>No Comments</p>
                        </div>
                    )}
                    {loading && (
                        <div className='flex items-center justify-center h-full'>
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
                                ? "rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl rounded-br-none"
                                : "rounded-tr-2xl rounded-br-2xl rounded-tl-2xl rounded-bl-none";
                        } else if (isLast) {
                            bubbleClass = isCurrentUser
                                ? "rounded-tr-none rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"
                                : "rounded-tl-none rounded-bl-2xl rounded-br-2xl rounded-tr-2xl";
                        } else {
                            bubbleClass = isCurrentUser
                                ? "rounded-r-none rounded-l-2xl"
                                : "rounded-l-none rounded-r-2xl";
                        }


                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}
                            >
                                <div
                                    className={`
                    p-2 px-3 text-black max-w-[75%] text-sm
                    ${isCurrentUser ? 'bg-green-200' : 'bg-white text'}
                    ${bubbleClass}
                `}
                                >
                                    {isFirst && (
                                        <p className={`font-bold mb-1 ${isCurrentUser ? 'text-green-500' : 'text-orange-500'}`}>
                                            {isCurrentUser ? "You" : msg.userId.name}
                                        </p>
                                    )}
                                    <p>{msg.comment}</p>
                                </div>
                            </div>
                        );
                    })}


                    {/* Auto-scroll point */}
                    <div ref={scrollRef}></div>
                </div>

                {/* Input Section */}
                <div className="mt-4 border-t pt-3 flex items-center gap-2">
                    <input
                        value={comment}
                        type="text"
                        className="flex-1 text-black focus:outline-none border rounded-full px-4 py-2 text-sm"
                        placeholder="Share your feeling..."
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleComment();
                        }}
                    />
                    <button
                        onClick={handleComment}
                        className="bg-green-500 text-white p-2 rounded-full text-xl opacity-70 hover:opacity-100"
                    >
                        <RiSendPlane2Fill />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SongComments;
