"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Assuming a successful login, store isAdmin flag in localStorage
                localStorage.setItem('isAdmin', 'true');
                router.push('/schedule');  // Redirect to schedule page after login
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <h2 className={styles.title}>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
