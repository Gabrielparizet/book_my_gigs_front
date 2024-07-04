import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                    <Link to="/">Book My Gigs</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/signin" className="text-white hover:text-indigo-200">Sign In</Link>
                        </li>
                        <li>
                            <Link to="/register" className="text-white hover:text-indigo-200">Register</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;