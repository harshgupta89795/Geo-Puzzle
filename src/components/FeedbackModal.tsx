import React from 'react';

interface FeedbackModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
  correct: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ show, onClose, message, correct }) => {
  if (!show) return null;

  return (
    <div className={`modal-overlay ${correct ? 'correct' : 'wrong'}`}>
      <div className="modal">
        <h3>{message}</h3>
        <button onClick={onClose}>Next</button>
      </div>
    </div>
  );
};

export default FeedbackModal;
