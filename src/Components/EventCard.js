import React from 'react';

function EventCard({ event }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0');
        const suffix = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        
        return `${month} ${day}${getDaySuffix(day)}, ${formattedHour}:${minute}${suffix}`;
    };

    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return (
        <div className="bg-amber-50 shadow sm:rounded-lg overflow-hidden border border-amber-100">
            <div className="px-6 py-5">
                <div className="flex justify-between items-start mb-6">
                    {/* Title Section */}
                    <h3 className="text-2xl font-bold text-gray-900">
                        {event.title}
                    </h3>
                    
                    {/* Date */}
                    <span className="text-lg font-semibold text-gray-700">
                        {formatDate(event.date_and_time)}
                    </span>
                </div>

                {/* Venue and Location */}
                <div className="space-y-1 mb-6">
                    <div className="text-lg text-gray-700">
                        <span className="font-medium">Venue:</span> {event.venue}
                    </div>
                    <div className="text-lg text-gray-700">
                        <span className="font-medium">Location:</span> {event.location}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4 bg-amber-100/50 border border-amber-200 rounded-md p-4">
                    <div className="text-gray-700">
                        {event.description}
                    </div>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-600 mb-6">
                    <span className="font-medium">Address: </span>
                    {event.address}
                </div>

                {/* Bottom section with user, type, and genres */}
                <div className="flex flex-col space-y-4">
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

                    <div className="flex justify-between items-center">
                        {/* User and Type */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">User: {event.user}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700">{event.type}</span>
                        </div>

                        {/* URL if available */}
                        {event.url && (
                            <a 
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-500"
                            >
                                View Event Details →
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard;