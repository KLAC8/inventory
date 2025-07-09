"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-12
        bg-gradient-to-r from-blue-200 via-green-200 to-teal-300 text-gray-800 overflow-hidden"
    >
      {/* Left side background logo */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 z-0">
        <img
          src="/favicon.png"
          alt="Background Logo"
          className="w-72 sm:w-96 lg:w-[28rem] object-contain mix-blend-multiply"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="z-10 bg-white/40 dark:bg-black/40 backdrop-blur-lg px-8 py-10 rounded-xl shadow-lg max-w-xl w-full"
      >
        <h1 className="text-xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to KLAC Inventory
        </h1>

        <p className="mb-8 text-lg sm:text-lg text-gray-700 dark:text-gray-200">
          Easily manage and view your organization’s inventory items.
        </p>

        <SignedOut>
          <SignInButton mode="modal">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              Sign In to Continue
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center gap-4 mt-6">
            <UserButton afterSignOutUrl="/" />
            <Link href="/dashboard" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        </SignedIn>
      </motion.div>
    </motion.main>
  );
}
