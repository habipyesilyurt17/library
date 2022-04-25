import Link from "next/link";
import Image from "next/image";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";

const Login = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const [isLoading, setIsLoading] = useState(false);

  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = () => {
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    users.find((user) => {
      if (user.email === email && user.password === password) {
        router.push(`/${user.type}/${user.id}`);
        setIsLoading(true);
      }
    });
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
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
                Login to your account
              </span>
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

              <div className="flex justify-between items-baseline">
                <a
                  className="cursor-pointer mt-4 bg-indigo-500 text-white py-2 px-6 rounded-md hover:bg-indigo-600"
                  onClick={handleSubmit}
                >
                  Login
                </a>

                <Link href="/register">
                  <a className="mt-4 bg-indigo-500 text-white py-2 px-6 rounded-md hover:bg-indigo-600">
                    Register
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
