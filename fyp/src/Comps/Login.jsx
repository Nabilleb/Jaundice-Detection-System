import React, { useState } from "react";
import Logo from "./img/logo.png";
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./styles/login.css";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [seen, setSeen] = useState(false)
    const navigate = useNavigate(); 
    const validateForm = () => {
        const emailRegex = /\S+@\S+\.\S+/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return false;
        } else if (!passwordRegex.test(password)) {
            setErrorMessage('Password must be at least 8 characters long and include letters, numbers, and symbols.');
            return false;
        }
        else{
          setErrorMessage('logged in successfully');
          return true;

         }
       
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      if (validateForm()) {
          fetch('http://localhost:3001/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
          })
          .then(response => {
              if (response.ok) {
                  // Extract the username part from the email
                  const username = email.split('@')[0];
                  console.log(username)
                  localStorage.setItem('username', username);
                  navigate("/")
              } else {
                  throw new Error('Signup failed');
              }
          })
          .catch((error) => {
              console.error('Error:', error);
              setErrorMessage('Failed to register. Please try again.');
          });
      }
  };
  const handleClick = () =>{
    setSeen(!seen)
  }
    return (
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleSubmit}>
                <img className="mb-4" src={Logo} alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Log in to your account to use our system</h1>

                <div className="form-floating">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingInput">Email address</label>
                  
                </div>
                <div className="form-floating">
                
                    <input
                        type= {seen ? "text":"password"}
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                     <span className="eyes" onClick={handleClick}>{seen ? <VisibilityIcon />: <VisibilityOffIcon />}</span>
                </div>
                
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                
                <button className="btn btn-primary py-2" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-body-secondary">©2024</p>
            </form>
        </main>
    );
}

export default Signup;
