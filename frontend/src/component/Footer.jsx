import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/icon.png";

function Footer() {
    return (
        <footer className="mt-10 bg-gradient-to-tl from-[#6441a5] to-[#2a0845] text-white py-8 rounded-t-3xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 text-center md:text-left">

                {/* Logo / Brand */}
                <div className=''>
                    <Link to="/" className="flex gap-3 items-center">
                        <img src={logo} alt="./vite.svg" className="md:w-14 w-9" />
                        <span className="text-white text-2xl font-bold dark:text-white dark:bg-none">
                            PlayBeatz
                        </span>

                    </Link>
                    <p className="text-sm text-left mt-2 text-gray-300">
                        Your World, Your Playlist, Playbeatz.
                    </p>
                </div>

                {/* Copyright */}
                <div>
                    <p className="text-sm text-gray-300">© {new Date().getFullYear()} Playbeatz</p>
                </div>

            </div>
        </footer>
    )
}

export default Footer
