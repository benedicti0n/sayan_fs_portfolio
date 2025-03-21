import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BinaryRain from "../components/BinaryRain/BinaryRain";
import ThemeSwitch from "../components/ThemeSwitch/ThemeSwitch";
import TypingEffect from "../components/TypingEffect/TypingEffect";
import styles from "./Launchpad.module.css";

// Original planet data
const originalPlanets = [
    { src: "icons8-html-5-48.png", alt: "HTML", orbit: "200px", duration: "10s" },
    {
        src: "icons8-css-logo-48.png",
        alt: "CSS",
        orbit: "200px",
        duration: "12s",
    },
    {
        src: "icons8-javascript-64.png",
        alt: "JavaScript",
        orbit: "200px",
        duration: "14s",
    },
    {
        src: "icons8-react-native-48.png",
        alt: "React",
        orbit: "250px",
        duration: "16s",
    },
    {
        src: "icons8-node-js-48.png",
        alt: "Node.js",
        orbit: "250px",
        duration: "18s",
    },
    {
        src: "icons8-mongo-db-48.png",
        alt: "MongoDB",
        orbit: "250px",
        duration: "20s",
    },
    {
        src: "icons8-express-js-40.png",
        alt: "Express",
        orbit: "250px",
        duration: "22s",
    },
    { src: "icons8-c-48.png", alt: "C", orbit: "300px", duration: "24s" },
    { src: "icons8-c++-48.png", alt: "C++", orbit: "300px", duration: "26s" },
    {
        src: "icons8-java-logo-48.png",
        alt: "Java",
        orbit: "300px",
        duration: "28s",
    },
    {
        src: "icons8-python-48.png",
        alt: "Python",
        orbit: "300px",
        duration: "30s",
    },
    {
        src: "icons8-tailwind-css-48.png",
        alt: "Tailwind",
        orbit: "300px",
        duration: "32s",
    },
];

const Launchpad = () => {
    const [planets, setPlanets] = useState(originalPlanets);
    const [orbitSizes, setOrbitSizes] = useState([200, 250, 300]);

    // Function to adjust orbit sizes based on screen width
    const adjustOrbitSizes = () => {
        const width = window.innerWidth;
        let newPlanets = [...originalPlanets];
        let newOrbitSizes = [200, 250, 300];

        if (width <= 400) {
            newOrbitSizes = [80, 120, 160];
            newPlanets = originalPlanets.map(planet => {
                const newPlanet = { ...planet };
                if (planet.orbit === "200px") newPlanet.orbit = "80px";
                if (planet.orbit === "250px") newPlanet.orbit = "120px";
                if (planet.orbit === "300px") newPlanet.orbit = "160px";
                return newPlanet;
            });
        } else if (width <= 576) {
            newOrbitSizes = [100, 150, 200];
            newPlanets = originalPlanets.map(planet => {
                const newPlanet = { ...planet };
                if (planet.orbit === "200px") newPlanet.orbit = "100px";
                if (planet.orbit === "250px") newPlanet.orbit = "150px";
                if (planet.orbit === "300px") newPlanet.orbit = "200px";
                return newPlanet;
            });
        } else if (width <= 768) {
            newOrbitSizes = [150, 200, 250];
            newPlanets = originalPlanets.map(planet => {
                const newPlanet = { ...planet };
                if (planet.orbit === "200px") newPlanet.orbit = "150px";
                if (planet.orbit === "250px") newPlanet.orbit = "200px";
                if (planet.orbit === "300px") newPlanet.orbit = "250px";
                return newPlanet;
            });
        }

        setPlanets(newPlanets);
        setOrbitSizes(newOrbitSizes);
    };

    // Add event listener for window resize
    useEffect(() => {
        adjustOrbitSizes(); // Initial adjustment
        window.addEventListener('resize', adjustOrbitSizes);
        return () => window.removeEventListener('resize', adjustOrbitSizes);
    }, []);

    return (
        <div>
            <Header />
            <div className={styles.launchpadContainer}>
                <BinaryRain />
                <ThemeSwitch />
                <div className={styles.contentContainer}>
                    <TypingEffect />
                    <section className={styles.solarSystem}>
                        <div className={styles.sun}></div>

                        {/* Orbit Rings */}
                        {orbitSizes.map((radius, index) => (
                            <div
                                key={index}
                                className={styles.orbit}
                                style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                            ></div>
                        ))}

                        {/* Planets */}
                        {planets.map((planet, index) => (
                            <div
                                key={index}
                                className={styles.planet}
                                style={{
                                    "--orbit-radius": planet.orbit,
                                    animationDuration: planet.duration,
                                }}
                            >
                                <img src={planet.src} alt={planet.alt} />
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Launchpad;