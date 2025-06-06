"use client"

import { useAuth } from "@/lib/auth/simple-auth-context"

const Navbar = () => {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="text-white text-lg font-bold">
          My App
        </a>
        <div>
          {user ? (
            <>
              <span className="text-gray-300 mr-4">Welcome, {user.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Login
              </a>
              <a href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
