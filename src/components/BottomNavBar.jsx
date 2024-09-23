import { Link, useLocation } from "react-router-dom";
import HomeIcon from '../assets/icons/home-icon.svg';
import ExploreIcon from '../assets/icons/explore-icon.svg';
import SettingsIcon from '../assets/icons/settings-icon.svg';
import ProfileIcon from '../assets/icons/profile-icon.svg';
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
    { to: '/home', icon: HomeIcon, label: 'Home' },
    { to: '/explore', icon: ExploreIcon, label: 'Explore' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#fff] shadow-md">
      <nav className="flex justify-between items-center py-4"> 
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
              <img src={icon} alt={label} className="w-7 md:w-6 h-7 md:h-6" />
              <span className="hidden md:block">{label}</span> {/* Hide label on mobile */}
            </Link>
          ))}

          {/* Profile Picture */}
          <Link to="/profile" className="flex items-center">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-7 md:w-10 h-7 md:h-10 rounded-full" />
            ) : (
              <img src={ProfileIcon} alt="Profile Icon" className="w-7 md:w-10 h-7 md:h-10" />
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default BottomNavBar;
