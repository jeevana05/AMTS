"use client";
import { useEffect, useState } from 'react';
import styles from './schedule.module.css'; // Import CSS module

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);  // Admin state from localStorage
  const [editFrequency, setEditFrequency] = useState({});

  // Fetch schedule data from the backend
  useEffect(() => {
    // Set isAdmin from localStorage when the component mounts
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    async function fetchSchedules() {
      try {
        const response = await fetch('http://127.0.0.1:5000/schedule/');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched schedules:", data);  // Debug log to check the data
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    }
    fetchSchedules();
  }, []);

  // Handle admin frequency updates
  const handleFrequencyChange = (scheduleId, newFrequency) => {
    setEditFrequency((prev) => ({
      ...prev,
      [scheduleId]: newFrequency,
    }));
  };

  const saveFrequency = async (scheduleId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/schedule/update/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frequency: editFrequency[scheduleId],
          is_admin: isAdmin, // Include admin flag
        }),
      });
      if (response.ok) {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.schedule_id === scheduleId
            ? { ...schedule, frequency: editFrequency[scheduleId] }
            : schedule
        );
        setSchedules(updatedSchedules);
        setEditFrequency((prev) => {
          const updated = { ...prev };
          delete updated[scheduleId];
          return updated;
        });
        alert("Frequency saved successfully")
      } else {
        const errorData = await response.json();
        console.error('Error updating frequency:', errorData.error);
      }
    } catch (error) {
      console.error('Error saving frequency:', error);
    }
  };

  return (
    <div className={styles.scheduleContainer}>
      <h1 className={styles.title}>Train Schedule</h1>
      {schedules.length === 0 ? (
        <p>No schedules available</p>  // Display message if no schedules
      ) : (
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              <th>Train Number</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Arrival Time</th>
              <th>Departure Time</th>
              <th>Frequency</th>
              <th>Capacity</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.schedule_id}>
                <td>{schedule.train_no}</td>
                <td>{schedule.src_station}</td>
                <td>{schedule.dest_station}</td>
                <td>{schedule.arrival_time}</td>
                <td>{schedule.departure_time}</td>
                <td>
                  {isAdmin ? (
                    <input
                      className={styles.inputNumber}  // Apply class for styling input
                      type="number"  // Setting type to number for frequency
                      value={editFrequency[schedule.schedule_id] || schedule.frequency}
                      onChange={(e) => handleFrequencyChange(schedule.schedule_id, e.target.value)}
                    />
                  ) : (
                    schedule.frequency
                  )}
                </td>
                <td>{schedule.capacity}</td>
                {isAdmin && (
                  <td>
                    <button className={styles.saveButton} onClick={() => saveFrequency(schedule.schedule_id)}>Save</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
