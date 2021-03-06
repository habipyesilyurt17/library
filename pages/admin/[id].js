import Navbar from "../../components/Navbar";
import BookList from "../../components/BookList.js";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Head from "next/head";

const Admin = ({ books, students }) => {
  return (
    <>
      <Head>
        <title>B2M Library</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo-library.png" />
      </Head>
      <Navbar />
      <div className="bg-white">
        <BookList books={books} students={students} />
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const books = [];
  const students = [];
  const booksCollectionRef = collection(db, "books");
  const studentsCollectionRef = collection(db, "students");
  const queryBooks = query(booksCollectionRef, orderBy("created_at", "desc"));
  const queryStudentsBooks = query(
    studentsCollectionRef,
    orderBy("name", "desc")
  );
  const booksData = await getDocs(queryBooks);
  const studentsData = await getDocs(queryStudentsBooks);

  booksData.forEach((doc) => {
    books.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  studentsData.forEach((doc) => {
    students.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  return {
    props: {
      books,
      students,
    },
  };
};

export default Admin;
