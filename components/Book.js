import { BiEdit, BiTrash } from "react-icons/bi";

const Book = ({ book, onUpdate, onDelete }) => {
  return (
    <tr className="odd:bg-white even:bg-gray-50" key={book.id}>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.name}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.author}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.category}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {book.page}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        <span className="flex flex-auto">
          <BiEdit
            className="text-blue-500 mr-2 cursor-pointer"
            onClick={() => onUpdate(book.id)}
          />
          <BiTrash
            className="text-red-500 cursor-pointer"
            onClick={() => onDelete(book.id)}
          />
        </span>
      </td>
    </tr>
  );
};

export default Book;
