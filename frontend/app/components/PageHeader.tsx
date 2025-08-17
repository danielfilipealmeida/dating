import { H1 } from "./Headers";
import Button from "./Button";
import { logout } from "../actions";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function PageHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="shadow sticky top-0 w-full bg-gray-50 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6 items-center flex justify-between">
        <H1>Dating App</H1>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>

          {isOpen && (
            <nav className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
              <Link
                href="#"
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
              >
                Logout
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
