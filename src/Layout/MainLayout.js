import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">
                { children }
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;