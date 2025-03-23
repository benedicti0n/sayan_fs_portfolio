import React from 'react';
import styles from './VerifiedSection.module.css'; // Scoped CSS for the section
import VerifiedCard from '../VerifiedCard/VerifiedCard';

const VerifiedSection = () => {
    const documents = [
        { title: 'Adhar Card', imageSrc: '/sayan_docs/aadharcard.jpg', downloadLink: 'My picture.png' },
        { title: 'Birth Certificate', imageSrc: '/sayan_docs/birthcertifcate.jpg', downloadLink: 'birth_certificate.jpg' },
        { title: 'Pan Card', imageSrc: '/sayan_docs/pan.jpg', downloadLink: 'pan_card.jpg' },
        { title: 'Voter Card', imageSrc: '/sayan_docs/votercard.jpg', downloadLink: 'voter_card.jpg' },
        { title: 'Photo', imageSrc: '/sayan_docs/potrait.jpg', downloadLink: 'photo.jpg' },
        { title: '10th Admit Card', imageSrc: '/sayan_docs/10thadmitcard.jpg', downloadLink: '10th_admit_card.jpg' },
        { title: '10th Result', imageSrc: '/sayan_docs/10thresult.jpg', downloadLink: '10th_result.jpg' },
        { title: '12th Admit Card', imageSrc: '/sayan_docs/12thadmitcard.jpg', downloadLink: '12th_admit_card.jpg' },
        { title: '12th Result', imageSrc: '/sayan_docs/12thresult.jpg', downloadLink: '12th_result.jpg' },
        { title: 'School Certificate', imageSrc: '/sayan_docs/12thcert.jpg', downloadLink: 'school_certificate.jpg' },
        { title: '1st Semester', imageSrc: '/sayan_docs/1stsem.jpg', downloadLink: '1st_sem.jpg' },
        { title: '2nd Semester', imageSrc: '/sayan_docs/2ndsem.jpg', downloadLink: '2nd_sem.jpg' },
        { title: '3rd Semester', imageSrc: '/sayan_docs/3rdsem.jpg', downloadLink: '3rd_sem.jpg' },
        { title: '4th Semester', imageSrc: '/sayan_docs/4thsem.jpg', downloadLink: '4th_sem.jpg' },
        { title: '5th Semester', imageSrc: '/sayan_docs/5thsem.jpg', downloadLink: '5th_sem.jpg' },
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