import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../Layout/MainLayout';

function CreateEvent() {
    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('Club'); // Default value
    
    // Address fields
    const [streetNumber, setStreetNumber] = useState('');
    const [streetName, setStreetName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    // Location and genres states (similar to CreateUser)
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

    // Modal and error states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState('');

    const [userId, setUserId] = useState(null);
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

    useEffect(() => {
        const fetchUser = async () => {
            if (!token || !accountId) return;
    
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/accounts/${accountId}/users`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (!response.data.error) {
                    setUserId(response.data.id);
                } else {
                    setError('No user found for this account');
                }
            } catch (err) {
                setError('Failed to fetch user information');
            }
        };
    
        fetchUser();
    }, [token, accountId]);

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

        // Date format validation
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
        if (!dateRegex.test(date)) {
            setError('Please enter date in DD/MM/YYYY format');
            return;
        }

        // Time format validation
        const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            setError('Please enter time in HH:MM format');
            return;
        }

        // Other validations
        if (!selectedLocation) {
            setError('Please select a location');
            return;
        }
        if (selectedGenres.length === 0) {
            setError('Please select at least one genre');
            return;
        }

        // Show confirmation modal
        setShowCreateModal(true);
    };

    const handleCreate = async () => {
        if (!userId) {
            setError('User information not found');
            return;
        }

        try {
            // Construct address string
            const address = `${streetNumber} ${streetName}, ${postalCode} ${city}, ${country}`;

            await axios.post(
                `http://localhost:4000/api/users/${userId}/events`, // Now using the correct user ID
                {
                    event: {
                        date_and_time: {
                            date,
                            time
                        },
                        venue,
                        title,
                        description,
                        address,
                        url,
                        location: selectedLocation,
                        type,
                        genres: selectedGenres
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/my-events');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event');
            setShowCreateModal(false);
        }
    };

    return (
        <MainLayout>
            {/* Create Confirmation Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Create New Event
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to create this event?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col justify-center w-full max-w-2xl px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create New Event
                </h2>

                <div className="mt-8 bg-white shadow sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date (DD/MM/YYYY)
                                </label>
                                <input
                                    type="text"
                                    id="date"
                                    required
                                    placeholder="DD/MM/YYYY"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                    Time (HH:MM)
                                </label>
                                <input
                                    type="text"
                                    id="time"
                                    required
                                    placeholder="HH:MM"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Venue */}
                        <div>
                            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                                Venue
                            </label>
                            <input
                                type="text"
                                id="venue"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                            />
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Address</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">
                                        Street Number
                                    </label>
                                    <input
                                        type="text"
                                        id="streetNumber"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={streetNumber}
                                        onChange={(e) => setStreetNumber(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">
                                        Street Name
                                    </label>
                                    <input
                                        type="text"
                                        id="streetName"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={streetName}
                                        onChange={(e) => setStreetName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>
                            </div>
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

                        {/* Type Selection */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Event Type
                            </label>
                            <select
                                id="type"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="Club">Club</option>
                                <option value="Concert">Concert</option>
                                <option value="Festival">Festival</option>
                            </select>
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

                        {/* URL */}
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                Event URL
                            </label>
                            <input
                                type="url"
                                id="url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

export default CreateEvent;