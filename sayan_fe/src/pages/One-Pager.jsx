import React from "react";
import Cloud from "../components/Cloud/Cloud";
import Particles from "../components/WhiteParticles/Particles";
import CvCard from "../components/CVCard/CVCard";
import BinaryRain from "../components/BinaryRain/BinaryRain";
import ThemeSwitch from "../components/ThemeSwitch/ThemeSwitch";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import styles from "./One-Pager.module.css"; // Import CSS
import TypingEffect3 from "../components/TypingEffect3/TypingEffect3";

export default function One_Pager() {
    return (
        <div>
            <Header />
            <div className={styles.onePagerContainer}>
                <BinaryRain />
                <ThemeSwitch />

                <div className={styles.contentWrapper}>
                    {/* Floating Clouds */}
                    <Cloud top={20} left={20} />
                    <Cloud top={40} left={60} />
                    <Cloud top={75} left={35} />
                    <Particles />
                    <TypingEffect3/>
                    <CvCard />
                </div>
            </div>
            <Footer />
        </div>
    );
}