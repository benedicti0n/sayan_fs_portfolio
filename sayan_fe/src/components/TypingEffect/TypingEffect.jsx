import React from "react";
import { useTypewriter} from 'react-simple-typewriter';
import styles from './TypingEffect.module.css'; // Import the CSS Module

const TypingEffect = () => {
    const [text] = useTypewriter({
        words: ["Welcome to My", "Portfolio.", "I'm a Full", "Stack Developer.", "I love building ", "amazing web applications."],
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

export default TypingEffect;