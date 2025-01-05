import React, { useState } from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import apiService from "../services/apiService"; // Import the apiService
import { FaCloudUploadAlt } from "react-icons/fa";

function Upload({ handleToggleUpload }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

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
      alert("Please select a file to upload.");
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
          return prevProgress + 10; // Increment progress by 10%
        });
      }, 300); // Simulate upload speed
    } catch (error) {
      // Handle error response
      console.error("Error uploading file:", error);
      setUploadStatus("Upload Failed");
    }
  };

  const submitForm = async () => {
    if (!fileUploaded || !songName || !artistName || !songLyrics) {
      alert("Please upload the file and fill in all fields.");
      return;
    }

    setUploadStatus("Submitting...");
    const formData = new FormData();
    formData.append("songId", songName.replace(/\s+/g, "")); // Remove spaces for songId
    formData.append("songName", songName);
    formData.append("artistName", artistName);
    formData.append("lyrics", songLyrics);
    formData.append("audioFile", file);

    try {
      setLoading(true);
      // Call the backend API to create the song and upload the file
      const response = await apiService.createSong(formData);

      // Handle success response
      setUploadStatus("Song Uploaded Successfully");
      setLoading(false);
    } catch (error) {
      // Handle error response
      console.error("Error creating song:", error);
      setUploadStatus("Upload Failed");
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setUploadStatus("");
    setSongName("");
    setArtistName("");
    setSongLyrics("");
    setFileUploaded(false);
  };

  return (
    <div className="fixed top-0 left-0 bg-black/10 flex justify-center items-center w-full h-full backdrop-blur-lg">
      <div className="relative flex items-center justify-center w-full h-full md:w-[90%] md:h-[90%] bg-white md:rounded-3xl md:p-6 shadow-lg transition-all">
        {/* Close Button */}
        <FaRegTimesCircle
          onClick={handleToggleUpload}
          className="md:absolute fixed top-3 md:right-3 right-5 cursor-pointer text-gray-400 text-3xl"
        />
        <div className="md:flex items-center w-full overflow-auto md:p-0 p-10 h-full">
          <div className="form md:w-[60%]">
            <form
              className="max-w-sm mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-5">
                <label
                  htmlFor="songname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Song Name
                </label>
                <input
                  type="text"
                  id="songname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ex. O Mere Dil Ke Chain"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="artistname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ex. Kishore Kumar"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="songlyrics"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Song Lyrics
                </label>
                <textarea
                  id="songlyrics"
                  rows="6"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter the song lyrics here..."
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                  required
                ></textarea>
              </div>
            </form>
          </div>
          <div className="md:w-[40%]">
            {/* File Input UI */}
            <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl mb-4">
              <div className="md:flex">
                <div className="w-full p-3">
                  <div className="relative h-48 rounded-lg border-2 border-black flex justify-center items-center">
                    <div className="absolute flex flex-col items-center">
                      <img
                        alt="File Icon"
                        className="mb-3"
                        src="https://img.icons8.com/dusk/64/000000/file.png"
                      />
                      <span className="block text-gray-500 font-semibold">
                        Drag & drop your files here
                      </span>
                      <span className="block text-gray-400 font-normal mt-1">
                        or click to upload
                      </span>
                    </div>
                    <input
                      name="file"
                      className="h-full w-full opacity-0 cursor-pointer"
                      type="file"
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
                  <span className="font-semibold">File Size:</span>{" "}
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {/* Progress Bar */}
            {file && (
              <div className="mb-4">
                <div className="relative w-full h-4 bg-gray-200 rounded-lg">
                  <div
                    className={`absolute top-0 left-0 h-full bg-blue-500 rounded-lg transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {progress}% {uploadStatus}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between px-3">
              <button
                className="px-4 py-2 w-[45%] text-sm font-medium bg-black text-white bg-black-500 rounded-lg hover:bg-black/90 hover:outline outline-black outline-offset-2"
                onClick={uploadFile}
                disabled={progress > 0 && progress < 100}
              >
                Upload
              </button>
              <button
                className="px-4 py-2 w-[45%] text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:outline outline-gray-300 outline-offset-2"
                onClick={submitForm}
              >
                Submit Song
              </button>
            </div>
          </div>
        </div>
        {loading && (
          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center backdrop-blur-sm rounded-3xl">
            <div className="bg-white w-[40%] h-[40%] border-2 rounded-3xl flex flex-col justify-center items-center">
              <FaCloudUploadAlt className="text-black text-9xl" />
              <span className="text-black">Uploading your song please wait...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
