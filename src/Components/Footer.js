import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7-xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="text-gray-300 text-sm">
                        © 2024 BookMyGigs. All rights reserved.
                    </div>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white text-sm">About</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export default Footer;