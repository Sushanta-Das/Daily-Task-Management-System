import React from 'react';
import './SignUp.css';

const SignUp = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close-button" onClick={onClose}>X</button>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
