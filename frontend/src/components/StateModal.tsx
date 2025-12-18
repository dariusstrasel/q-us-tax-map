import React from 'react';
import styles from './StateModal.module.css';

type StateModalProps = {
  code: string;
  value: number | undefined;
  onClose: () => void;
};

export function StateModal({ code, value, onClose }: StateModalProps) {
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{code}</h2>
        <p className={styles.body}>
          Tax rate:{' '}
          {value != null ? (
            <span className={styles.taxValue}>{value.toFixed(2)}%</span>
          ) : (
            <span className={styles.taxMissing}>No data available</span>
          )}
        </p>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default StateModal;