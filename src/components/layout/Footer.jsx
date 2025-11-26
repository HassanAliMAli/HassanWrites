import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer__container">
                <div className="footer__content">
                    <div className="footer__brand">
                        <span className="footer__logo">EdgeMaster</span>
                        <p className="footer__tagline">A masterpiece publishing platform.</p>
                    </div>

                    <div className="footer__links">
                        <div className="footer__column">
                            <h4>Platform</h4>
                            <Link to="/">Discovery</Link>
                            <Link to="/authors">Authors</Link>
                            <Link to="/pricing">Pricing</Link>
                        </div>
                        <div className="footer__column">
                            <h4>Company</h4>
                            <Link to="/about">About</Link>
                            <Link to="/careers">Careers</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                        <div className="footer__column">
                            <h4>Legal</h4>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {new Date().getFullYear()} EdgeMaster. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
