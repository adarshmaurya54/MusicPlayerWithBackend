import React, { useState } from "react";
import { FaArrowLeft, FaRegTimesCircle } from "react-icons/fa";
import apiService from "../services/apiService"; // Import the apiService
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

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
        setErrorMessage(response.message);
        setUploadStatus(response.message); // Handle existing song case
      } else {
        setErrorMessage("");
        setUploadStatus(response.message || "Song Uploaded Successfully");
        handleToggleUpload();
        fetchSongs();
      }

      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
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

  return (
    <div className="fixed z-50 top-0 left-0 bg-black/10 flex justify-center items-center w-full h-full backdrop-blur-lg">
      <div className="relative flex items-center justify-center w-full h-full md:w-[90%] md:h-[95%] bg-white md:rounded-3xl md:p-6 shadow-lg transition-all">
        {errorMessage !== "" && (
          <div className="absolute top-12 md:top-4 md:right-4 right-auto md:w-fit w-[350px] p-4 bg-red-500 text-white rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 ease-in-out">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="ml-2 text-white font-semibold hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
        )}

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
                } rounded-lg`}
                onClick={submitForm}
                disabled={!fileUploaded} // Disable until fileUploaded is true
              >
                Submit Song
              </button>
            </form>
          </div>
          <div className="md:w-[40%] md:mt-0 mt-4">
            {/* File Input UI */}
            <div className="rounded-lg overflow-hidden mb-4">
              <div className="md:flex">
                <div className="w-full">
                  <div className="relative h-48 rounded-lg border-2 border-dashed border-gray-400 flex justify-center items-center">
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="block text-gray-600 font-semibold text-lg">
                        Drag & drop your files here
                      </span>
                      <span className="block text-gray-500 font-normal mt-1">
                        or click to upload
                      </span>
                    </div>
                    <input
                      name="file"
                      className="h-full w-full opacity-0 cursor-pointer"
                      type="file"
                      accept=".mp3"
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
                className="px-4 py-2 w-[45%] text-sm font-medium bg-black text-white bg-black-500 rounded-lg hover:bg-black/90 hover:outline outline-black outline-offset-2"
                onClick={uploadFile}
                disabled={progress > 0 && progress < 100}
              >
                Upload
              </button>
              {/* Reset Button */}
              <button
                className="px-4 py-2 w-[45%] text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:outline outline-gray-300 outline-offset-2"
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
