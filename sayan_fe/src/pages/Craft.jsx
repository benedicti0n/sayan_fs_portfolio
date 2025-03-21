import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BinaryRain from '../components/BinaryRain/BinaryRain';
import ThemeSwitch from '../components/ThemeSwitch/ThemeSwitch';
import CraftSection from '../components/CraftSection/CraftSection';
import styles from './Craft.module.css';

const Craft = () => {
    return (
        <div className={styles.craftPage}>
            <BinaryRain />
            <ThemeSwitch />
            <Header />
            <div className={styles.craftContent}>

                <div className={styles.cardSectionWrapper}>
                    <CraftSection/>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Craft;