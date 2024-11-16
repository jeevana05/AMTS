"use client";
import { useEffect, useState } from 'react';
import styles from './booking.module.css';

const BookingJMDtoKDP = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [error, setError] = useState('');
    const [ticketPrice, setTicketPrice] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [passengerName, setPassengerName] = useState('');

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/schedule/booking?from_station=Jammalamadugu&to_station=Kadapa`);
                if (!response.ok) throw new Error("Schedule not found");

                const data = await response.json();
                setScheduleData(data);
                setError('');

                if (data.length > 0) {
                    setTicketPrice(100);
                }
            } catch (error) {
                setError(error.message);
                setScheduleData([]);
                setTicketPrice(null);
            }
        };

        fetchSchedule();
    }, []);

    const handleBookTicket = async () => {
        const scheduleId = selectedSchedule?.schedule_id;
        // Debugging: Check if scheduleId and passengerName have values
        console.log("Selected Schedule ID:", scheduleId);
        console.log("Passenger Name:", passengerName);
        if (!scheduleId || !passengerName) {
            alert("Missing required fields");
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/ticket/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                schedule_id: scheduleId,
                passenger_name: passengerName
            }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Booking successful! Your ticket ID is ${data.ticket_id}`);
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.header}>Booking Page - JMD to KDP</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {scheduleData.length > 0 ? (
                <div className={styles.schedule}>
                    <p>Ticket Price: {ticketPrice !== null ? `$${ticketPrice}` : 'Loading...'}</p>
                    
                    <div className={styles.quantityContainer}>
                        <label>
                            Passenger Name:
                            <input 
                                type="text" 
                                value={passengerName} 
                                onChange={(e) => setPassengerName(e.target.value)} 
                                placeholder="Enter your name" 
                                className={styles.quantityInput}
                            />
                        </label>
                    </div>
                    <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Train No</th>
                                <th>Arrival Time</th>
                                <th>Departure Time</th>
                                <th>Frequency</th>
                                <th>Capacity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleData.map((schedule) => (
                                <tr key={schedule.schedule_id}>
                                    <td>{schedule.train_no}</td>
                                    <td>{schedule.arrival_time}</td>
                                    <td>{schedule.departure_time}</td>
                                    <td>{schedule.frequency}</td>
                                    <td>{schedule.capacity}</td>
                                    <td>
                                        <button 
                                            onClick={() => setSelectedSchedule(schedule)}
                                            className={styles.selectButton}
                                            style={{ backgroundColor: selectedSchedule?.schedule_id === schedule.schedule_id ? 'lightgreen' : '' }}
                                        >
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                
                    <div>
                        <button 
                            onClick={handleBookTicket} 
                            disabled={!selectedSchedule || !passengerName} 
                            className={styles.bookButton}
                        >
                            Book Ticket
                        </button>
                    </div>
                </div>
            ) : (
                <p>No schedule available for this route.</p>
            )}
        </div>
    );
};

export default BookingJMDtoKDP;
