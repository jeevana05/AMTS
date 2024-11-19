"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import styles from './logs.module.css'; // Import the CSS module

export default function TicketLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [revenueError, setRevenueError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const hasRedirected = useRef(false);

    // Check admin status after the component mounts (client-side only)
    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);

        if (!adminStatus && !hasRedirected.current) {
            alert('This page is only accessible to admins.');
            router.push('/'); // Redirect to homepage or another page
            hasRedirected.current = true; // Prevent multiple redirects
        }
    }, [router]);

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

    const fetchRevenueData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/ticket/revenue');
            if (!response.ok) throw new Error('Error fetching train revenue');

            const data = await response.json();
            setRevenueData(data);
        } catch (error) {
            setRevenueError(error.message);
        }
    };

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

            <button onClick={fetchRevenueData} className={styles.revenueButton}>
                Fetch Train Revenue
            </button>

            {revenueError && <p>Error: {revenueError}</p>}

            {revenueData.length > 0 && (
                <div>
                    <h2>Train Revenue</h2>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>Train Number</th>
                                <th className={styles.th}>Total Passengers</th>
                                <th className={styles.th}>Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueData.map(revenue => (
                                <tr key={revenue.train_no} className={styles.row}>
                                    <td className={styles.td}>{revenue.train_no}</td>
                                    <td className={styles.td}>{revenue.total_passengers}</td>
                                    <td className={styles.td}>{revenue.total_revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
