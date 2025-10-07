"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between bg-gradient-to-b from-green-50 to-white px-8 md:px-16 py-12 overflow-hidden">
      {/* Left Content */}
      <div className="flex-1 text-center md:text-left z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/DentServeLogo.png" // <-- Replace with your logo file path
            alt="DentServe Dental Clinic Logo"
            width={220}
            height={220}
            className="mx-auto md:mx-0 drop-shadow-md"
          />
        </motion.div>

        {/* Clinic Name and Tagline */}
        <motion.h1
          className="mt-6 text-5xl md:text-6xl font-extrabold text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Smile, <span className="text-green-600">Our Priority</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          General Dentistry • Cosmetic Dentistry • Orthodontics • Oral Surgery
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            href="#appointments"
            className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-8"
          >
            Book Appointment
          </Link>
          <Link
            href="#about"
            className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Clinic Info */}
        <motion.div
          className="mt-10 text-sm text-gray-500 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="font-semibold text-gray-700">
            📍 Unit 108 LSS Building, General Tirona Highway, Habay 2, Bacoor,
            Cavite
          </p>
          <p>🕘 Monday – Saturday | 9:00 AM – 6:00 PM</p>
          <p>📞 Globe: 0956 535 6303 | Smart: 0918 646 0764</p>
          <p>✉️ dentserve.ph@gmail.com</p>
        </motion.div>
      </div>

      {/* Right Side – QR + Clinic Image */}
      <motion.div
        className="flex-1 flex flex-col items-center md:items-end justify-center mt-12 md:mt-0 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
          <Image
            src="/dentserve-qr.png" // <-- Add your QR image here
            alt="DentServe QR Code"
            width={180}
            height={180}
          />
          <p className="mt-3 text-sm text-gray-600 text-center font-medium">
            Scan to locate us!
          </p>
        </div>

        <div className="mt-10">
          <Image
            src="/dentserve-clinic.jpg" // <-- Replace with your clinic photo
            alt="DentServe Clinic Front"
            width={380}
            height={220}
            className="rounded-2xl shadow-lg border border-gray-100"
          />
        </div>
      </motion.div>

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/10 via-green-100/10 to-transparent pointer-events-none"></div>
    </section>
  );
}
