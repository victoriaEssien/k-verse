import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../firebase_setup/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({
    profilePicture: null,
    email: '',
    displayName: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const createdAt = data.createdAt 
            ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) 
            : 'N/A';

          setProfile({
            profilePicture: data.profilePicture || '',
            email: data.email || '',
            displayName: data.displayName || 'Anonymous',
            createdAt: createdAt
          });
          
          // Fetch watchlist
          const watchlistRef = collection(db, 'users', user.uid, 'watchlist');
          const watchlistSnapshot = await getDocs(watchlistRef);
          const watchlistData = await Promise.all(watchlistSnapshot.docs.map(async (watchlistDoc) => {
            const watchlistItem = watchlistDoc.data();
            // Fetch K-drama details using kdramaId
            const kdramaRef = doc(db, 'kdramas', watchlistItem.kdramaId);
            const kdramaDoc = await getDoc(kdramaRef);
            return {
              ...watchlistItem,
              kdramaDetails: kdramaDoc.exists() ? kdramaDoc.data() : null // Fetch kdrama details
            };
          }));
          setWatchlist(watchlistData);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to handle filtering
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter watchlist based on the selected list type
  const filteredWatchlist = filter === 'All' 
    ? watchlist 
    : watchlist.filter(item => item.list === filter);

  return (
    <div className="">
        <header className="border-b sticky top-0 z-10 bg-[#fff] border-[#F5F5F5] px-4 md:px-12 lg:px-12 py-3 flex justify-between items-center">
            <Link to='/explore' className="font-roboto font-bold text-xl text-[#2e7d32] leading-8">
                K-Verse
            </Link>
        </header>

      <div className="mx-4 md:mx-12 mt-10">
        <h3 className="text-3xl font-roboto font-bold text-[#333]">My Profile</h3>
        
        {/* Profile pic, username and join date */}
        <div className='flex flex-row items-center'>
            <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
            <div className='flex flex-row items-end'>
                <h2 className='font-os font-bold text-3xl'>{profile.displayName}</h2>
                <p>Member since {profile.createdAt}</p>
            </div>
        </div>
        
      </div>
      <div className="watchlist-container">
        <div className='flex items-center justify-between'>
            <h3 className="text-3xl font-roboto font-bold text-[#333]">My Watchlist</h3>
        <div>
            <select id="filter" className='px-4 py-2 outline-none border border-[#D1D1D1] rounded-lg w-full max-w-xs font-os text-[#333]' value={filter} onChange={handleFilterChange}>
            <option value="All">All Lists</option>
            <option value="Default List">Default List</option>
            {/* Add more list types as necessary */}
            </select>
        </div>
        </div>
      
        <ul>
          {filteredWatchlist.map((item) => (
            <li key={item.kdramaId}>
                <img src={item.kdramaDetails.poster} alt={item.kdramaDetails.name} />
              {item.kdramaDetails ? (
                <Link to={`/kdrama/${item.kdramaId}`}>
                  {item.kdramaDetails.name}
                </Link>
              ) : (
                <span>K-drama not found</span>
              )}
              <p>Status: {item.status}</p>
              <p>Added on: {new Date(item.addedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
