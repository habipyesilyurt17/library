import BorrowedBook from "./BorrowedBook";
const BorrowedBookList = ({ books }) => {
  return (
    <div className="overflow-auto rounded-lg shadow">
      <h1 className="font-semibold mb-2 p-2">Borrowed Books List</h1>
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
              Book Name
            </th>
            <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
              Author
            </th>
            <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
              Issue Date
            </th>
            <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">
              Delivery Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {books.length > 0 &&
            books.map((book) => <BorrowedBook book={book} key={book.id} />)}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedBookList;
