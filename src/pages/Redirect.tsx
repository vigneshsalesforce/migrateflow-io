import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { BACKEND_URL } from './../config/apiConstants';

const Redirect = ({ type }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const handleCode = async () => {
            // Get the code from URL search params
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            console.log('type:', type);
            if (!code) {
                setError('No authorization code found');
                return;
            }

            if (!type) {
                setError('Integration type is missing.');
                return;
            }

            try {
                if (type === 'salesforce' || type === 'sharepoint') {
                    const response = await api(`${BACKEND_URL}/auth/token`, 'post', {}, { code, provider: type });
                    if (response.success) {
                        // ...removed localStorage usage...
                        navigate('/connections');
                    }
                } else {
                    setError('Unknown integration type');
                    navigate('/connections');
                    return;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        };

        handleCode();
    }, [location, navigate, type]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div>Processing...</div>;
};

export default Redirect;