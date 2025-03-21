import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BinaryRain from "../components/BinaryRain/BinaryRain";
import ThemeSwitch from "../components/ThemeSwitch/ThemeSwitch";
import VerifiedSection from "../components/VerifiedSection/VerifiedSection";
import Particles from "../components/WhiteParticles/Particles";
import styles from "./Verified.module.css"; // Import CSS

const Verified = () => {
    return (
        <div>
            <Header />
            <div className={styles.verifiedContainer}>
                <BinaryRain />
                <ThemeSwitch />

                <div className={styles.contentWrapper}>
                    {/* Verified Section */}
                    <div className={styles.verifiedContent}>
                        <VerifiedSection />
                    </div>

                    {/* Floating Particles */}
                    <Particles />
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default Verified;