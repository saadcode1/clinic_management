import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const Protected = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div>Please log in to access this page.</div>;
    }

    return <div>Welcome, {user.name}! You have access to this protected page.</div>;
};

export default Protected;
