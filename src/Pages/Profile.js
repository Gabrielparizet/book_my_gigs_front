import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';

function Profile() {
    const [account, setAccount] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [signOutMessage, setSignOutMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                // First, fetch account data
                const accountResponse = await axios.get(`http://localhost:4000/api/accounts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAccount(accountResponse.data);

                // Then, fetch user data
                const userResponse = await axios.get(`http://localhost:4000/api/accounts/${id}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (userResponse.data.error) {
                    setError('No user found for this account');
                } else {
                    setUser(userResponse.data);
                }
            } catch (err) {
                setError('No user found for this account');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(
                `http://localhost:4000/api/users/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data === "User successfully deleted") {
                setUser(null);
                setError('User successfully deleted');
            } else {
                setDeleteMessage('Something went wrong');
            }
        } catch (err) {
            setDeleteMessage('Something went wrong');
        }
        setShowDeleteModal(false);
    };

    const handleSignOut = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:4000/accounts/sign_out',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.message === "Successfully signed out") {
                localStorage.removeItem('token');
                localStorage.removeItem('accountId');
                navigate('/signin');
            } else {
                setSignOutMessage('Something went wrong');
            }
        } catch (err) {
            setSignOutMessage('Failed to sign out. Please try again.');
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
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Are you sure you want to delete this user?
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            All data related to the user {user.username} will be deleted forever.
                        </p>
                        {deleteMessage && (
                            <p className="text-red-500 text-sm mb-4">{deleteMessage}</p>
                        )}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                No, cancel deletion
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Yes, I am sure
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sign Out Confirmation Modal */}
            {showSignOutModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Are you sure you want to sign out?
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            You will need to sign in again to access your account.
                        </p>
                        {signOutMessage && (
                            <p className="text-red-500 text-sm mb-4">{signOutMessage}</p>
                        )}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowSignOutModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                No, stay signed in
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Yes, sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col justify-center w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    User Profile
                </h2>
                
                {error ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-center">{error}</p>
                            <Link 
                                to="/create-user"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create User Profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-8 bg-amber-50 shadow overflow-hidden sm:rounded-lg border border-amber-100">
                            <div className="px-4 py-5 sm:p-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                        <dt className="text-sm font-semibold text-gray-800">
                                            Email
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {account?.email}
                                        </dd>
                                    </div>

                                    {user && (
                                        <>
                                            <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    Username
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.username}
                                                </dd>
                                            </div>

                                            <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    First Name
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.first_name}
                                                </dd>
                                            </div>

                                            <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    Last Name
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.last_name}
                                                </dd>
                                            </div>

                                            <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    Location
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.location}
                                                </dd>
                                            </div>

                                            <div className="sm:col-span-1 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    Birthday
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {user.birthday}
                                                </dd>
                                            </div>

                                            <div className="sm:col-span-2 bg-white p-3 rounded-lg shadow-sm">
                                                <dt className="text-sm font-semibold text-gray-800">
                                                    Genres
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <div className="flex flex-wrap gap-2">
                                                        {Array.isArray(user.genres) ? user.genres.map((genre, index) => (
                                                            <span 
                                                                key={index}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                            >
                                                                {genre}
                                                            </span>
                                                        )) : 'No genres selected'}
                                                    </div>
                                                </dd>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="sm:col-span-2 flex justify-center mt-6 space-x-4">
                                                <Link
                                                    to={`/modify-user/${user.id}`}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Modify User
                                                </Link>
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Delete User
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <div className="mt-4 mb-2 flex justify-center">
                            <button
                                onClick={() => setShowSignOutModal(true)}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}

export default Profile;