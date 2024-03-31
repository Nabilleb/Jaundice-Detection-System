import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Comps/NavBar';
import HomePage from './Comps/HomePage';
import Footer from './Comps/Footer';
import Login from './Comps/Login';
import Signup from './Comps/Signup';
import Contact from './Comps/Contact';
import About from './Comps/About';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
