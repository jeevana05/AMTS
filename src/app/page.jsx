// import styles from './home.module.css';
// import Image from "next/image";

// const Home = () => {
//   return <div className={styles.container}>
//     <div className={styles.textcontainer}>
//       <h1 className={styles.title}>Automated Smart Metro System</h1>
//       <p className={styles.desc}> This is

      
//        </p>
//       <div className={styles.buttons}>
//         <button className={styles.button}>Ticket Booking</button>
//         <button className={styles.button}>Schedule</button>
//         </div>
//         <div className={styles.brands}>
//           <Image src="/logo.png" alt=""fill className={styles.brandImg}/>
//           </div>
//         </div>
//     <div className={styles.imagecontainer}>
//       {/* <Image src="/train.jpeg" alt=""fill className={styles.trainImg}/> */}
//     </div>

//   </div>;
// };

// export default Home; 


import styles from './home.module.css';
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textcontainer}>
        <h1 className={styles.title}>Automated Smart Metro System</h1>
        <p className={styles.desc}></p>
        <p className={styles.desc}> Jammalamadugu-JMD</p>
        <p className={styles.desc}> Kadapa-KDP</p>
        
        <div className={styles.buttons}>
          <Link href="/ticket" passHref>
            <button className={styles.button}>Ticket Booking</button>
          </Link>
          <Link href="/schedule" passHref>
            <button className={`${styles.button} ${styles.scheduleButton}`}>Schedule</button>
          </Link>
        </div>

        <div className={styles.brands}>
          <Image src="/logo.png" alt="Logo" fill className={styles.brandImg} />
        </div>
      </div>

      <div className={styles.imagecontainer}>
        <Image src="/train.jpeg" alt="Train" width={900} height={800} className={styles.trainImg} /> {/* Adjust width and height as needed */}
      </div>
    </div>
  );
};

export default Home;



