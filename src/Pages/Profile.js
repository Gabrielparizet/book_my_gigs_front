import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false)
                return;
            }

            try {
                const response = await axios.get(`http://localhos:4000/accounts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user data')
            } finally {
                setLoading(false)
            }
        };

        fetchUserData();
    }, [id]);

    if (!localStorage.getItem('token')) {
        return <Navigate to="/signin" />
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

    if (error) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-xl text-red-500">{error}</p>
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
                <div className="mt-8 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Email
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {user.email}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    User ID
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {user.id}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Profile;