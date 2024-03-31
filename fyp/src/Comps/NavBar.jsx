import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './img/logo.png';
import "./styles/navbar.css";

function NavBar() {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('username');
        navigate('/login'); // Redirect to login page after sign out
    };

    return (
        <div className="NavBar">
            <div className="logo">
                <img src={Logo} alt="Logo" />
            </div>
            <div className="details">
                <Link to="/" className='text'>Home</Link>
                <Link to="/about" className='text'>About</Link>
                <Link to="/contact" className='text'>Contact</Link>
                {username ? (
                    <>
                        <span className='text'>Welcome, {username}</span>
                        <button onClick={handleSignOut} className='signout'>Sign Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className='text'>Register</Link>
                        <Link to="/login" className='text'>Login</Link>
                    </>
                )}
            </div>
            <div className="dropdown">
                <button className="dropbtn">Menu</button>
                <div className="dropdown-content">
                    <Link to="/" className='text'>Home</Link>
                    <Link to="/about" className='text'>About</Link>
                    <Link to="/contact" className='text'>Contact</Link>
                    {username ? (
                        <button onClick={handleSignOut} className='signout'>Sign Out</button>
                    ) : (
                        <>
                            <Link to="/register" className='text'>Register</Link>
                            <Link to="/login" className='text'>Login</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NavBar;
