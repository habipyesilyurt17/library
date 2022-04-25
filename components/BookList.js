import { useState, useRef, useEffect } from "react";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import Modal from "./Modal";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import Spinner from "./Spinner";
import Book from "./Book";
import Pagination from "./Pagination";
import BorrowedBookList from "./BorrowedBookList";

const BookList = ({ books, students }) => {
  const [booksData, setBooksData] = useState(books);
  const [borrowedBooks, setBorrowedBooks] = useState();
  const [studentsData, setStudentData] = useState(students);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(2);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createBook, setCreateBook] = useState(false);
  const [borrow, setBorrow] = useState(false);
  const [returnBook, setReturnBook] = useState(false);

  const [category, setCategory] = useState(null);
  const [bookInput, setBookInput] = useState();
  const [authorInput, setAuthorInput] = useState();
  const [pageInput, setPageInput] = useState();
  const [book, setBook] = useState({});

  const [choseBook, setChoseBook] = useState();

  const studentNoRef = useRef(null);
  const issueDateRef = useRef(null);
  const deliveryDateRef = useRef(null);

  const bookInputRef = useRef(null);
  const authorInputRef = useRef(null);
  const pageInputRef = useRef(null);

  const booksCollectionRef = collection(db, "books");
  const studentsCollectionRef = collection(db, "students");

  const [queryInput, setQueryInput] = useState("");
  const keys = ["name", "author", "category"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(queryInput))
    );
  };

  const handleDropdown = () => {
    const dropdown = document.getElementById("dropdown-menu");
    setShowDropdown(!showDropdown);
    dropdown.classList.toggle("hidden");
  };

  const cancelBookHandler = () => {
    setCreateBook(false);
    setUpdating(false);
    setBorrow(false);
    setReturnBook(false);
    setDeleting(false);
  };

  const createBookHandler = async () => {
    setCreateBook(false);
    setIsLoading(true);

    const name = bookInputRef.current.value.trim();
    const author = authorInputRef.current.value.trim();
    const page = pageInputRef.current.value.trim();
    const borrowed = false;

    if (name.trim().length === 0 || author.trim().length === 0) {
      return;
    }

    const bookObject = {
      author,
      borrowed,
      category,
      delivery_date: "",
      issue_date: "",
      name,
      page,
      created_at: Date.now(),
    };

    await addDoc(booksCollectionRef, bookObject)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const updateBookHandler = async () => {
    setUpdating(false);
    setIsLoading(true);
    const updatedBook = {
      ...book,
      ...{
        author: authorInput,
        borrowed: false,
        category,
        delivery_date: "",
        issue_date: "",
        name: bookInput,
        page: pageInput,
      },
    };
    const updatedBookDoc = doc(db, "books", updatedBook.id);
    await updateDoc(updatedBookDoc, updatedBook)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const borrowBookHandler = async () => {
    setBorrow(false);
    setIsLoading(true);
    const student_no = studentNoRef.current.value.trim();
    const issue_date = issueDateRef.current.value.trim();
    const delivery_date = deliveryDateRef.current.value.trim();

    const filterBook = booksData.filter((book) => book.name === choseBook)[0];

    const findStudent = studentsData.find(
      (student) => student.student_no === student_no
    );

    const updatedBook = {
      ...filterBook,
      ...{
        borrowed: true,
        delivery_date,
        issue_date,
      },
    };

    const updatedStudent = {
      ...findStudent,
      ...{
        books: [...findStudent.books, { ...updatedBook }],
      },
    };

    const updatedBookDoc = doc(db, "books", updatedBook.id);
    const updatedStudentDoc = doc(db, "students", updatedStudent.id);

    await updateDoc(updatedBookDoc, updatedBook)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });

    await updateDoc(updatedStudentDoc, updatedStudent)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const returnBookHandler = async () => {
    setReturnBook(false);
    setIsLoading(true);
    const student_no = studentNoRef.current.value.trim();
    const filterBook = booksData.filter((book) => book.name === choseBook)[0];
    const findStudent = studentsData.find(
      (student) => student.student_no === student_no
    );

    const updatedBook = {
      ...filterBook,
      ...{
        borrowed: false,
      },
    };

    const filteredStudentBooks = findStudent.books.filter(
      (book) => book.name !== updatedBook.name
    );

    const updatedStudent = {
      ...findStudent,
      ...{
        books: [...filteredStudentBooks],
      },
    };

    const updatedBookDoc = doc(db, "books", updatedBook.id);
    const updatedStudentDoc = doc(db, "students", updatedStudent.id);
    await updateDoc(updatedBookDoc, updatedBook)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
    await updateDoc(updatedStudentDoc, updatedStudent)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const handleChangeBook = (e) => {
    setBookInput(e.target.value);
  };

  const handleChangeAuthor = (e) => {
    setAuthorInput(e.target.value);
  };

  const handleChangePage = (e) => {
    setPageInput(e.target.value);
  };

  const handleChangeStudentNo = (e) => {
    setStudentNoInput((v) => (e.target.validity.valid ? e.target.value : v));
  };

  const handleChangeChoseBook = (e) => {
    setChoseBook(e.target.value);
  };

  const handleChangeIssueDate = (e) => {
    setIssueDateInput(e.target.value);
  };

  const handleChangeDeliveryDate = (e) => {
    setDeliveryDateInput(e.target.value);
  };

  const onUpdate = (bookId) => {
    const selectedBook = booksData.find((book) => book.id === bookId);
    setUpdating(true);
    setBook(selectedBook);
    setBookInput(selectedBook.name);
    setAuthorInput(selectedBook.author);
    setPageInput(selectedBook.page);
    setCategory(selectedBook.category);
  };

  const onDelete = (bookId) => {
    const selectedBook = booksData.find((book) => book.id === bookId);
    setDeleting(true);
    setBook(selectedBook);
  };

  const deleteBookHandler = async () => {
    setDeleting(false);
    setIsLoading(true);

    const deletedBookDoc = doc(db, "books", book.id);
    await deleteDoc(deletedBookDoc)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const fetchData = async () => {
    const fetchBook = [];
    const fetchStudent = [];
    const queryBook = query(booksCollectionRef, orderBy("created_at", "desc"));
    const queryStudent = query(studentsCollectionRef, orderBy("name", "desc"));

    const dataBook = await getDocs(queryBook);
    const dataStudent = await getDocs(queryStudent);

    dataBook.forEach((doc) => {
      fetchBook.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    dataStudent.forEach((doc) => {
      fetchStudent.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    const borrowBook = [];
    fetchBook.map((book) =>
      book.borrowed === true ? borrowBook.push(book) : ""
    );
    setBooksData(fetchBook);
    setStudentData(fetchStudent);
    setIsLoading(false);
    setBorrowedBooks(borrowBook);
    setChoseBook();
  };

  // Get current Books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = booksData.slice(indexOfFirstBook, indexOfLastBook);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    console.log("aaaa");
    const borrowBook = [];
    booksData.map((book) => {
      if (book.borrowed === true) {
        borrowBook.push(book);
      }
    });
    setBorrowedBooks(borrowBook);
  }, []);

  return (
    <div className="p-5 w-full h-screen">
      <div className="flex justify-between">
        <div className="relative flex items-center text-gray-400 focus-within:text-gray-600 mb-3 md:w-full max-w-md">
          <BiSearch className="w-5 h-5 absolute ml-3 mt-4 pointer-events-none" />
          <input
            onChange={(e) => setQueryInput(e.target.value)}
            type="text"
            name="search"
            placeholder="Search a book"
            autoComplete="off"
            className="md:w-full max-w-md pr-3 pl-10 py-2 mt-4 font-semibold placeholder-gray-500 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2"
          />
        </div>
        <div className="right-0 mt-3 relative inline-block">
          <BiChevronDown
            onClick={handleDropdown}
            className="cursor-pointer w-10 h-10 text-gray-500"
          />

          <div
            className="bg-white hidden absolute right-0 z-10 shadow-lg rounded-md mt-1 p-2 text-sm w-48"
            id="dropdown-menu"
          >
            {showDropdown && (
              <>
                <a
                  className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                  onClick={() => {
                    setCreateBook(true);
                    handleDropdown();
                  }}
                >
                  Create a Book
                </a>
                <a
                  className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                  onClick={() => {
                    setBorrow(true);
                    handleDropdown();
                  }}
                >
                  Borrow a Book
                </a>
                <a
                  className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                  onClick={() => {
                    setReturnBook(true);
                    handleDropdown();
                  }}
                >
                  Return a Book
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {createBook && (
        <Modal
          title="Create a Book"
          canCancel
          canConfirm
          onCancel={cancelBookHandler}
          onConfirm={createBookHandler}
          confirmText="Create"
          confirmColor="primary"
        >
          <form className="mb-0 space-y-6">
            <div>
              <label
                htmlFor="book"
                className="block text-sm font-medium text-gray-700"
              >
                Book Name
              </label>
              <div className="mt-1">
                <input
                  ref={bookInputRef}
                  id="book"
                  name="book"
                  type="text"
                  autoComplete="book"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <div className="mt-1">
                <input
                  ref={authorInputRef}
                  id="author"
                  name="author"
                  type="text"
                  autoComplete="current-author"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <div className="mt-1">
                <select
                  onChange={handleChangeCategory}
                  name="category"
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                >
                  <option value="">Please select</option>
                  <option value="novel">Novel</option>
                  <option value="poem">Poem</option>
                  <option value="story">Story</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="page"
                className="block text-sm font-medium text-gray-700"
              >
                Page
              </label>
              <div className="mt-1">
                <input
                  ref={pageInputRef}
                  id="page"
                  name="page"
                  type="number"
                  autoComplete="current-page"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {updating && (
        <Modal
          title="Update Book"
          canCancel
          canConfirm
          onCancel={cancelBookHandler}
          onConfirm={updateBookHandler}
          confirmText="Update"
          confirmColor="primary"
        >
          <form className="mb-0 space-y-6">
            <div>
              <label
                htmlFor="book"
                className="block text-sm font-medium text-gray-700"
              >
                Book Name
              </label>
              <div className="mt-1">
                <input
                  value={bookInput}
                  onChange={(e) => handleChangeBook(e)}
                  id="book"
                  name="book"
                  type="text"
                  autoComplete="book"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <div className="mt-1">
                <input
                  value={authorInput}
                  onChange={(e) => handleChangeAuthor(e)}
                  id="author"
                  name="author"
                  type="text"
                  autoComplete="current-author"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <div className="mt-1">
                <select
                  value={category}
                  onChange={handleChangeCategory}
                  name="category"
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                >
                  <option value="">Please select</option>
                  <option value="novel">Novel</option>
                  <option value="poem">Poem</option>
                  <option value="story">Story</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="page"
                className="block text-sm font-medium text-gray-700"
              >
                Page
              </label>
              <div className="mt-1">
                <input
                  value={pageInput}
                  onChange={(e) => handleChangePage(e)}
                  id="page"
                  name="page"
                  type="number"
                  autoComplete="current-page"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal
          title="Delete Book"
          canCancel
          canConfirm
          onCancel={cancelBookHandler}
          onConfirm={deleteBookHandler}
          confirmText="Delete"
          confirmColor="danger"
        >
          <div className="mt-2 text-sm">
            <p>Are you sure you want to delete this book?</p>
          </div>
        </Modal>
      )}

      {borrow && (
        <Modal
          title="Borrow a Book"
          canCancel
          canConfirm
          onCancel={cancelBookHandler}
          onConfirm={borrowBookHandler}
          confirmText="Borrow"
          confirmColor="primary"
        >
          <form className="mb-0 space-y-6">
            <div>
              <label
                htmlFor="student_no"
                className="block text-sm font-medium text-gray-700"
              >
                Student Number
              </label>
              <div className="mt-1">
                <input
                  ref={studentNoRef}
                  id="student_no"
                  name="student_no"
                  type="text"
                  pattern="[0-9]*"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="book"
                className="block text-sm font-medium text-gray-700"
              >
                Book
              </label>
              <div className="mt-1">
                <select
                  value={choseBook}
                  onChange={handleChangeChoseBook}
                  name="book"
                  id="book"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                >
                  <option value="">Please select a Book</option>
                  {booksData.map(
                    (book) =>
                      !book.borrowed && (
                        <option key={book.id} value={book.name}>
                          {book.name}
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Issue Date
              </label>
              <div className="mt-1">
                <input
                  ref={issueDateRef}
                  id="date"
                  name="date"
                  type="date"
                  autoComplete="current-date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Delivery Date
              </label>
              <div className="mt-1">
                <input
                  ref={deliveryDateRef}
                  id="date"
                  name="date"
                  type="date"
                  autoComplete="current-date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {returnBook && (
        <Modal
          title="Return a Book"
          canCancel
          canConfirm
          onCancel={cancelBookHandler}
          onConfirm={returnBookHandler}
          confirmText="Return"
          confirmColor="primary"
        >
          <form className="mb-0 space-y-6">
            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-700"
              >
                Student Number
              </label>
              <div className="mt-1">
                <input
                  ref={studentNoRef}
                  id="number"
                  name="number"
                  type="number"
                  autoComplete="current-number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="book"
                className="block text-sm font-medium text-gray-700"
              >
                Book
              </label>
              <div className="mt-1">
                <select
                  value={choseBook}
                  onChange={handleChangeChoseBook}
                  name="book"
                  id="book"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                >
                  <option value="">Please select a Book</option>
                  {booksData
                    .filter((book) => book.borrowed === true)
                    .map((book) => (
                      <option key={book.id} value={book.name}>
                        {book.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-auto rounded-lg shadow">
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
                  Category
                </th>
                <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">
                  Page
                </th>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentBooks.length > 0 &&
                search(currentBooks).map((book) => (
                  <Book
                    book={book}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    key={book.id}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={booksData.length}
        currentPage={currentPage}
        paginate={paginate}
      />

      {borrowedBooks && <BorrowedBookList books={borrowedBooks} />}
    </div>
  );
};

export default BookList;
