import React from 'react';
import Header from '../Components/Header';
import AuthHeader from '../Components/AuthHeader';
import Footer from '../Components/Footer';

function MainLayout({ children }) {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <div className="flex flex-col min-h-screen">
            {isAuthenticated ? <AuthHeader /> : <Header />}
            <main className="flex-grow bg-gray-50 flex items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;