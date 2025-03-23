import React from 'react'

function Songs() {
  return (
    <div>
      {/* artist filter buttons */}
              {/* {loading ? (
                <div className="relative border dark:border-white/10 md:border-none mt-5 rounded-xl bg-white dark:bg-slate-900 dark:md:bg-transparent flex flex-wrap items-center md:gap-5 gap-3 md:p-0 p-3 animate-pulse"> */}
                  {/* Skeleton for Individual Artist Buttons */}
                  {/* <div className="flex flex-wrap gap-3">
                    <div className="bg-gray-300 w-32 h-10 rounded-xl flex items-center"></div>
                    <div className="bg-gray-300 w-40 h-10 rounded-xl flex items-center"></div>
                    <div className="bg-gray-300 w-36 h-10 rounded-xl flex items-center"></div>
                    <div className="bg-gray-300 w-32 h-10 rounded-xl flex items-center"></div>
                    <div className="bg-gray-300 w-48 h-10 rounded-xl flex items-center"></div>
                    <div className="bg-gray-300 w-32 h-10 rounded-xl flex items-center"></div>
                  </div>
                </div>
              ) : (
                <ArtistButtons
                  setSelectedArtist={setSelectedArtist}
                  selectedArtist={selectedArtist}
                />
              )} */}
              {/* Song List */}

              {/* {loading ? (
                <SongLoadingScalaton />
              ) : (
                <>
                  {filteredSongs.length === 0 ? (
                    // Message when no songs match the search query
                    <div className="flex flex-col dark:bg-transparent bg-white md:mt-0 mt-5 rounded-xl items-center justify-center h-32">
                      <p className="text-gray-500 text-lg font-semibold">
                        No songs match your search.
                      </p>
                      <p className="text-gray-400">
                        Try searching with a different keyword.
                      </p>
                    </div>
                  ) : (
                    // Display song list if there are matching results
                    <Suspense
                      fallback={
                        <div className="w-full px-4 py-8 mt-4 rounded-2xl flex items-center justify-center bg-white">
                          <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                              <p className="text-xl text-center font-semibold text-gray-700">
                                Please wait, the song is loading...
                              </p>
                              <p className="text-sm text-gray-500 italic">
                                🎵 "Good things take time" 🎶
                              </p>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5">
                        {paginatedSongs.map((song) => (
                          <SongList
                            currentlyPlaying={songId === song.audioFile}
                            isPlaying={isPlaying}
                            key={song.songId}
                            image={
                              songDetail?.highQualityThumbnailUrl
                                ? songDetail?.highQualityThumbnailUrl
                                : "/thumbnails/default-thumbnail-low.png"
                            }
                            handlePlayer={() =>
                              handlePlayer(
                                song.audioFile,
                                song.songName,
                                song.artistName
                              )
                            }
                            id={song._id}
                            likes={song.likes}
                            songId={song.songId}
                            audioFile={song.audioFile}
                            title={song.songName}
                            artist={song.artistName}
                            favourite={song.favourite}
                            handleToggleEdit={handleToggleEdit}
                            fetchSongs={fetchSongs}
                          />
                        ))}
                      </div>
                    </Suspense>
                  )} */}

                  {/* Pagination Controls */}
                  {/* {filteredSongs.length > 0 && (
                    <Pagination
                      filteredSongs={filteredSongs}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageClick={handlePageClick}
                      handlePrevPage={handlePrevPage}
                      handleNextPage={handleNextPage}
                    />
                  )}
                </>
              )} */}
              asdfasdfasdfasdfasdf
    </div>
  )
}

export default Songs
