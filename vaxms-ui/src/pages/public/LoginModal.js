import React from 'react';
import { Modal } from 'react-bootstrap';
import Login from './signin'; // Assuming you have the login form component

function LoginModal({ show, onClose }) {
    return (
        <Modal
            show={show}
            onHide={onClose}
            className="login-modal"
            size='xl'
            dialogClassName="modal-dialog-centered" /* Center the modal */
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Login /> {/* Assuming this is your login form component */}
            </Modal.Body>
        </Modal>


    );
}

export default LoginModal;