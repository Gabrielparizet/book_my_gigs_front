import React from 'react';
import { Link } from 'react-router-dom';

function AuthHeader() {
    const accountId = localStorage.getItem('accountId');

    return (
        <header className="bg-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                    <Link to="/">Book My Gigs</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link 
                                to={`/profile/${accountId}`} 
                                className="text-white hover:text-indigo-200"
                            >
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/my-events" 
                                className="text-white hover:text-indigo-200"
                            >
                                My Events
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/events" 
                                className="text-white hover:text-indigo-200"
                            >
                                Events
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default AuthHeader;