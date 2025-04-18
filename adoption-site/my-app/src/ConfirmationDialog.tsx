import React from 'react';
import './ConfirmationDialog.css'; // Import the CSS file

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="confirmation-dialog-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;