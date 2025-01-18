import React, { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { LiaTimesSolid } from "react-icons/lia";
import apiService from "../services/apiService";

function ArtistButtons({ selectedArtist, setSelectedArtist }) {
  const [openArtistPopup, setOpenArtistPopup] = useState(false);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchArtists = async () => {
    try {
      const data = await apiService.getArtists(); // Get artists from API
      setArtists(data); // Set the fetched artists in the state
    } catch (err) {
      setError("Failed to load artists: " + err.message); // Handle errors
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };
  const filteredArtist = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="relative md:mt-5 bg-white rounded-xl flex flex-wrap items-center md:gap-5 gap-3 md:p-0 p-3">
      {/* All Artists Button */}
      <div className="flex gap-[3px]">
        <button
          onClick={() => {
            fetchArtists();
            setOpenArtistPopup(!openArtistPopup);
          }}
          className={`text-nowrap w-fit gap-1 items-center flex text-black  `}
        >
          <div
            className={`md:text-sm p-2 border md:px-4 hover:bg-black rounded-l-xl hover:text-white text-xs ${
              selectedArtist === "all"
                ? "bg-black rounded-r-xl text-white"
                : "hover:border-black rounded-r-sm"
            }`}
          >
            {selectedArtist === "all" ? "All artists" : selectedArtist}
          </div>
        </button>
        {selectedArtist !== "all" && <div
          onClick={() => setSelectedArtist("all")}
          className="p-2 cursor-pointer border flex items-center text-black hover:bg-black rounded-r-xl rounded-l-sm hover:text-white"
        >
          <LiaTimesSolid className="" />
        </div>}
      </div>
      {openArtistPopup && (
        <div className="bg-white no-scrollbar overflow-auto max-h-[300px] flex flex-wrap gap-3 text-black mt-4 border p-4 absolute top-full left-0 z-50 rounded-xl w-full md:w-1/2">
          <LiaTimesSolid
            onClick={() => setOpenArtistPopup(false)}
            className="absolute top-3 z-50 right-3 cursor-pointer"
          />
          <div className="relative h-fit w-full">
            {/* Search Icon */}
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </span>

            {/* Input Field */}
            <input
              type="text"
              className="text-black border w-[70%] rounded-xl pl-12 p-2 outline-none
                            bg-white md:focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50
                            transition-all duration-300 ease-in-out placeholder:text-gray-300 placeholder:text-sm"
              placeholder="Search artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredArtist.length !== 0 && (
            <button
              onClick={() => setSelectedArtist("all")}
              className={`border h-fit text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-lg md:px-4 hover:bg-black hover:text-white ${
                selectedArtist === "all"
                  ? "bg-black text-white"
                  : "hover:border-black"
              }`}
            >
              <span className="md:text-sm text-xs">All</span>
              <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
            </button>
          )}
          {filteredArtist.length == 0 ? (
            <div className="flex flex-col w-full bg-white md:mt-0 mt-5 rounded-xl items-center justify-center h-32">
              <p className="text-gray-500 text-center text-lg font-semibold">
                No artist match your search.
              </p>
              <p className="text-gray-400 text-center">
                Try searching with a different keyword.
              </p>
            </div>
          ) : (
            filteredArtist.map((artist) => (
              <button
                key={artist._id}
                onClick={() => setSelectedArtist(artist.name)}
                className={`border h-fit text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-lg md:px-4 hover:bg-black hover:text-white ${
                  selectedArtist === artist.name
                    ? "bg-black text-white"
                    : "hover:border-black"
                }`}
              >
                <span className="md:text-sm text-xs">{artist.name}</span>
                <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Individual Artist Buttons */}
      <button
        onClick={() => setSelectedArtist("Kishore Kumar")}
        className={`border text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-xl md:px-4 hover:bg-black hover:text-white ${
          selectedArtist === "Kishore Kumar"
            ? "bg-black text-white"
            : "hover:border-black"
        }`}
      >
        <span className="md:text-sm text-xs">Kishore Kumar</span>
        <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
      </button>

      <button
        onClick={() => setSelectedArtist("Lata Mangeshkar")}
        className={`border text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-xl md:px-4 hover:bg-black hover:text-white ${
          selectedArtist === "Lata Mangeshkar"
            ? "bg-black text-white"
            : "hover:border-black"
        }`}
      >
        <span className="md:text-sm text-xs">Lata Mangeshkar</span>
        <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
      </button>

      <button
        onClick={() => setSelectedArtist("Mohammed Rafi")}
        className={`border text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-xl md:px-4 hover:bg-black hover:text-white ${
          selectedArtist === "Mohammed Rafi"
            ? "bg-black text-white"
            : "hover:border-black"
        }`}
      >
        <span className="md:text-sm text-xs">Mohammed Rafi</span>
        <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
      </button>

      <button
        onClick={() => setSelectedArtist("Asha Bhosle")}
        className={`border text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-xl md:px-4 hover:bg-black hover:text-white ${
          selectedArtist === "Asha Bhosle"
            ? "bg-black text-white"
            : "hover:border-black"
        }`}
      >
        <span className="md:text-sm text-xs">Asha Bhosle</span>
        <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
      </button>

      <button
        onClick={() => setSelectedArtist("Mukesh")}
        className={`border text-nowrap w-fit gap-2 items-center flex p-2 text-black rounded-xl md:px-4 hover:bg-black hover:text-white ${
          selectedArtist === "Mukesh"
            ? "bg-black text-white"
            : "hover:border-black"
        }`}
      >
        <span className="md:text-sm text-xs">Mukesh</span>
        <GoArrowUpRight className="inline-block md:text-lg text-gray-400" />
      </button>
    </div>
  );
}

export default ArtistButtons;
