import { Link, useLocation } from "react-router-dom";
import { MdHome, MdExplore, MdSettings, MdPerson } from "react-icons/md";
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function BottomNavBar() {
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(null);

  // Initialize Firebase Firestore
  const db = getFirestore();
  const auth = getAuth();

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
  }, [db, auth]);

  // Define the links and their corresponding icons
  const navLinks = [
    { to: '/home', icon: <MdHome className="w-7 md:w-8 h-7 md:h-8" />, label: 'Home' },
    { to: '/explore', icon: <MdExplore className="w-7 md:w-8 h-7 md:h-8" />, label: 'Explore' },
    { to: '/settings', icon: <MdSettings className="w-7 md:w-8 h-7 md:h-8" />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#fff] shadow-md">
      <nav className="flex justify-between items-center py-4 md:py-3.5"> 
        {/* Navigation Links */}
        <div className="flex flex-grow justify-around">
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center text-center ${
                location.pathname === to ? 'text-[#2E7D32]' : 'text-gray-500'
              }`}
            >
              {icon}
              <span className="hidden md:block">{label}</span> {/* Show label on desktop */}
            </Link>
          ))}

          {/* Profile Picture */}
          <Link to="/profile" className="flex items-center">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-7 md:w-10 h-7 md:h-10 rounded-full" />
            ) : (
              <MdPerson className="w-10 h-10" />
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default BottomNavBar;
