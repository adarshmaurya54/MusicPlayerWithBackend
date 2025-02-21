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
    filteredSongs.length > 0 &&
    totalPages !== 1 && (
      <div className="flex md:bg-transparent bg-white dark:bg-slate-900 dark:border-white/10 border md:border-none rounded-xl md:justify-center justify-evenly mt-4 items-center">
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-lg text-black dark:text-white"
        >
          <FaAngleLeft className="text-2xl" />
        </button>

        <div>
          {/* Page Numbers */}
          {totalPages > 4 && (
            <div className="flex items-center space-x-2 md:px-4 py-2">
              {/* Show the first page number always */}
              {totalPages > 4 && currentPage > 3 && (
                <button
                  onClick={() => handlePageClick(1)}
                  className="md:px-4 px-3 md:hover:ring-2 dark:hover:ring-0 hover:ring-gray-500 hover:ring-opacity-50
           dark:ring-offset-0 ring-offset-2  py-2 dark:border-white/10 border rounded-lg text-black dark:text-white"
                >
                  1
                </button>
              )}

              {/* Ellipsis if there are skipped pages between start and current */}
              {currentPage > 3 && (
                <span className="text-[0.6rem] text-gray-500 md:text-base">•••</span>
              )}

              {/* Show pages around the current page */}
              {pageNumbers.map((page) => {
                if (page >= currentPage - 1 && page <= currentPage + 1) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`md:px-4 px-3 dark:ring-0 md:hover:ring-2
           hover:ring-offset-2 dark:hover:ring-offset-0 md:transition duration-300  py-2 dark:border-white/10  border rounded-lg ${
             page === currentPage
               ? "dark:bg-white bg-black hover:ring-black dark:text-black text-white"
               : "text-black dark:text-white dark:hover:ring-0 hover:ring-gray-500 hover:ring-opacity-50"
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
                <span className="text-[0.6rem] text-gray-500 md:text-base">•••</span>
              )}

              {/* Show the last page number always */}
              {totalPages > 4 && currentPage < totalPages - 1 && (
                <button
                  onClick={() => handlePageClick(totalPages)}
                  className="md:px-4 px-3 py-2 md:hover:ring-2 dark:hover:ring-0 hover:ring-gray-500 hover:ring-opacity-50
           dark:ring-offset-0 ring-offset-2  transition-all duration-300 dark:border-white/10 border rounded-lg text-black dark:text-white"
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
                    page === currentPage ? "dark:bg-white bg-black dark:text-black text-white" : "text-black dark:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="text-black dark:text-white"
        >
          <FaAngleRight className="text-2xl" />
        </button>
      </div>
    )
  );
};

export default Pagination;
