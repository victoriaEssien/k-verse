import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../firebase_setup/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { ListBulletIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Optional: to style skeletons
import BottomNavBar from '../components/BottomNavBar';

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

  // Function to handle filtering
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter watchlist based on the selected status type
  const filteredWatchlist = filter === 'All' 
    ? watchlist 
    : watchlist.filter(item => item.status === filter);

  // Function to map status to background and text colors
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#ECF8ED] text-[#2e7d32]';
      case 'Watching':
        return 'bg-[#E3F2FD] text-[#1565C0]';
      case 'Plan to Watch':
        return 'bg-[#FFF8E1] text-[#F9A825]';
      case 'Dropped':
        return 'bg-[#FFEBEE] text-[#D32F2F]';
      case 'On-Hold':
        return 'bg-[#F3E5F5 ] text-[#6A1B9A]';
      case 'Rewatching':
        return 'bg-[#E1F5FE] text-[#0277BD]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
        <header className="border-b sticky top-0 z-10 bg-[#fff] border-[#F5F5F5] px-4 md:px-12 lg:px-12 py-3 flex justify-between items-center">
            <Link to='/explore' className="font-roboto font-bold text-xl text-[#2e7d32] leading-8">
                K-Verse
            </Link>
        </header>

      <div className="mx-4 md:mx-12 mt-10">
        <h3 className="text-3xl md:text-4xl font-roboto font-bold text-[#333]">My Profile</h3>
        
        {/* Profile pic, username and join date */}
        <div className='flex flex-col md:flex-row items-start md:items-center mt-10 gap-x-10'>
            {loading ? (
              <Skeleton circle height={128} width={128} />
            ) : (
              <img src={profile.profilePicture} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
            )}
            <div className='flex flex-col gap-y-3 mt-4 md:mt-0'>
                <h2 className='font-os font-bold text-3xl md:text-4xl text-[#2e7d32]'>
                  {loading ? <Skeleton width={200} /> : profile.displayName}
                </h2>
                <p className='font-os text-sm text-[#888]'>
                  {loading ? <Skeleton width={150} /> : `Member since ${profile.createdAt}`}
                </p>
            </div>
        </div>

        {/* Watchlist */}
        <div className="mt-12 md:mt-16">
        <div className='flex flex-col-reverse md:flex-row items-start md:items-center md:justify-between w-full gap-y-6'>
            <h3 className="text-3xl font-roboto font-bold text-[#333]">My Watchlist</h3>
            <div className='md:w-auto mt-4 md:mt-0 ms-auto md:ml-auto'>
                <select id="filter" className='px-4 py-2 outline-none border border-[#D1D1D1] rounded-lg w-full max-w-xs font-os text-[#333]' value={filter} onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
                <option value="On-Hold">On-Hold</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Rewatching">Rewatching</option>
                <option value="Watching">Watching</option>
                </select>
            </div>
        </div>
      
        <div className='flex flex-col gap-y-6 md:p-6 mt-10 md:mt-8'>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-row gap-x-6">
                <Skeleton height={120} width={120} />
                <div className='flex flex-col gap-y-6'>
                  <Skeleton width={200} />
                  <Skeleton width={100} />
                  <Skeleton width={150} />
                </div>
              </div>
            ))
          ) : (
            filteredWatchlist.map((item) => (
              <>
                <div className='flex flex-row gap-x-6' key={item.kdramaId}>
                  <img src={item.kdramaDetails.poster} className='w-20 h-full md:w-2/12 rounded-lg' alt={item.kdramaDetails.name} />
                  <div className='flex flex-col gap-y-6'>
                    {item.kdramaDetails ? (
                    <Link to={`/kdrama/${item.kdramaId}`} className='font-os font-bold text-[#2e7d32] leading-relaxed'>
                      {item.kdramaDetails.name} ({item.kdramaDetails.year})
                    </Link>
                    ) : (
                    <span>K-drama not found</span>
                    )}
                    <button type='submit' className={`px-3 py-1 w-fit rounded-md font-os font-semibold text-sm ${getStatusStyles(item.status)}`}>{item.status}</button>
                    <div className='flex flex-row gap-x-3'>
                      <div className='flex flex-row items-center gap-x-1'>
                        <ListBulletIcon className='h-4 w-4 text-[#888]' />
                        <p className='font-os text-[#888] text-sm'>{item.kdramaDetails.episodes}</p>
                      </div>
                      <div className='flex flex-row items-center gap-x-1'>
                        <CalendarIcon className='h-4 w-4 text-[#888]' />
                        <p className='font-os text-[#888] text-sm'>{new Date(item.addedAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                      </div>
                    </div>
                    {item.thoughts && (
                      <button 
                        type='submit' 
                        className='bg-[#fff] text-[#888] border border-[#D1D1D1] font-os font-semibold text-sm px-3 py-1 w-fit rounded-md'>
                        My Thoughts
                      </button>
                    )}
                  </div>
                </div>
                <hr />
              </>
            ))
          )}
        </div>
        </div>
      </div>

      <div className="pt-24">
      <BottomNavBar />
      </div>
    </div>
  );
}

export default Profile;
