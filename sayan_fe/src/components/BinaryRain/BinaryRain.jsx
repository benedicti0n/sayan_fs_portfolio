import React, { useEffect, useRef } from 'react';
import styles from './BinaryRain.module.css';

const BinaryRain = () => {
  const binaryContainerRef = useRef(null); // Create a ref for the container

  useEffect(() => {
    const binaryContainer = binaryContainerRef.current; // Access the ref

    // Generate binary rain
    for (let i = 0; i < 30; i++) {
      let span = document.createElement('span');
      span.textContent = Math.random() > 0.5 ? '0' : '1';
      span.style.setProperty('--i', Math.random());
      span.style.left = `${Math.random() * 100}vw`;
      span.style.animationDuration = `${2 + Math.random() * 3}s`;
      binaryContainer.appendChild(span);
    }
  }, []);

  return <div ref={binaryContainerRef} className={styles.binaryRain}></div>;
};

export default BinaryRain;