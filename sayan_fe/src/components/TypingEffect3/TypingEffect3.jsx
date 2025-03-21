import React from "react";
import { useTypewriter} from 'react-simple-typewriter';
import styles from './TypingEffect3.module.css'; // Import the CSS Module

const TypingEffect3 = () => {
    const [text] = useTypewriter({
        words: ["Click here", "to download my Resume."],
        loop: true,
        typeSpeed: 70, // Adjust typing speed (milliseconds per character)
        deleteSpeed: 50, // Adjust delete speed (milliseconds per character)
        delaySpeed: 1000, // Adjust delay between words (milliseconds)
    });

    return (
        <div className={styles.typingContainer}>
            <span className={styles.typingText}>
                {text}
                <span className={styles.cursor}></span>
            </span>
        </div>
    );
};

export default TypingEffect3;