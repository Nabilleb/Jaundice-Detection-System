import React from 'react';
import './styles/about.css';

function About() {
    return (
        <div className="about-page">
            <section className="team-section">
                <img src="https://tse3.mm.bing.net/th?id=OIP.XK4Hq42jETCErQtEwde4DQHaE6&pid=Api&P=0&h=220" alt="Team" />
                <div className="team-description">
                    <h2>About Us</h2>
                    <p>This website and system were created by Nabil Alakhdar and Mostafa Hareb. We aimed to develop a solution that addresses the challenges in detecting and managing jaundice effectively.</p>
                </div>
            </section>

            <section className="jaundice-info-section">
                <img src="https://tse2.mm.bing.net/th?id=OIP.uc7lem-Zj_chzzoZEr6lDQAAAA&pid=Api&P=0&h=220" alt="Jaundice Information" />
                <div className="jaundice-description">
                    <h2>About Jaundice</h2>
                    <p>Jaundice is a medical condition characterized by the yellowing of the skin and eyes due to high bilirubin levels. Our system plays a crucial role in the early detection and management of jaundice, providing timely and accurate diagnosis.</p>
                </div>
            </section>

            <section className="testimonials-section">
                <h2>What People Are Saying</h2>
                <div className="testimonials">
                    <blockquote>"This jaundice detection system is a game-changer. It's easy to use and incredibly accurate. Highly recommend it!"</blockquote>
                    <p>- Dr. Jane Doe, Pediatric Specialist</p>

                    <blockquote>"An innovative approach to healthcare. This tool has made early jaundice detection more accessible and reliable."</blockquote>
                    <p>- John Smith, Health Blogger</p>
                </div>
            </section>
        </div>
    );
}

export default About;
