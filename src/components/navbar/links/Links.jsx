"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./links.module.css";
import NavLink from "./navlink/navlink";

const links =[


    {
        title:"Homepage",
        path:"/",
    },
    {
        title:"About",
        path:"/about",
    },
    {
        title:"Ticket Booking",
        path:"/ticket",
    },
    
    {
        title:"Schedule",
        path:"/schedule",
    },
    
    
];

const Links =()=>
{
    const [open,setOpen]=useState(false)
    const session=true
    const isAdmin=true
    const router = useRouter();
    const handleLogout = () => {
    // Clear session data or any other login state
    // This could be clearing cookies, localStorage, or setting session to false.
    // For example:
    localStorage.removeItem('isAdmin'); // Assuming you store the admin status here
    // Redirect to homepage
    router.push('/');
    };

    return(
        <div className={styles.container}>
            <div className={styles.links}>
                {links.map((link) => (
                    <NavLink item={link} key={link.title} />
                ))}

                {session ? (
                    <>
                        {isAdmin && (
                            <>
                                <NavLink item={{ title: "Logs", path: "/logs" }} />
                                <NavLink item={{ title: "Admin Login", path: "/admin" }} />
                                <button className={styles.logout} onClick={handleLogout}>
                                    Admin Logout
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <NavLink item={{ title: "Login", path: "/login" }} />
                )}
            </div>
            <button className={styles.menuButton} onClick={()=>setOpen((prev)=>!prev)}>Menu</button>
            {
                open &&(<div className={styles.mobileLinks}>
                    {links.map((link)=>(
                       <NavLink item= {link} key={link.title}/>
                    ))}
                    {isAdmin && <NavLink item={{ title: "Logs", path: "/logs" }} />}
                    </div>
            )}
        </div>
        
    );
};
export default Links
// homepage,booking,schedule,login(user,admin