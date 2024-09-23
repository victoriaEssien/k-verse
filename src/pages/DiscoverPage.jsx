import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase_setup/firebase";
import { collection, getDocs } from "firebase/firestore";
import { StarIcon } from "@heroicons/react/16/solid";
import ScrollToTop from "react-scroll-to-top";
import KdramaSkeleton from "../components/KdramaSkeleton";

function DiscoverPage() {
    const [kdramas, setKdramas] = useState([]);
    const [filteredKdramas, setFilteredKdramas] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // Search state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKdramas = async () => {
            try {
                const kdramaCollection = collection(db, "kdramas");
                const kdramaSnapshot = await getDocs(kdramaCollection);
                const kdramaList = kdramaSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const shuffledKdramaList = kdramaList.sort(() => Math.random() - 0.5);

                setKdramas(shuffledKdramaList);
                setFilteredKdramas(shuffledKdramaList); // Initially, show all kdramas
                setLoading(false);
            } catch (error) {
                console.error("Error fetching kdramas:", error);
                setLoading(false);
            }
        };

        fetchKdramas();
    }, []);

    useEffect(() => {
        let updatedKdramas = kdramas;

        if (selectedCategory !== "") {
            updatedKdramas = updatedKdramas.filter(kdrama =>
                kdrama.tags.includes(selectedCategory)
            );
        }

        if (searchQuery) {
            updatedKdramas = updatedKdramas.filter(kdrama =>
                kdrama.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredKdramas(updatedKdramas);
    }, [selectedCategory, searchQuery, kdramas]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div>
            <header className="border-b sticky top-0 z-10 bg-[#fff] border-[#F5F5F5] px-4 md:px-12 lg:px-12 py-3 flex justify-between items-center">
                <Link to='/discover' className="font-roboto font-bold text-xl text-[#2e7d32] leading-8">
                    K-Verse
                </Link>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search K-Dramas by name..."
                    className="px-4 py-2 border border-[#D1D1D1] rounded-lg max-w-xs w-4/6 md:w-full font-os text-[#333] outline-[#2E7D32]"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
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
                        <option value="Family">Family</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Politics">Politics</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Thriller">Thriller</option>
                        <option value="War">War</option>
                    </select>
                </div>
            </div>

            {/* Grid for Kdramas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 px-4 md:px-12">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => <KdramaSkeleton key={index} />)
                ) : (
                    filteredKdramas.map((kdrama) => (
                        <Link to={`/kdrama/${kdrama.id}`} key={kdrama.id}>
                            <div className="relative cursor-pointer border border-[#F5F5F5] rounded-lg">
                                <img src={kdrama.poster} alt={kdrama.name} className="w-full h-auto rounded-lg" />
                                <div className="absolute bottom-2 right-2 bg-[#2E7D32] text-[#fff] px-3 py-1 rounded-full text-md flex items-center gap-x-2">
                                    <StarIcon className="text-[#fff] h-4 w-4" />
                                    <span className="font-os font-medium">0.00</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <ScrollToTop
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px' }}
                smooth
                color="#2E7D32"
            />
        </div>
    );
}

export default DiscoverPage;
