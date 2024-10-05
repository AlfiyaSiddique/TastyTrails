// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <div className="flex justify-between my-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-white ${currentPage === 1 ? 'bg-gray-400' : 'bg-red-700'} rounded`}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-white ${currentPage === totalPages ? 'bg-gray-400' : 'bg-red-700'} rounded`}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Pagination;
