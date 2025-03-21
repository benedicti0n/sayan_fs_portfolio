import React, { useEffect } from "react";
import styles from "./Particles.module.css";

const Particles = () => {
    useEffect(() => {
        const particlesContainer = document.querySelector(`.${styles.particles}`);
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement("div");
            particle.classList.add(styles.particle);
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${2 + Math.random() * 3}s`;
            particlesContainer.appendChild(particle);
        }
    }, []);

    return <div className={styles.particles}></div>;
};

export default Particles;