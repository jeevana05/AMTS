"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ticket.module.css';

const Ticket = () => {
    const router = useRouter();

    // Handle navigation to view and cancel pages
    const handleView = () => {
        router.push('/ticket/viewTicket');
    };

    const handleCancel = () => {
        router.push('/ticket/cancelTicket');
    };

    const handleBookJMDToKDP = () => {
        router.push('/ticket/bookingJMDtoKDP');
    };

    const handleBookKDPToJMD = () => {
        router.push('/ticket/bookingKDPtoJMD');
    };

    return (
        <div className={styles.pageContainer}>
            <Image 
                src="/vintageback.jpg" 
                alt="Background Image"
                layout="fill" 
                objectFit="cover" 
                className={styles.backgroundImage} 
            />
            <div className={styles.content}>
                <button className={styles.bookButton} onClick={handleView}>View Ticket</button>
                <h2>Ticket Booking</h2>
                <div className={styles.buttonContainer}>
                    <div className={styles.ticketOption}>
                        <Image 
                            src="/pic1.jpg" 
                            alt="Metro Ticket 1" 
                            layout="fill" 
                            className={styles.ticketImage} 
                        />
                        <p className={styles.ticketText}>JMD to KDP</p>
                        <button className={styles.bookButton} onClick={handleBookJMDToKDP}>Book Now</button>
                    </div>
                    <div className={styles.ticketOption}>
                        <Image 
                            src="/pic2.jpg" 
                            alt="Metro Ticket 2" 
                            layout="fill" 
                            className={styles.ticketImage} 
                        />
                        <p className={styles.ticketText}>KDP to JMD</p>
                        <button className={styles.bookButton} onClick={handleBookKDPToJMD}>Book Now</button>
                    </div>
                </div>
                <div>
                    <button className={styles.bookButton} onClick={handleCancel}>Cancel Ticket</button>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
