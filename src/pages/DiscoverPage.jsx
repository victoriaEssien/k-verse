import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase_setup/firebase";
import { collection, getDocs } from "firebase/firestore";
import { StarIcon } from "@heroicons/react/16/solid";

function DiscoverPage() {
    const [kdramas, setKdramas] = useState([]);
    const [filteredKdramas, setFilteredKdramas] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchKdramas = async () => {
            try {
                const kdramaCollection = collection(db, "kdramas");
                const kdramaSnapshot = await getDocs(kdramaCollection);
                const kdramaList = kdramaSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Shuffle the list of kdramas
                const shuffledKdramaList = kdramaList.sort(() => Math.random() - 0.5);

                setKdramas(shuffledKdramaList);
                setFilteredKdramas(shuffledKdramaList); // Initially, show all kdramas
            } catch (error) {
                console.error("Error fetching kdramas:", error);
            }
        };

        fetchKdramas();
    }, []);

    useEffect(() => {
        if (selectedCategory === "") {
            setFilteredKdramas(kdramas); // Show all kdramas if no category is selected
        } else {
            const filtered = kdramas.filter(kdrama =>
                kdrama.tags.includes(selectedCategory)
            );
            setFilteredKdramas(filtered);
        }
    }, [selectedCategory, kdramas]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div>
            <header className="border-b border-[#F5F5F5] px-4 md:px-12 py-3">
                <h1 className="font-roboto font-bold text-xl text-[#2E7D32] leading-8">K-Verse</h1>
            </header>

            <div className="mx-4 md:mx-12 mt-10 flex flex-row items-start md:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-roboto font-bold text-[#333]">Discover</h1>
                    <p className="text-[#A3A3A3] font-os text-base leading-normal md:w-[450px] mt-2">
                        Browse top-rated K-Dramas, new arrivals, and fan favorites to add to your watchlist.
                    </p>
                </div>

                <div className="">
                    <select
                        id="category-filter"
                        name="category-filter"
                        className="mt-2 px-4 py-2 outline-none border border-[#D1D1D1] rounded-lg w-full max-w-xs font-os text-[#333]"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Crime">Crime</option>
                        <option value="Drama">Drama</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Thriller">Thriller</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 px-4 md:px-12">
                {filteredKdramas.map((kdrama) => (
                    <Link to={`/kdrama/${kdrama.id}`} key={kdrama.id}>
                        <div className="relative cursor-pointer">
                            <img src={kdrama.poster} alt={kdrama.name} className="w-full h-auto rounded-lg" />
                            <div className="absolute bottom-2 right-2 bg-[#FFF8E1] text-[#f5d000] px-2 py-0.5 rounded-full text-md flex items-center space-x-1">
                                <StarIcon className="text-[#f5d000] h-4 w-4"/>
                                <span>0.0</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DiscoverPage;
