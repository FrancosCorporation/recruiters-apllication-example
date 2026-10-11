import React from 'react';
import '../css/message_alert.css';

const Alertmessage = ({ message, onClose, messagecontainer }) => {
    const handleCloseOutside = (e) => {
        if (e.target.classList.contains('container-pai')) {
            onClose();
        }
    };

    return (
        <div className='container-pai' onClick={handleCloseOutside}>
            <div className="messagecontainer" style={messagecontainer}>
                <div className="text-container">{message}</div>
                <button className="buttonclose" onClick={onClose}>X</button>
            </div> 
        </div>
    );
};

export { Alertmessage };
