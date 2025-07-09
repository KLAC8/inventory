"use client"

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="
        min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-12
        bg-gradient-to-r from-blue-200 via-green-200 to-teal-300
        bg-[length:200%_200%] bg-[position:0%_50%] animate-gradient-x
        text-gray-800
      "
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-sm"
      >
        Welcome to KLAC Inventory
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="mb-10 max-w-lg text-lg sm:text-xl text-gray-700 drop-shadow-sm"
      >
        Easily manage and view inventory items.
      </motion.p>

      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-300 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-md
              transition-colors duration-300 hover:bg-green-400"
          >
            Sign In to Continue
          </motion.button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <UserButton afterSignOutUrl="/" />
          <Link href="/dashboard" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 bg-green-300 text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-md
                transition-colors duration-300 hover:bg-green-400"
            >
              Go to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </SignedIn>
    </motion.main>
  );
}
