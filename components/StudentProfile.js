import { useState } from "react";
import BorrowedBookList from "./BorrowedBookList";
import Image from "next/image";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { db } from "../firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";

const StudentProfile = ({ student }) => {
  const [studentData, setStudentData] = useState(student);
  const [updating, setUpdating] = useState(false);
  const [nameInput, setNameInput] = useState();
  const [surnameInput, setSurnameInput] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const modalCancelHandler = () => {
    setUpdating(false);
  };

  const handleChangeName = (e) => {
    setNameInput(e.target.value);
  };

  const handleChangeSurname = (e) => {
    setSurnameInput(e.target.value);
  };

  const onUpdate = () => {
    setUpdating(true);
    setNameInput(studentData.name);
    setSurnameInput(studentData.surname);
  };

  const updateStudentHandler = async () => {
    setUpdating(false);
    setIsLoading(true);
    const updatedStudent = {
      ...studentData,
      ...{
        name: nameInput,
        surname: surnameInput,
      },
    };

    const updatedStudentDoc = doc(db, "students", updatedStudent.id);
    await updateDoc(updatedStudentDoc, updatedStudent)
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        console.log("error----", error);
      });
  };

  const fetchData = async () => {
    const studentDocRef = doc(db, "students", `${student.id}`);
    const studentDoc = await getDoc(studentDocRef);

    if (studentDoc.exists()) {
      setStudentData(studentDoc.data());
    } else {
      console.log("No such document!");
    }
    setUpdating(false);
    setIsLoading(false);
  };

  return (
    <>
      {updating && (
        <Modal
          title="Update Student"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={updateStudentHandler}
          confirmText="Update"
          confirmColor="primary"
        >
          <form className="mb-0 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  value={nameInput}
                  onChange={(e) => handleChangeName(e)}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="current-name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-gray-700"
              >
                Surname
              </label>
              <div className="mt-1">
                <input
                  value={surnameInput}
                  onChange={(e) => handleChangeSurname(e)}
                  id="surname"
                  name="surname"
                  type="text"
                  autoComplete="current-surname"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500;"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white flex justify-between flex-wrap w-full h-screen p-5 md:mt-4">
          <div className="rounded-lg shadow-2xl h-2/5">
            <div className="relative bg-white w-72 before:absolute before:w-full before:h-2/5 before:bg-violet-500">
              <div className="flex flex-col items-center p-6 relative">
                <div className="">
                  <Image
                    src="/profile.jpg"
                    alt=""
                    width={130}
                    height={130}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col items-center text-gray-400 mt-3 ">
                  <span className="text-xl font-semibold">
                    {studentData.name} {studentData.surname}
                  </span>
                  <span className="text-base font-medium">
                    {studentData.student_no}
                  </span>
                </div>
                <div className="mt-3 w-full">
                  <button
                    onClick={() => {
                      onUpdate();
                    }}
                    className="cursor-pointer rounded-2xl border w-full py-2 px-4 bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <BorrowedBookList books={student.books} />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProfile;
