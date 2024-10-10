import { Link, useLocation } from "react-router-dom";
import { MdHome, MdExplore, MdSettings } from "react-icons/md";
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../firebase_setup/firebase";


function BottomNavBar() {
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePicture(data.profilePicture);
        }
      }
    };

    fetchProfilePicture();
  }, []);

  // Define the links and their corresponding icons
  const navLinks = [
    { to: '/home', icon: <MdHome className="w-7 h-7 md:w-8  md:h-8" />, label: 'Home' },
    { to: '/explore', icon: <MdExplore className="w-7 h-7 md:w-8 md:h-8" />, label: 'Explore' },
    { to: '/settings', icon: <MdSettings className="w-7 h-7 md:w-8 md:h-8" />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#fff] shadow-md border">
      <nav className="flex justify-between items-center py-4 md:py-3.5"> 
        {/* Navigation Links */}
        <div className="flex flex-grow justify-around">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center text-center ${
                location.pathname === to ? 'text-[#2E7D32]' : 'text-gray-400'
              } min-[60px]`}
            >
              {icon}
              <span className="hidden md:block mt-1">{label}</span> {/* Show label on desktop */}
            </Link>
          ))}

          {/* Profile Picture */}
          <Link to="/profile" className="flex items-center">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-7 h-7 md:w-10 md:h-10 object-cover rounded-full" />
            ) : (
              <img src="https://firebasestorage.googleapis.com/v0/b/k-verse-7e64e.appspot.com/o/pfps%2Fdefaultpfp.png?alt=media&token=33792516-8689-423f-bf20-6dc47a6460e4" className="w-7 h-7 md:w-10 md:h-10 object-cover rounded-full" alt="default profile illustration" />
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default BottomNavBar;
