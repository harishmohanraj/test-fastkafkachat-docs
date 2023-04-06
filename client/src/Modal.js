import React from 'react';

function Modal({handleModalOk }) {
  return (
    <div data-testid="modal" className="modal">
      <div className="modal-content">
        <h2>Oops!</h2>
        <br/>
        <p>We're having trouble processing your request. Please try again later.</p>
        <button onClick={handleModalOk}>OK</button>
      </div>
    </div>
  );
}

export default Modal;
