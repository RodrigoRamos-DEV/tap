import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import CardForm from './Pages/CardForm';
import AdminPanel from './components/AdminPanel';
import PublicProfile from './components/PublicProfile'; // Importe o componente
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<LoginForm />} />
        <Route path="/card-form" element={<CardForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/:slug" element={<PublicProfile />} /> {/* Rota para perfis públicos */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile/:slug" element={<CardForm editMode={true} />} />
      </Routes>
    </Router>
  );
}

export default App;