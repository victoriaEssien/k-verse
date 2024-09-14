import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../firebase_setup/firebase";
import { doc, getDoc } from "firebase/firestore";

function KdramaDetailPage() {
  const { id } = useParams(); // Get the K-drama ID from the URL
  const [kdrama, setKdrama] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKdramaDetails = async () => {
      try {
        const kdramaDoc = doc(db, "kdramas", id); // Reference to the specific document
        const kdramaSnapshot = await getDoc(kdramaDoc);

        if (kdramaSnapshot.exists()) {
          setKdrama(kdramaSnapshot.data());
        } else {
          console.error("K-Drama not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching K-Drama details: ", error);
      }
    };

    fetchKdramaDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!kdrama) {
    return <p>K-Drama not found.</p>;
  }

  return (
    <div className="">
      <header className="border-b border-[#F5F5F5] px-4 md:px-12 py-3">
        <Link to='/discover' className="font-roboto font-bold text-xl text-[#2E7D32] leading-8">K-Verse</Link>
      </header>

      <div className="mx-4 md:mx-12 mt-10 flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={kdrama.poster} alt={kdrama.name} className="w-full h-auto rounded-lg" />
        </div>

        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold font-roboto text-[#333]">{kdrama.name}</h1>
          <p className="text-[#A3A3A3] font-os text-base leading-normal mt-4">{kdrama.plot}</p>

          <div className="mt-4">
            <h2 className="font-bold font-roboto text-[#333]">Details</h2>
            <p><strong>Seasons:</strong> {kdrama.seasons}</p>
            <p><strong>Episodes:</strong> {kdrama.episodes}</p>
            <p><strong>Status:</strong> {kdrama.status}</p>
            <p><strong>Year:</strong> {kdrama.year}</p>
          </div>

          <div className="mt-4">
            <h2 className="font-bold font-roboto text-[#333]">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {kdrama.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F5F5F5] text-[#333] text-sm rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-bold font-roboto text-[#333]">Where to Watch</h2>
            <ul className="list-disc ml-5 mt-2">
              {kdrama.locations.map((location, index) => (
                <li key={index} className="text-[#2E7D32]">
                  <a href={location} target="_blank" rel="noopener noreferrer" className="underline">
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KdramaDetailPage;
