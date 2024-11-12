import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../Layout/MainLayout';

function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            const accountId = localStorage.getItem('accountId');
            
            if (!token || !accountId) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
    
            try {
                // First get the user ID
                const userResponse = await axios.get(
                    `http://localhost:4000/api/accounts/${accountId}/users`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
    
                if (userResponse.data.error) {
                    setError('No user found for this account');
                    setLoading(false);
                    return;
                }
    
                const userId = userResponse.data.id;
    
                // Then fetch events with the correct user ID
                const eventsResponse = await axios.get(
                    `http://localhost:4000/api/users/${userId}/events`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setEvents(eventsResponse.data || []);
                setError('');
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
    
        fetchEvents();
    }, []);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        My Events
                    </h2>
                    {events.length > 0 && !error && (
                        <Link
                            to="/create-event"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Event
                        </Link>
                    )}
                </div>

                {error ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-center">{error}</p>
                            <Link 
                                to="/create-event"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-gray-500 text-center text-lg">
                                You haven't created any events yet. Share your first event with the community!
                            </p>
                            <Link 
                                to="/create-event"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {events.map((event) => (
                            <div 
                                key={event.id}
                                className="bg-white shadow sm:rounded-lg overflow-hidden"
                            >
                                <div className="px-4 py-5 sm:p-6">
                                    {/* Title Section */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {event.title}
                                    </h3>

                                    {/* Event Meta Information */}
                                    <div className="flex flex-wrap gap-4 mb-4 text-lg text-gray-700">
                                        <span className="font-semibold">{formatDate(event.date_and_time)}</span>
                                        <span>•</span>
                                        <span className="font-semibold">{event.venue}</span>
                                        <span>•</span>
                                        <span className="font-semibold">{event.location}</span>
                                    </div>

                                    {/* User and Type */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-gray-500">Posted by</span>
                                        <span className="font-medium text-indigo-600">{event.user}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">{event.type}</span>
                                    </div>

                                    {/* Address */}
                                    <div className="text-gray-600 mb-4">
                                        {event.address}
                                    </div>

                                    {/* Description */}
                                    <div className="text-gray-600 mb-4">
                                        {event.description}
                                    </div>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-2">
                                        {event.genres.map((genre, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>

                                    {/* URL if available */}
                                    {event.url && (
                                        <div className="mt-4">
                                            <a 
                                                href={event.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                View Event Details →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default MyEvents;