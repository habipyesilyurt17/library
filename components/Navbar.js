import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdMenu, IoIosClose, IoIosLogOut } from "react-icons/io";

const Navbar = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const toggleButton = (e) => {
    setIsOpen(!isOpen);
    let list = document.querySelector("ul");
    !isOpen
      ? ((e.name = "close"),
        list.classList.add("top-[80px]"),
        list.classList.add("opacity-100"))
      : ((e.name = "menu"),
        list.classList.remove("top-[80px]"),
        list.classList.remove("opacity-100"));
  };

  return (
    <>
      <nav className="p-5 bg-white shadow md:flex md:items-center md:justify-between w-full border-b-2">
        <div className="flex justify-between items-center">
          <div
            className="flex justify-between items-center"
            onClick={() => router.back()}
          >
            <span className="text-2xl font-[Poppins] cursor-pointer flex justify-between items-center">
              <Image
                className="inline"
                src="/logo-library.png"
                height={40}
                width={40}
              />
            </span>
            <h1 className="font-bold text-xl cursor-pointer pl-1 mt-2">
              <span className="text-blue-500">B2M</span>Library
            </h1>
          </div>
          <span
            className="text-3xl cursor-pointer mx-2 md:hidden block"
            onClick={toggleButton}
          >
            {!isOpen ? (
              <IoMdMenu size={40} className="menu" />
            ) : (
              <IoIosClose size={40} className="close" />
            )}
          </span>
        </div>

        <ul className="md:flex md:items-center z-[-1] md:z-auto md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500">
          <li className="my-6 md:my-0">
            <Link href="/">
              <a
                className="text-xl hover:text-blue-500 duration-500"
                // onClick={() => router.push("/")}
              >
                <IoIosLogOut size={30} title="Logout" />
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
