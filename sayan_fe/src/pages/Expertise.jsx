import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BinaryRain from "../components/BinaryRain/BinaryRain";
import ThemeSwitch from "../components/ThemeSwitch/ThemeSwitch";
import PercentageContainer from "../components/PercentageContainer/PercentageContainer";
import CardContainer from "../components/CardContainer/CardContainer";
import Particles from "../components/WhiteParticles/Particles";
import styles from "./Expertise.module.css"; // Import CSS module

const Expertise = () => {
    return (
        <div>
            <Header />
            <div className={styles.expertiseContainer}>
                <BinaryRain />
                <ThemeSwitch />
                <div className={styles.contentWrapper}>
                    <div className={styles.cardWrapper}>
                        <CardContainer />
                        <Particles />
                    </div>
                    <PercentageContainer />
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default Expertise;