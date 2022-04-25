import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "../components/Spinner";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const studentsCollectionRef = collection(db, "students");
  const usersCollectionRef = collection(db, "users");

  const nameInput = useRef(null);
  const surnameInput = useRef(null);
  const numberInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const signUp = async () => {
    setIsLoading(true);

    const name = nameInput.current.value;
    const surname = surnameInput.current.value;
    const student_no = numberInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    const studentObject = {
      name,
      surname,
      email,
      password,
      student_no,
      books: [],
    };
    const userObject = { email, password, type: "student" };
    await addDoc(studentsCollectionRef, studentObject);
    await addDoc(usersCollectionRef, userObject);
    router.push("/");
  };
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="h-screen flex justify-center items-center">
          <div className="relative py-3 sm:w-96 max-auth text-center">
            <div className="mt-4 bg-white shadow-2xl rounded-lg text-left">
              <div className="h-2 bg-indigo-400 rounded-t-md"></div>
              <div className="px-8 py-6">
                <div className="flex justify-center items-center mb-2">
                  <span className="text-2xl font-[Poppins] flex justify-between items-center">
                    <Image
                      className="inline"
                      src="/logo-library.png"
                      height={40}
                      width={40}
                    />
                  </span>
                  <h1 className="font-bold text-xl pl-1 mt-2">
                    <span className="text-blue-500">B2M</span>Library
                  </h1>
                </div>
                <span className="flex justify-center font-semibold text-2xl mb-2">
                  Register to Library
                </span>
                <label className="block font-semibold">Name</label>
                <input
                  ref={nameInput}
                  type="text"
                  placeholder="Name"
                  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-md"
                />
                <label className="block font-semibold">Surname</label>
                <input
                  ref={surnameInput}
                  type="text"
                  placeholder="Surname"
                  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-md"
                />
                <label className="block font-semibold">Number</label>
                <input
                  ref={numberInput}
                  type="number"
                  placeholder="Number"
                  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-md"
                />
                <label className="block font-semibold">Email</label>
                <input
                  ref={emailInput}
                  type="email"
                  placeholder="Email"
                  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-md"
                />

                <label className="block mt-3 font-semibold">Password</label>
                <input
                  ref={passwordInput}
                  type="password"
                  placeholder="Password"
                  className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded-md"
                />

                <div className="flex justify-between">
                  <a
                    className="cursor-pointer mt-4 w-full text-center bg-indigo-500 text-white py-2 px-6 rounded-md hover:bg-indigo-600"
                    onClick={signUp}
                  >
                    Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
