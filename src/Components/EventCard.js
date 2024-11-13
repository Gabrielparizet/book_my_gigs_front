import React from 'react';

function EventCard({ event }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0');
        const suffix = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        
        return `${month} ${day}${getDaySuffix(day)}, ${year}, ${formattedHour}:${minute}${suffix}`;
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
        <div className="bg-zinc-50 shadow sm:rounded-lg overflow-hidden border border-zinc-100">
            <div className="px-6 py-5">
                <div className="flex justify-between items-start mb-8">
                    {/* Title Section */}
                    <h3 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                        {event.title}
                    </h3>
                    
                    {/* Date */}
                    <span className="text-lg font-medium text-zinc-700 bg-zinc-100 px-4 py-2 rounded-lg shadow-sm">
                        {formatDate(event.date_and_time)}
                    </span>
                </div>

                {/* Venue and Location on same line */}
                <div className="mb-2">
                    <div className="text-lg text-zinc-700">
                        <span className="font-medium">{event.venue}</span>
                        <span className="mx-2">•</span>
                        <button 
                            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                            onClick={() => {/* Add location click handler here */}}
                        >
                            {event.location}
                        </button>
                    </div>
                </div>

                {/* URL under venue/location */}
                {event.url && (
                    <div className="mb-6">
                        <a 
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-800 underline hover:text-zinc-400"
                        >
                            {event.url}
                        </a>
                    </div>
                )}

                {/* Description */}
                <div className="mb-4 bg-zinc-100/50 border border-zinc-200 rounded-md p-4">
                    <div className="text-xs text-zinc-700 leading-relaxed">
                        {event.description}
                    </div>
                </div>


                {/* Address with bolder label */}
                <div className="text-sm text-zinc-600 mb-6">
                    <span className="font-semibold">Address: </span>
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
                        {/* User */}
                        <div className="flex items-center gap-2">
                            <button 
                                className="text-indigo-600 hover:text-indigo-500 text-sm hover:underline"
                                onClick={() => {/* Add user click handler here */}}
                            >
                                {event.user}
                            </button>
                            <span className="text-zinc-400"></span>
                        </div>
                        {/* Type */}
                        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-medium bg-indigo-800 text-indigo-100">
                            {event.type}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventCard;