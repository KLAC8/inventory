/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-20 -left-10 w-96 h-96 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-20 -right-10 w-80 h-80 bg-gradient-to-r from-cyan-300 to-turquoise-300 rounded-full blur-3xl"
        />
      </div>

      {/* Logo watermark */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.05, x: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 pointer-events-none z-0"
      >
        <img
          src="/favicon.png"
          alt="Background Logo"
          className="w-64 sm:w-80 lg:w-96 object-contain"
        />
      </motion.div>

      {/* Main content container */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2, 
            ease: [0.25, 0.25, 0.25, 0.75] 
          }}
          className="w-full max-w-md mx-auto"
        >
          {/* Glass card */}
          <div className="relative group">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Main card */}
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
              {/* Header section */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                    KLAC Inventory
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto mb-6" />
                </motion.div>
              </div>

              {/* Authentication section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-6"
              >
                <SignedOut>
                  <div className="text-center">
                    <SignInButton mode="modal">
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 text-lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Sign In to Continue
                        </span>
                      </motion.button>
                    </SignInButton>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="space-y-4">
                    {/* User section */}
                    <div className="flex justify-center">
                      <div className="p-2 bg-white/50 rounded-full shadow-md">
                        <UserButton 
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: "w-12 h-12"
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Dashboard button */}
                    <Link href="/dashboard" className="block">
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px -12px rgba(6, 182, 212, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 text-lg"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Enter Dashboard
                        </span>
                      </motion.button>
                    </Link>
                  </div>
                </SignedIn>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-8 pt-6 border-t border-slate-200"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg mx-auto flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-slate-600">Fast</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg mx-auto flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-slate-600">Reliable</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg mx-auto flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-slate-600">Mobile</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}