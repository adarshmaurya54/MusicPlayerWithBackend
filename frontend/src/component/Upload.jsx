import React, { useState } from "react";
import { FaArrowLeft, FaRegTimesCircle } from "react-icons/fa";
import apiService from "../services/apiService"; // Import the apiService
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

function Upload({ handleToggleUpload, fetchSongs }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [songName, setSongName] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0); // Reset progress bar
      setUploadStatus(""); // Reset status message
      setFileUploaded(false); // Reset file upload status
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("audioFile", file);

    try {
      // Simulate file upload process (this can be an actual upload request to your server)
      const uploadInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(uploadInterval);
            setUploadStatus("Upload Complete");
            setFileUploaded(true);
            return 100;
          }
          return prevProgress + 1; // Increment progress by 10%
        });
      }, 10);
    } catch (error) {
      // Handle error response
      console.error("Error uploading file:", error);
      setUploadStatus("Upload Failed");
    }
  };

  const generateRandomString = (length) => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Lowercase, uppercase, and digits
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const submitForm = async () => {
    const toastId = toast.loading("Please wait...");
    if (!fileUploaded || !songName || !songLyrics) {
      alert("Please upload the file and fill in all fields.");
      return;
    }

    setUploadStatus("Submitting...");
    const formData = new FormData();

    // Create songId based on songName
    const formattedSongName = songName.trim().replace(/\s+/g, ""); // Remove spaces from the songName
    const randomString = generateRandomString(8); // Generate 8 random characters

    const songId = formattedSongName + "-" + randomString; // Combine formatted songName and random string

    formData.append("songId", songId); // Use the generated songId
    formData.append("songName", songName.trim());
    formData.append("lyrics", songLyrics.trim());
    formData.append("audioFile", file);

    try {
      setLoading(true);
      const response = await apiService.createSong(formData);

      if (response.flag === "SONG_EXISTS") {
        toast.error(response.message, { id: toastId });
        setUploadStatus(response.message); // Handle existing song case
      } else {
        toast.success("Song Uploaded Successfully!", { id: toastId });
        setUploadStatus(response.message || "Song Uploaded Successfully");
        handleToggleUpload();
        fetchSongs();
      }

      setLoading(false);
    } catch (error) {
      toast.error(error.message, { id: toastId });
      const errorMessage = error.message || "Upload Failed. Please try again.";
      setUploadStatus(errorMessage);
      setLoading(false);
      console.error("Error creating song:", error.message);
    }
  };
  console.log(uploadStatus);

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setUploadStatus("");
    setSongName("");
    setArtistName("");
    setSongLyrics("");
    setFileUploaded(false);
  };
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} Bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="fixed z-50 top-0 left-0 bg-black/10 flex justify-center items-center w-full h-full backdrop-blur-lg">
      
      <div className="relative flex items-center justify-center w-full h-full md:w-[90%] md:h-[95%] bg-white md:rounded-3xl md:p-6 shadow-lg transition-all">
        <div className="flex text-black absolute md:top-7 md:left-7 top-5 left-4 justify-between items-center">
          <FaArrowLeft
            onClick={handleToggleUpload}
            className="text-xl cursor-pointer"
          />
        </div>
        <div className="md:flex items-center w-full overflow-auto md:p-0 px-10 py-14 h-full">
          <div className="form md:w-[60%]">
            <form
              className="md:max-w-sm mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-5">
                <label
                  htmlFor="songname"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Song Name
                </label>
                <input
                  type="text"
                  id="songname"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  placeholder="Ex. O Mere Dil Ke Chain"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="songlyrics"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Song Lyrics
                </label>
                <textarea
                  id="songlyrics"
                  rows="6"
                  className="border resize-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
                  placeholder="Enter the song lyrics here..."
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                className={`px-4 py-2 w-full text-sm font-medium ${
                  fileUploaded
                    ? "text-white bg-black hover:outline outline-black outline-offset-2"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed"
                } rounded-xl`}
                onClick={submitForm}
                disabled={!fileUploaded} // Disable until fileUploaded is true
              >
                Submit Song
              </button>
            </form>
          </div>
          <div className="md:w-[40%] md:p-3 md:mt-0 mt-10">
            {/* File Input UI */}
            <div className="mb-4">
              <div className="md:flex">
                <div className="w-full">
                  <div className="relative  transition-all duration-500 group border-[3px] border-dashed border-gray-300 rounded-3xl p-6 hover:shadow-lg hover:border-black">
                    <div className="flex flex-col items-center justify-center h-48 space-y-3 text-center">
                      <svg
                        className="h-36 text-gray-500 transition-all duration-500 group-hover:text-black mb-4"
                        viewBox="0 0 640 512"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(5 1)"> <path style={{fill : "#Fff"}} d="M460.067,122.733v341.333c0,18.773-15.36,34.133-34.133,34.133h-358.4 c-18.773,0-34.133-15.36-34.133-34.133V37.4c0-18.773,15.36-34.133,34.133-34.133H340.6V88.6c0,18.773,15.36,34.133,34.133,34.133 H460.067z"></path> <path style={{fill :"#FFf"}} d="M460.067,122.733h-85.333c-18.773,0-34.133-15.36-34.133-34.133V3.267L460.067,122.733z"></path> <path style={{fill:"#e3e3e3"}} d="M169.933,412.867c18.773,0,34.133-15.36,34.133-34.133c0-18.773-15.36-34.133-34.133-34.133 S135.8,359.96,135.8,378.733C135.8,397.507,151.16,412.867,169.933,412.867z M306.467,378.733c18.773,0,34.133-15.36,34.133-34.133 s-15.36-34.133-34.133-34.133c-18.773,0-34.133,15.36-34.133,34.133S287.693,378.733,306.467,378.733z"></path> </g> <path style={{fill:"#51565F"}} d="M430.933,503.467h-358.4c-21.333,0-38.4-17.067-38.4-38.4V38.4C34.133,17.067,51.2,0,72.533,0H345.6 c0.853,0,2.56,0.853,3.413,0.853l85.333,85.333c1.707,1.707,1.707,4.267,0,5.973c-1.707,1.707-4.267,1.707-5.973,0l-84.48-84.48 H72.533c-16.213,0-29.867,13.653-29.867,29.867v426.667c0,16.213,13.653,29.867,29.867,29.867h358.4 c16.213,0,29.867-13.653,29.867-29.867V127.147h-81.067c-21.333,0-38.4-17.067-38.4-38.4V46.08c0-2.56,1.707-4.267,4.267-4.267 s4.267,1.707,4.267,4.267v42.667c0,16.213,13.653,29.867,29.867,29.867h85.333c2.56,0,4.267,1.707,4.267,4.267v341.333 C469.333,486.4,452.267,503.467,430.933,503.467z M174.933,418.133c-21.333,0-38.4-17.067-38.4-38.4c0-21.333,17.067-38.4,38.4-38.4 c2.56,0,4.267,1.707,4.267,4.267c0,2.56-1.707,4.267-4.267,4.267c-16.213,0-29.867,13.653-29.867,29.867 c0,16.213,13.653,29.867,29.867,29.867s29.867-13.653,29.867-29.867v-153.6c0-1.707,1.707-3.413,3.413-4.267l136.533-34.133 c0.853,0,2.56,0,3.413,0.853c0.853,0.853,1.707,1.707,1.707,3.413v153.6c0,21.333-17.067,38.4-38.4,38.4s-38.4-17.067-38.4-38.4 c0-21.333,17.067-38.4,38.4-38.4c2.56,0,4.267,1.707,4.267,4.267c0,2.56-1.707,4.267-4.267,4.267 c-16.213,0-29.867,13.653-29.867,29.867c0,16.213,13.653,29.867,29.867,29.867s29.867-13.653,29.867-29.867V197.12l-128,32.427 v150.187C213.333,401.067,196.267,418.133,174.933,418.133z"></path> </g></svg>
                      <span className="block text-gray-600 transition-all duration-500 font-semibold text-lg group-hover:text-black">
                        Drag & drop your files here
                      </span>
                      <span className="block text-gray-500 font-normal text-sm">
                        or click to upload a file
                      </span>
                    </div>
                    <input
                      name="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Details */}
            {file && (
              <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">File Name:</span> {file.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">File Size:</span> {formatFileSize(file.size)}
              </p>
            </div>
            )}

            {/* Progress Bar */}
            {file && (
              <div className="mb-4">
                <div className="relative w-full h-1 bg-gray-200 rounded-lg">
                  <div
                    className={`absolute top-0 left-0 h-full bg-black rounded-lg transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {progress}% {uploadStatus}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                className="px-4 py-2 w-[45%] text-sm font-medium bg-black text-white bg-black-500 rounded-xl hover:bg-black/90 hover:outline outline-black outline-offset-2"
                onClick={uploadFile}
                disabled={progress > 0 && progress < 100}
              >
                Upload
              </button>
              {/* Reset Button */}
              <button
                className="px-4 py-2 w-[45%] text-sm font-medium text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 hover:outline outline-gray-300 outline-offset-2"
                onClick={resetUpload}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {loading && (
          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center backdrop-blur-sm rounded-3xl">
            <div className="bg-white transition-[width] md:w-[40%] w-[90%] h-[40%] border-2 rounded-3xl flex flex-col justify-center items-center">
              <FaCloudUploadAlt className="text-black text-9xl" />
              <span className="text-black">
                Uploading your song please wait...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
