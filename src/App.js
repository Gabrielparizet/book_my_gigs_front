import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Register from './Pages/Register';
import SignIn from './Pages/SignIn';
import Profile from './Pages/Profile';
import CreateUser from './Pages/CreateUser'
import ModifyUser from './Pages/ModifyUser';
import MyEvents from './Pages/MyEvents';
import CreateEvent from './Pages/CreateEvent';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/modify-user/:id" element={<ModifyUser />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
    </Router>
  );
}

export default App;
