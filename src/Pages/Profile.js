import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate, Link } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';

function Profile() {
    const [account, setAccount] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

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
            <div className="flex flex-col justify-center w-full max-w-md px-4 sm:px-6 lg:px-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    User Profile
                </h2>
                
                {error ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="p-6 flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-center">No user found for this account, create one:</p>
                            <Link 
                                to="/create-user"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create User Profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{account?.email}</dd>
                                </div>
                                
                                {user && (
                                    <>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Username</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                                        </div>
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.first_name}</dd>
                                        </div>
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.last_name}</dd>
                                        </div>
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.location}</dd>
                                        </div>
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Genres</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.genres}</dd>
                                        </div>
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Birthday</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.birthday}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Profile;