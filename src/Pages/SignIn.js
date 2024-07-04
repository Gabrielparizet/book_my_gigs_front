import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
          const response = await axios.post('http://localhost:4000/accounts/sign_in', {
            account: {
              email,
              password
            }
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(response.data);

          // Store token and account info in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('accountId', response.data.account.id);

          navigate(`/profile/${response.data.account.id}`)
        } catch (err) {
          setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col justify-center w-full max-w-md px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:é-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:é-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rouned-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    <span className="text-gray-600">Don't have an account yet? </span>
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up here
                    </Link>
                </div>
            </div>
        </ MainLayout>
    );
}

export default SignIn;