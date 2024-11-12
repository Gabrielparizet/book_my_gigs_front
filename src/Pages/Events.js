import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../Layout/MainLayout';
import EventCard from '../Components/EventCard';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get(
                    'http://localhost:4000/api/events/',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                // Sort events by date_and_time (closest to present to future)
                const sortedEvents = response.data.sort((a, b) => {
                    const dateA = new Date(a.date_and_time);
                    const dateB = new Date(b.date_and_time);
                    return dateA - dateB;
                });

                setEvents(sortedEvents || []);
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

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Upcoming Events
                    </h2>
                    <Link
                        to="/create-event"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Event
                    </Link>
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
                                No upcoming events found. Be the first to create one!
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
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Events;