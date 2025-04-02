import React from 'react';
import { Modal } from 'react-bootstrap';
import Register from './register'; // Assuming you have the register form component

function RegisterModal({ show, onClose }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      className="register-modal"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <Register /> {/* Assuming this is your register form component */}
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;