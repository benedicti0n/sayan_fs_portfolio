import React from 'react';
import styles from './VerifiedSection.module.css'; // Scoped CSS for the section
import VerifiedCard from '../VerifiedCard/VerifiedCard';

const VerifiedSection = () => {
    const documents = [
        { title: 'Adhar Card', imageSrc: 'My picture.png', downloadLink: 'My picture.png' },
        { title: 'Birth Certificate', imageSrc: 'birth_certificate.jpg', downloadLink: 'birth_certificate.jpg' },
        { title: 'Pan Card', imageSrc: 'pan_card.jpg', downloadLink: 'pan_card.jpg' },
        { title: 'Voter Card', imageSrc: 'voter_card.jpg', downloadLink: 'voter_card.jpg' },
        { title: 'Photo', imageSrc: 'photo.jpg', downloadLink: 'photo.jpg' },
        { title: '10th Admit Card', imageSrc: '10th_admit_card.jpg', downloadLink: '10th_admit_card.jpg' },
        { title: '10th Result', imageSrc: '10th_result.jpg', downloadLink: '10th_result.jpg' },
        { title: '12th Admit Card', imageSrc: '12th_admit_card.jpg', downloadLink: '12th_admit_card.jpg' },
        { title: '12th Result', imageSrc: '12th_result.jpg', downloadLink: '12th_result.jpg' },
        { title: 'School Certificate', imageSrc: 'school_certificate.jpg', downloadLink: 'school_certificate.jpg' },
        { title: '1st Semester', imageSrc: '1st_sem.jpg', downloadLink: '1st_sem.jpg' },
        { title: '2nd Semester', imageSrc: '2nd_sem.jpg', downloadLink: '2nd_sem.jpg' },
        { title: '3rd Semester', imageSrc: '3rd_sem.jpg', downloadLink: '3rd_sem.jpg' },
        { title: '4th Semester', imageSrc: '4th_sem.jpg', downloadLink: '4th_sem.jpg' },
        { title: '5th Semester', imageSrc: '5th_sem.jpg', downloadLink: '5th_sem.jpg' },
        { title: '6th Semester', imageSrc: '6th_sem.jpg', downloadLink: '6th_sem.jpg' },
    ];

    return (
        <section className={styles.verifiedSection}>
            <div className={styles.cardContainer}>
                {documents.map((doc, index) => (
                    <VerifiedCard
                        key={index}
                        title={doc.title}
                        imageSrc={doc.imageSrc}
                        downloadLink={doc.downloadLink}
                    />
                ))}
            </div>
            <div className={styles.particles}></div>
            <div className={styles.particles}></div>
            <div className={styles.particles}></div>
        </section>
    );
};

export default VerifiedSection;