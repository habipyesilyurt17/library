const Pagination = ({ booksPerPage, totalBooks, currentPage, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className=" mt-3 mb-8 flex bg-white rounded-lg font-[Poppins]">
      {pageNumbers.map((number) => (
        <button
          onClick={() => paginate(number)}
          key={number}
          className={`h-12 w-12 border-2 not-last:border-r-0 border-indigo-600 ${
            currentPage === number && "bg-indigo-600 text-white"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
