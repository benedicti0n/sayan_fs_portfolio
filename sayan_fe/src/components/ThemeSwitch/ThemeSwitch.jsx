import React from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './ThemeSwitch.module.css';

const ThemeSwitch = () => {
  const location = useLocation();

  useEffect(() => {
    const mode = document.body;
    if(mode.classList.contains('light-mode')){
      mode.classList.remove('light-mode');
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
  };

  return (
    <label className={styles.switch}>
      <input type="checkbox" onClick={toggleTheme} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ThemeSwitch;