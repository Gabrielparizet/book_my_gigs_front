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

        }
    })
}