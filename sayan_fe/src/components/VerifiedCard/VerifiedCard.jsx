import React from 'react';
import styles from './VerifiedCard.module.css'; // Scoped CSS for the card

const VerifiedCard = ({ title, imageSrc, downloadLink }) => {
    return (
        <div className={styles.card} data-title={title}>
            <img src={imageSrc} alt={title} className={styles.documentPhoto} />
            <a href={downloadLink} download className={styles.downloadIcon}>
                <img src="download1.png" alt="Download" />
            </a>
        </div>
    );
};

export default VerifiedCard;