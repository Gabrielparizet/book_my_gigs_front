import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../Layout/MainLayout';

function CreateUser() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [error, setError] = useState('');
    
    // New states for location and genres
    const [locations, setLocations] = useState([]);
    const [genres, setGenres] = useState([]);
    const [locationInput, setLocationInput] = useState('');
    const [genreInput, setGenreInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const accountId = localStorage.getItem('accountId');

    // Fetch locations and genres on component mount
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            try {
                const [locationsResponse, genresResponse] = await Promise.all([
                    axios.get('http://localhost:4000/locations'),
                    axios.get('http://localhost:4000/genres')
                ]);

                setLocations(locationsResponse.data);
                setGenres(genresResponse.data);
            } catch (err) {
                setError('Failed to fetch locations and genres');
            }
        };

        fetchData();
    }, [token]);

    if (!token) {
        return <Navigate to="/signin" />;
    }

    // Handle location input changes
    const handleLocationInput = (value) => {
        setLocationInput(value);
        setShowLocationDropdown(true);
        const filtered = locations.filter(location => 
            location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLocations(filtered);
    };

    // Handle location selection
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setLocationInput(location);
        setShowLocationDropdown(false);
    };

    // Handle genre input changes
    const handleGenreInput = (value) => {
        setGenreInput(value);
        setShowGenreDropdown(true);
        const filtered = genres.filter(genre => 
            genre.toLowerCase().includes(value.toLowerCase()) &&
            !selectedGenres.includes(genre)
        );
        setFilteredGenres(filtered);
    };

    // Handle genre selection
    const handleGenreSelect = (genre) => {
        if (!selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
        }
        setGenreInput('');
        setShowGenreDropdown(false);
    };

    // Remove genre from selection
    const handleRemoveGenre = (genreToRemove) => {
        setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Birthday format validation
        const birthdayRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
        if (!birthdayRegex.test(birthday)) {
            setError('Please enter birthday in DD/MM/YYYY format');
            return;
        }

        // Validate location and genres
        if (!selectedLocation) {
            setError('Please select a location');
            return;
        }
        if (selectedGenres.length === 0) {
            setError('Please select at least one genre');
            return;
        }

        try {
            // Create user
            const userResponse = await axios.post(
                'http://localhost:4000/api/users',
                {
                    user: {
                        username,
                        first_name: firstName,
                        last_name: lastName,
                        birthday
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const userId = userResponse.data.id;

            // Add location
            await axios.put(
                `http://localhost:4000/api/users/${userId}/locations`,
                { location: selectedLocation },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Add genres
            await axios.put(
                `http://localhost:4000/api/users/${userId}/genres`,
                { genres: selectedGenres },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Redirect to profile page on success
            navigate(`/profile/${accountId}`);
        } catch (err) {
            setError('Failed to create user. Please try again.');
        }
    };

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <MainLayout>
            <div className="flex flex-col justify-center w-full max-w-md px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create User Profile
                </h2>

                <div className="mt-8 bg-white shadow sm:rounded-lg">
                    {error ? (
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-center">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                                    Birthday (DD/MM/YYYY)
                                </label>
                                <input
                                    type="text"
                                    id="birthday"
                                    required
                                    placeholder="DD/MM/YYYY"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                />
                            </div>

                            {/* Location field with autocomplete */}
                            <div className="relative">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={locationInput}
                                    onChange={(e) => handleLocationInput(e.target.value)}
                                    onFocus={() => setShowLocationDropdown(true)}
                                />
                                {showLocationDropdown && filteredLocations.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filteredLocations.map((location, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleLocationSelect(location)}
                                            >
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Genres field with autocomplete and multiple selection */}
                            <div className="relative">
                                <label htmlFor="genres" className="block text-sm font-medium text-gray-700">
                                    Genres
                                </label>
                                <input
                                    type="text"
                                    id="genres"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={genreInput}
                                    onChange={(e) => handleGenreInput(e.target.value)}
                                    onFocus={() => setShowGenreDropdown(true)}
                                />
                                {showGenreDropdown && filteredGenres.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filteredGenres.map((genre, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleGenreSelect(genre)}
                                            >
                                                {genre}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Selected genres display */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedGenres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                        >
                                            {genre}
                                            <button
                                                type="button"
                                                className="ml-1 inline-flex text-indigo-400 hover:text-indigo-600"
                                                onClick={() => handleRemoveGenre(genre)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Profile
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default CreateUser;