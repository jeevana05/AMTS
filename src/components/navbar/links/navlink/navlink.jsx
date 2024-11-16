"use client";
import { usePathname } from "next/navigation";
import styles from './navlink.module.css'
import Link from "next/link"
const NavLink=({item})=>{
    const pathName=usePathname();
    // return(
    //     //<div className={styles.container}Navlink></div>
    //     <Link href={item.path} className={`${styles.container} ${pathName==item.path && styles.active}`}>{item.title}</Link>
    // );
    return(
     <Link
         href={item.path} 
         className={`${styles.container} ${
            pathName===item.path && styles.active
        }`}>
            {item.title}
            </Link>
    );
};

export default NavLink;