import React from 'react';
import PublicLayout from '../Layout/PublicLayout';

function Home() {
    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome to Book My Gigs</h2>
            </div>
        </PublicLayout>
    );
}

export default Home;