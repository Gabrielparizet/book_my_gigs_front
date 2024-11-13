import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../Layout/MainLayout';
import EventCard from '../Components/EventCard';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    
    // Filter states
    const [locations, setLocations] = useState([]);
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);
    const [locationInput, setLocationInput] = useState('');
    const [genreInput, setGenreInput] = useState('');
    const [typeInput, setTypeInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
    
            try {
                const [eventsResponse, locationsResponse, genresResponse, typesResponse] = await Promise.all([
                    axios.get('http://localhost:4000/api/events/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:4000/locations'),
                    axios.get('http://localhost:4000/genres'),
                    axios.get('http://localhost:4000/types')
                ]);

                const sortedEvents = eventsResponse.data.sort((a, b) => {
                    const dateA = new Date(a.date_and_time);
                    const dateB = new Date(b.date_and_time);
                    return dateA - dateB;
                });

                setEvents(sortedEvents || []);
                setLocations(locationsResponse.data);
                setGenres(genresResponse.data);
                setTypes(typesResponse.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const handleLocationInput = (value) => {
        setLocationInput(value);
        setShowLocationDropdown(true);
        const filtered = locations.filter(location => 
            location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLocations(filtered);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setLocationInput(location);
        setShowLocationDropdown(false);
    };

    const handleGenreInput = (value) => {
        setGenreInput(value);
        setShowGenreDropdown(true);
        const filtered = genres.filter(genre => 
            genre.toLowerCase().includes(value.toLowerCase()) &&
            !selectedGenres.includes(genre)
        );
        setFilteredGenres(filtered);
    };

    const handleGenreSelect = (genre) => {
        if (!selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
        }
        setGenreInput('');
        setShowGenreDropdown(false);
    };

    const handleRemoveGenre = (genreToRemove) => {
        setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
    };

    const handleTypeInput = (value) => {
        setTypeInput(value);
        setShowTypeDropdown(true);
        const filtered = types.filter(type => 
            type.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTypes(filtered);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setTypeInput(type);
        setShowTypeDropdown(false);
    };

    const handleFilter = async () => {
        if (!selectedLocation) {
            setError('Please select a location to filter events');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            let url = `http://localhost:4000/api/events/location/${selectedLocation}`;
            
            const queryParams = new URLSearchParams();
            if (selectedType) {
                queryParams.append('type', selectedType);
            }
            if (selectedGenres.length > 0) {
                selectedGenres.forEach(genre => {
                    queryParams.append('genres[]', genre);
                });
            }

            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setEvents(response.data);
            setIsFiltered(true);
            setError('');
            
        } catch (err) {
            setError('Failed to fetch filtered events');
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = async () => {
        setSelectedLocation('');
        setLocationInput('');
        setSelectedType('');
        setTypeInput('');
        setSelectedGenres([]);
        setGenreInput('');
        setIsFiltered(false);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/events/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEvents(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    if (!localStorage.getItem('token')) {
        return <Navigate to="/signin" />;
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-xl">Loading...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isFiltered ? 'Filtered Events' : 'Upcoming Events'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/create-event"
                            className="inline-flex justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Event
                        </Link>
                    </div>
                </div>

                <div className="mb-6 bg-white shadow sm:rounded-lg">
                    <div className="p-4 space-y-3">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Filter Events
                        </h3>
                        
                        {error && (
                            <div className="text-red-500 text-sm text-center mb-2">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location (required)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={locationInput}
                                    onChange={(e) => handleLocationInput(e.target.value)}
                                    onFocus={() => setShowLocationDropdown(true)}
                                    placeholder="Select location"
                                />
                                {showLocationDropdown && filteredLocations.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filteredLocations.map((location, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleLocationSelect(location)}
                                            >
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type (optional)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={typeInput}
                                    onChange={(e) => handleTypeInput(e.target.value)}
                                    onFocus={() => setShowTypeDropdown(true)}
                                    placeholder="Select type"
                                />
                                {showTypeDropdown && filteredTypes.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filteredTypes.map((type, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleTypeSelect(type)}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Genres (optional)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={genreInput}
                                    onChange={(e) => handleGenreInput(e.target.value)}
                                    onFocus={() => setShowGenreDropdown(true)}
                                    placeholder="Select genres"
                                />
                                {showGenreDropdown && filteredGenres.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {filteredGenres.map((genre, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleGenreSelect(genre)}
                                            >
                                                {genre}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                    {selectedGenres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
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
                        </div>

                        <div className="flex justify-end space-x-4 pt-2">
                            {isFiltered && (
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex justify-center py-1.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Back to All Events
                                </button>
                            )}
                            <button
                                onClick={handleFilter}
                                className="inline-flex justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Filter Events
                            </button>
                        </div>
                    </div>
                </div>

                {error && !events.length ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-center">{error}</p>
                            <Link 
                                to="/create-event"
                                className="inline-flex justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-gray-500 text-center text-lg">
                            {isFiltered 
                                    ? "No events found with these filters. Try adjusting your search criteria."
                                    : "No upcoming events found. Be the first to create one!"
                                }
                            </p>
                            <Link 
                                to="/create-event"
                                className="inline-flex justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Events;