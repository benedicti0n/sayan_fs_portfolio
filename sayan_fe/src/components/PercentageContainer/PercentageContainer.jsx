import React, { useEffect, useRef } from 'react';
import styles from './PercentageContainer.module.css'; // Scoped CSS

const PercentageContainer = () => {
    const skillProgressesRef = useRef([]);
    const skillPercentagesRef = useRef([]);

    const skills = [
        { id: 1, img: 'icons8-c-48.png', alt: 'Skill 1', width: '60%' },
        { id: 2, img: 'icons8-c++-48.png', alt: 'Skill 2', width: '60%' },
        { id: 3, img: 'icons8-java-logo-48.png', alt: 'Skill 3', width: '60%' },
        { id: 4, img: 'icons8-python-48.png', alt: 'Skill 4', width: '60%' },
        { id: 5, img: 'icons8-html-5-48.png', alt: 'Skill 5', width: '90%' },
        { id: 6, img: 'icons8-css-logo-48.png', alt: 'Skill 6', width: '87%' },
        { id: 7, img: 'icons8-javascript-64.png', alt: 'Skill 7', width: '95%' },
        { id: 8, img: 'icons8-express-js-40.png', alt: 'Skill 8', width: '87%' },
        { id: 9, img: 'icons8-mongo-db-48.png', alt: 'Skill 9', width: '87%' },
        { id: 10, img: 'icons8-node-js-48.png', alt: 'Skill 10', width: '87%' },
        { id: 11, img: 'icons8-react-native-48.png', alt: 'Skill 11', width: '87%' },
        { id: 12, img: 'icons8-tailwind-css-48.png', alt: 'Skill 12', width: '87%' },
    ];

    useEffect(() => {
        skillProgressesRef.current.forEach((progress, index) => {
            const targetWidth = parseFloat(progress.getAttribute('data-width'));
            const percentageElement = skillPercentagesRef.current[index];
            let currentWidth = 0;

            const animateProgress = () => {
                if (currentWidth < targetWidth) {
                    currentWidth += 0.5;
                    progress.style.width = `${currentWidth}%`;
                    percentageElement.textContent = `${Math.round(currentWidth)}%`;
                    requestAnimationFrame(animateProgress);
                }
            };

            animateProgress();
        });
    }, []);

    return (
        <div className={styles.percentageContainer}>
            <div className={styles.percentageColumn}>
                {skills.slice(0, 6).map((skill, index) => (
                    <div className={styles.skillItem} key={skill.id}>
                        <div className={styles.skillLogo}>
                            <img src={skill.img} alt={skill.alt} />
                        </div>
                        <div className={styles.skillSlider}>
                            <div
                                className={styles.skillProgress}
                                data-width={skill.width}
                                ref={(el) => (skillProgressesRef.current[index] = el)}
                            ></div>
                        </div>
                        <div
                            className={styles.skillPercentage}
                            ref={(el) => (skillPercentagesRef.current[index] = el)}
                        >
                            0%
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.percentageColumn}>
                {skills.slice(6).map((skill, index) => (
                    <div className={styles.skillItem} key={skill.id}>
                        <div className={styles.skillLogo}>
                            <img src={skill.img} alt={skill.alt} />
                        </div>
                        <div className={styles.skillSlider}>
                            <div
                                className={styles.skillProgress}
                                data-width={skill.width}
                                ref={(el) => (skillProgressesRef.current[index + 6] = el)}
                            ></div>
                        </div>
                        <div
                            className={styles.skillPercentage}
                            ref={(el) => (skillPercentagesRef.current[index + 6] = el)}
                        >
                            0%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PercentageContainer;