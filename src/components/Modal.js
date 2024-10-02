import React from 'react';
import './Modal.css';

function Modal({ showModal, handleClose, children }) {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <img src="/close-icon.svg" alt="닫기" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
