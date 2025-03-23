import React from 'react';
import { Download } from 'lucide-react'; // Using an icon for better UX
import styles from './VerifiedCard.module.css';

const VerifiedCard = ({ title, imageSrc }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(imageSrc, { mode: 'cors' }); // Ensures CORS is respected
            const blob = await response.blob(); // Convert to binary
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'downloaded-image'}.jpg`; // Set a default filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Cleanup

        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className={styles.card} data-title={title}>
            <img src={imageSrc} alt={title} className={styles.documentPhoto} />
            <button onClick={handleDownload} className={styles.downloadIcon}>
                <Download size={24} />
            </button>
        </div>
    );
};

export default VerifiedCard;
