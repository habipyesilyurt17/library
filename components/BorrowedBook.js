const BorrowedBook = ({ book }) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50" key={book.id}>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.name}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.author}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.issue_date}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.delivery_date}
      </td>
    </tr>
  );
};

export default BorrowedBook;
