// app/ticket/viewticket/page.jsx
"use client";
import { useState } from 'react';
import styles from './view.module.css';

const ViewTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticketData, setTicketData] = useState(null); // State to store ticket data
    const [error, setError] = useState(''); // State to handle errors

    const handleView = async () => {
        if (ticketId) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/ticket/${ticketId}`);
                if (!response.ok) throw new Error("Ticket not found");

                const data = await response.json();
                setTicketData(data); // Set the fetched ticket data
                setError(''); // Clear any previous errors
            } catch (error) {
                setError(error.message);
                setTicketData(null); // Clear previous ticket data
            }
        } else {
            alert("Please enter a Ticket ID.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.header}>View Ticket</h2>
            <input 
                type="text" 
                placeholder="Enter Ticket ID" 
                value={ticketId} 
                onChange={(e) => setTicketId(e.target.value)} 
                className={styles.input}
            />
            <button onClick={handleView} className={styles.bookButton}>View Ticket</button>

            
            {error && <p className={styles.error}>{error}</p>}

            {ticketData && (
                <div className={styles.ticketInfo}>
                    <h3>Ticket Details</h3>
                    <p><strong>Ticket ID:</strong> {ticketData.ticket_id}</p>
                    <p><strong>Train No:</strong> {ticketData.train_no}</p>
                    <p><strong>Booking Time:</strong> {ticketData.booking_time}</p>
                    <p><strong>Price:</strong> Rs {ticketData.price}</p>
                    <p><strong>From:</strong> {ticketData.src_station}</p>
                    <p><strong>To:</strong> {ticketData.dest_station}</p>
                </div>
            )}
        </div>
    );
};

export default ViewTicket;
