import React from 'react';
import styles from './CraftCard.module.css'; // Scoped CSS for the card

const CraftCard = ({ logo, title, description, technologies, projectLink }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardLogo}>
                <img src={logo} alt={`${title} Logo`} />
            </div>
            <div className={styles.cardContent}>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>
                    {technologies.map((tech, index) => (
                        <li key={index}>{tech}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.cardFooter}>
                <a href={projectLink} className={styles.viewButton}>
                    View Project
                </a>
            </div>
        </div>
    );
};

export default CraftCard;