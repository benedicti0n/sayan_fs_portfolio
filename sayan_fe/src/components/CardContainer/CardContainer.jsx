import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './CardContainer.module.css'; // Scoped CSS

const CardContainer = () => {
    const cards = [
        { id: 1, img: 'icons8-c-48.png', alt: 'Skill 1' },
        { id: 2, img: 'icons8-c++-48.png', alt: 'Skill 2' },
        { id: 3, img: 'icons8-java-logo-48.png', alt: 'Skill 3' },
        { id: 4, img: 'icons8-python-48.png', alt: 'Skill 4' },
        { id: 5, img: 'icons8-html-5-48.png', alt: 'Skill 5' },
        { id: 6, img: 'icons8-css-logo-48.png', alt: 'Skill 6' },
        { id: 7, img: 'icons8-javascript-64.png', alt: 'Skill 7' },
        { id: 8, img: 'icons8-express-js-40.png', alt: 'Skill 8' },
        { id: 9, img: 'icons8-mongo-db-48.png', alt: 'Skill 9' },
        { id: 10, img: 'icons8-node-js-48.png', alt: 'Skill 10' },
        { id: 11, img: 'icons8-react-native-48.png', alt: 'Skill 11' },
        { id: 12, img: 'icons8-tailwind-css-48.png', alt: 'Skill 12' },
    ];

    return (
        <div className={styles.cardContainer}>
            <video autoPlay muted loop id="video-bg" className={styles.video_bg}>
                <source src="/sea1.mp4" type="video/mp4" />
            </video>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={3}
                speed={500}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    600: {
                        slidesPerView: 1,
                    },
                    601: {
                        slidesPerView: 2,
                    },
                    901: {
                        slidesPerView: 3,
                    }
                }}
                className={styles.cardSlider}
            >
                {cards.map((card) => (
                    <SwiperSlide key={card.id} className={styles.card_wpr}>
                        <div className={styles.card}>
                            <img src={card.img} alt={card.alt} className={styles.card_icon}/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* <div className={styles.particles}></div>
            <div className={styles.particles}></div>
            <div className={styles.particles}></div> */}
        </div>
    );
};

export default CardContainer;