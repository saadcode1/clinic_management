import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Register from './component/Register.jsx';
import Login from './component/Login.jsx'
import Protected from './component/Protected.jsx';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/protected" element={<Protected />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
