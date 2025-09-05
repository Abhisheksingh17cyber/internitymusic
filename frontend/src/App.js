import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Music from './pages/Music';
import Payment from './pages/Payment';
import Footer from './components/Footer';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/music" element={<Music />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="/payment" element={user ? <Payment /> : <Login />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
