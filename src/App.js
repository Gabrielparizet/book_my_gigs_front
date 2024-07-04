import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register'
import SignIn from './Pages/SignIn';
import Header from './Components/Header';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Book My Gigs</h2>
      </div>
    </div>
  )
}
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
