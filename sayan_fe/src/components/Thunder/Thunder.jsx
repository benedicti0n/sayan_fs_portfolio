import React, { useEffect, useState } from "react";
import styles from "./Thunder.module.css";

const Thunder = () => {
    const [thunderElements, setThunderElements] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            setThunderElements((prev) => [
                ...prev,
                { id: Date.now(), x, y }, // Add a unique ID for each thunder element
            ]);
            setTimeout(() => {
                setThunderElements((prev) => prev.slice(1)); // Remove the oldest thunder element
            }, 3000);
        };

        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            setThunderElements((prev) => [
                ...prev,
                { id: Date.now(), x, y }, // Add a unique ID for each thunder element
            ]);
            setTimeout(() => {
                setThunderElements((prev) => prev.slice(1)); // Remove the oldest thunder element
            }, 3000);
        }, 3000);

        document.addEventListener("click", handleClick);
        return () => {
            clearInterval(interval);
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div id="thunder-container">
            {thunderElements.map((thunder) => (
                <img
                    key={thunder.id} // Use the unique ID as the key
                    src="thunder.png" // Path to your thunder image
                    alt="Thunder"
                    className={styles.thunderImg}
                    style={{
                        left: `${thunder.x}px`,
                        top: `${thunder.y}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default Thunder;