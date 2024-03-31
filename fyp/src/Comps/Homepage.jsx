import React from "react";
import Card from "./Cards";
import CheckIcon from '@mui/icons-material/Check';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";

function HomePage() {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleRunMain = async () => {
        if (!username) {
            console.log("User not logged in, redirecting to login page.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/run-main', {
                method: 'POST',
            });
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const messageData = {
            firstName: formData.get('fname'),
            lastName: formData.get('lname'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        for (let key in messageData) {
            if (messageData[key].trim() === '') {
                alert(`${key} cannot be empty`);
                return;
            }
        }

        if (!/\S+@\S+\.\S+/.test(messageData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!username){
            console.log("Log in to use");
            navigate("/login");
            return;
        }

        fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleSignOut = () => {
        localStorage.removeItem('username');
        navigate("/login");
    };

    return (
        <div className="homepage">
            <div className="cont">
                <div className="subcont">
                    <h1>Jaundice Detection System</h1>
                    <p>Jaundice is a condition marked by yellowing of the skin and eyes, signaling potential liver issues. It's important to address symptoms early for effective management. To use the system to check for jaundice, click Use System.</p>
                    <button onClick={handleRunMain}>Use System</button>
                    {username && (
                        <div style={{"paddingTop":"20px"}} className="fit">
                            <div>Welcome, {username.split('@')[0]}</div>
                            <button onClick={handleSignOut}>Sign out</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="feature-section">
                <Card icon={<CheckIcon />} text="Accurate" content="Our system boasts a high accuracy rate, thanks to the advanced XGBoost model that powers our predictive analytics." />
                <Card icon={<MedicalServicesIcon />} text="Medical" content="Our system offers a high accuracy rate for medical diagnoses, utilizing the sophisticated XGBoost model to ensure reliable and precise health assessments." />
                <Card icon={<SettingsSuggestIcon />} text="System" content="Our system is user-friendly and offers a high accuracy rate for medical diagnoses, utilizing the sophisticated XGBoost model to ensure reliable and precise health assessments." />
            </div>
            <div className="form">
                <div className="form1">
                    <h2>Message Us</h2>
                    <form onSubmit={handleFormSubmit}>
                        <Input placeholder="Your First Name" label="First Name" htmlFor="fname" name="fname" />
                        <Input placeholder="Your Last Name" label="Last Name" htmlFor="lname" name="lname" />
                        { username ? (
                          <div className="input">
                            <label htmlFor="email">Email</label>
                            <input type="text" value={`${username}@gmail.com`} label="email" name="email" className="inpts" readOnly />
                          </div>
                        ) : (
                          <Input placeholder="Your Email" label="Email" htmlFor="email" name="email" />
                        )}
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" cols="20" rows="7" placeholder="Your Message" required ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
