import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Register from './component/Register.jsx';
import Login from './component/Login.jsx';
import Protected from './component/Protected.jsx';
import DoctorPage from './component/DoctorPage.jsx';
import Appointment from './component/Appointment.jsx';
import YourAppointments from './component/YourAppointments.jsx';
import Click from './component/Click.jsx';

const App = () => {
    const [checkToken, setCheckToken] = React.useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        setCheckToken(token);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    {checkToken && <Route path="/doctorsList" element={<DoctorPage />} />}
                    {checkToken && <Route path="/Appointment/:id" element={<Appointment />} />}
                    <Route path="/protected" element={<Protected />} />
                    <Route path="/appointments/:id" element={<YourAppointments/>}/>
                    
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
