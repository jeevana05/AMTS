import Image from "next/image"; // Import Image from Next.js
import Link from "next/link";
import Links from "./links/Links";
import styles from "./navbar.module.css";

const Navbar = () => {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>
                <div className={styles.brands} style={{ marginTop: '10px' }}> {/* Adjust margin as needed */}
                    <Image 
                        src="/logo.png" 
                        alt="Logo" 
                        width={50} 
                        height={50} 
                        className={styles.brandImg} 
                    />
                </div>
            </Link>
            <div>
                <Links />
            </div>
        </div>
    );
};

export default Navbar;