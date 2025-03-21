import React from "react";
import styles from "./Cloud.module.css";

const Cloud = ({ top, left }) => {
    return (
        <div className={styles.cloud} style={{ top: `${top}%`, left: `${left}%` }}>
            <img src="cloude.png" alt="Cloud" />
        </div>
    );
};

export default Cloud;