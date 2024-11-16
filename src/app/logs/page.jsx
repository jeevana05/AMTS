"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './logs.module.css'; // Import the CSS module

export default function TicketLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    // Track if the redirect and alert have already been triggered
    const hasRedirected = useRef(false);
    
    // Check if the admin is logged in
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; 

    // If not logged in as admin, show alert and redirect to the homepage
    useEffect(() => {
        if (!isAdmin && !hasRedirected.current) {
            alert('This page is only accessible to admins.');
            router.push('/');  // Redirect to homepage or any other route after alert
            hasRedirected.current = true;  // Prevent further redirects or alerts
        }
    }, [isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            async function fetchLogs() {
                try {
                    const response = await fetch('http://127.0.0.1:5000/ticket/logs');
                    if (!response.ok) throw new Error('Error fetching ticket logs');
                    
                    const data = await response.json();
                    setLogs(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            }
            fetchLogs();
        }
    }, [isAdmin]);

    // Loading and error handling
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Ticket Logs</h2>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>Log ID</th>
                        <th className={styles.th}>Ticket ID</th>
                        <th className={styles.th}>Log Time</th>
                        <th className={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.log_id} className={styles.row}>
                            <td className={styles.td}>{log.log_id}</td>
                            <td className={styles.td}>{log.ticket_id}</td>
                            <td className={styles.td}>{new Date(log.log_time).toLocaleString()}</td>
                            <td className={styles.td}>{log.action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
