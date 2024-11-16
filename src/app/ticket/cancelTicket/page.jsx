"use client";
import { useState } from 'react';
import styles from './cancel.module.css';

const CancelTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleCancel = async () => {
        if (!ticketId) {
            setError("Please enter a valid Ticket ID.");
            setMessage(''); // Clear any success message
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/ticket/cancel/${ticketId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to cancel the ticket");
            }

            setMessage("Ticket canceled successfully.");
            setError(''); // Clear any error message
            setTicketId(''); // Optionally, clear the ticket ID input field
        } catch (error) {
            setError(error.message);
            setMessage(''); // Clear any success message
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.header}>Cancel Ticket</h2>
            <input
                type="text"
                placeholder="Enter Ticket ID"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleCancel} className={styles.bookButton}>
                Cancel Ticket
            </button>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default CancelTicket;
