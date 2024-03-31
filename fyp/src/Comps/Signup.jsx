import React, { useState } from "react";
import Modal from 'react-modal';
import Logo from "./img/logo.png";
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import ReCAPTCHA from "react-google-recaptcha";
import "./styles/login.css";

Modal.setAppElement('#root');

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [seen, setSeen] = useState(false);
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
        } else if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        } else if (!captchaValue) {
            setErrorMessage("Please verify that you are not a robot.");
            return false;
        }
        return true;
    };

    const handleSendVerificationCode = () => {
        fetch('http://localhost:3001/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (response.ok) {
                setModalIsOpen(true);
            } else {
                setErrorMessage('Failed to send verification code. Please try again.');
            }
        })
        .catch(() => {
            setErrorMessage('Failed to send verification code. Please try again.');
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            handleSendVerificationCode();
        }
    };

    const handleVerifyCode = () => {
        fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, verificationCode })
        })
        .then(response => {
            if (response.ok) {
                navigate("/");
            } else {
                setErrorMessage('Verification failed. Please try again or resend the code.');
                setVerificationCode('');
            }
        })
        .catch(() => {
            setErrorMessage('Verification failed. Please try again or resend the code.');
            setVerificationCode('');
        });
    };

    const handleClick = () => {
        setSeen(!seen);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        navigate("/");
    };

    const handleGoogleFailure = () => {
        setErrorMessage('Google Sign in was unsuccessful');
        navigate("/signup");
    };

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    return (
        <GoogleOAuthProvider clientId="618950444509-njscq7p1jq7a0e4mihfcfeuu9esvhpu5.apps.googleusercontent.com">
            <main className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    <img className="mb-4" src={Logo} alt="" width="72" height="57" />
                    <h1 className="h3 mb-3 fw-normal">Welcome to the family! Create your account now</h1>

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
                            type={seen ? "text" : "password"}
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingPassword">Password</label>
                        <span className="eyes" onClick={handleClick}>{seen ? <VisibilityIcon /> : <VisibilityOffIcon />}</span>
                    </div>

                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>

                    <ReCAPTCHA
                        sitekey="site_key"
                        onChange={onCaptchaChange}
                    />

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button className="btn btn-lg btn-primary" type="submit">Sign up</button>

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn google-btn">
                                <GoogleIcon /> Sign up Using Google
                            </button>
                        )}
                    />

                    <p className="mt-5 mb-3 text-muted">© 2024</p>
                </form>
            </main>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Verification Code"
            >
                <div className="vercode">
                    <h2>Enter Verification Code</h2>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Verification Code"
                        required
                    />
                    <div>
                        <button onClick={handleVerifyCode}>Verify</button>
                        <button onClick={handleSendVerificationCode}>Resend Code</button>
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            </Modal>
        </GoogleOAuthProvider>
    );
}

export default Signup;
