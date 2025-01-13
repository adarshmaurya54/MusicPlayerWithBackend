// Pagination.js
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({
  filteredSongs,
  currentPage,
  totalPages,
  handlePageClick,
  handlePrevPage,
  handleNextPage,
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    filteredSongs.length > 0 && (
      <div className="flex justify-center mt-4 items-center">
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-lg md:text-black"
        >
          <FaAngleLeft className="text-2xl" />
        </button>

        {/* Page Numbers */}
        {totalPages > 4 && (
          <div className="flex items-center space-x-2 px-4 py-2">
            {/* Show the first page number always */}
            {totalPages > 4 && currentPage > 3 && (
              <button
                onClick={() => handlePageClick(1)}
                className="px-4 md:hover:ring-2 hover:ring-gray-500 hover:ring-opacity-50
           ring-offset-2  transition-all duration-300 py-2 border rounded-lg md:text-black text-white"
              >
                1
              </button>
            )}

            {/* Ellipsis if there are skipped pages between start and current */}
            {currentPage > 3 && <span className="md:text-gray-500">•••</span>}

            {/* Show pages around the current page */}
            {pageNumbers.map((page) => {
              if (page >= currentPage - 1 && page <= currentPage + 1) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-4 md:hover:ring-2
           ring-offset-2  transition-all duration-300  py-2 border rounded-lg ${
                      page === currentPage
                        ? "md:bg-black hover:ring-black bg-white md:text-white text-black"
                        : "md:text-black hover:ring-gray-500 hover:ring-opacity-50 text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            {/* Ellipsis if there are skipped pages between the current and the last page */}
            {currentPage < totalPages - 1 && (
              <span className="md:text-gray-500">•••</span>
            )}

            {/* Show the last page number always */}
            {totalPages > 4 && currentPage < totalPages - 1 && (
              <button
                onClick={() => handlePageClick(totalPages)}
                className="px-4 py-2 md:hover:ring-2 hover:ring-gray-500 hover:ring-opacity-50
           ring-offset-2  transition-all duration-300 border rounded-lg md:text-black text-white"
              >
                {totalPages}
              </button>
            )}
          </div>
        )}
        {totalPages <= 4 && (
          <div className="flex space-x-2 px-4 py-2">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-4 py-2 border rounded-lg ${
                  page === currentPage
                    ? "md:bg-black bg-white md:text-white text-black"
                    : "md:text-black text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="md:text-black"
        >
          <FaAngleRight className="text-2xl" />
        </button>
      </div>
    )
  );
};

export default Pagination;
