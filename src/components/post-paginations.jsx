import React from "react";

const PostPaginations = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      // Always show first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Show pages around current
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <ul className="list-unstyled post-pagination d-flex justify-content-center align-items-center">
      {/* Previous Button */}
      <li>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 12px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          <i className="far fa-angle-left"></i>
        </button>
      </li>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <li key={index}>
          {page === '...' ? (
            <span style={{ padding: '8px 12px', color: '#666' }}>...</span>
          ) : (
            <button
              onClick={() => handlePageClick(page)}
              className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              style={{
                background: page === currentPage ? '#007bff' : 'none',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                color: page === currentPage ? 'white' : '#333',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                minWidth: '40px'
              }}
            >
              {page.toString().padStart(2, '0')}
            </button>
          )}
        </li>
      ))}

      {/* Next Button */}
      <li>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 12px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          <i className="far fa-angle-right"></i>
        </button>
      </li>

      <style jsx>{`
        .pagination-btn:hover:not(.disabled) {
          background-color: #f8f9fa !important;
          transform: translateY(-2px);
        }
        
        .pagination-btn.active:hover {
          background-color: #0056b3 !important;
        }
      `}</style>
    </ul>
  );
};

export default PostPaginations;
