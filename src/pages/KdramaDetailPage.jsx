import { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase_setup/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import BottomNavBar from "../components/BottomNavBar";

function SkeletonLoader() {
  return (
    <div className="mx-4 md:mx-12 my-10 flex flex-col md:flex-row animate-pulse">
      <div className="md:w-2/6">
        <div className="bg-gray-300 h-64 rounded-lg mx-auto"></div>
      </div>
      <div className="md:w-1/2 md:pl-8 mt-10 md:mt-0">
        <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>
        <div className="bg-gray-300 h-4 w-2/4 rounded mb-2"></div>
        <div className="bg-gray-300 h-4 w-1/3 rounded mb-4"></div>
        <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-300 h-4 w-1/3 rounded mb-2"></div>
      </div>
    </div>
  );
}

function KdramaDetailPage() {
  const { id } = useParams(); // Get the K-drama ID from the URL
  const [kdrama, setKdrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    list: "",
    thoughts: "",
  });
  const auth = getAuth();


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
    return <SkeletonLoader />;
  }

  if (!kdrama) {
    return <p>K-Drama not found.</p>;
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    // Clear the form fields after on close
    setFormData({
      status: "",
      list: "",
      thoughts: "",
    });
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.status || !formData.list) {
      toast.error("Please fill in the required fields");
      return false;
    }
    return true;
  };

  // Submit handler for the form
  const handleSubmit = async (e) => {
    const user = auth.currentUser;
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoadingSubmit(true);

    try {
      const userWatchlistDoc = doc(db, "users", user.uid, "watchlist", id); // Reference to the user’s watchlist
      await setDoc(userWatchlistDoc, {
        kdramaId: id,
        status: formData.status,
        list: formData.list,
        thoughts: formData.thoughts,
        addedAt: new Date(),
      });

      toast.success(`${kdrama.name} has been added to your list`);

      // Clear the form fields after success
      setFormData({
        status: "",
        list: "",
        thoughts: "",
      });
      
    } catch (error) {
      toast.error("Failed to add to watchlist");
      console.error("Error adding K-drama to watchlist: ", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="">
      <header className="border-b border-[#F5F5F5] px-4 md:px-12 py-3">
        <Link to='/explore' className="font-roboto font-bold text-xl text-[#2E7D32] leading-8">K-Verse</Link>
      </header>

      <div className="mx-4 md:mx-12 my-10 flex flex-col md:flex-row">
        <div className="md:w-2/6">
          <img src={kdrama.poster} alt={kdrama.name} className="w-full md:w-10/12 rounded-lg mx-auto" />
        </div>

        <div className="md:w-1/2 md:pl-8 mt-10 md:mt-0">
          <h1 className="text-3xl font-bold font-roboto text-[#2E7D32]">{kdrama.name} ({kdrama.year}) </h1>
          <p className="text-[#888] font-os text-base leading-normal mt-4">{kdrama.plot}</p>

          {/* Drama details */}
          <div className="mt-6 flex flex-col gap-y-6">
            <div>
              <h3 className="text-base font-medium font-roboto text-[#999999]">Seasons</h3>
              <p className="text-[17px] font-os text-[#333]">{kdrama.seasons}</p>
            </div>

            <div>
              <h3 className="text-base font-medium font-roboto text-[#999999]">Episodes</h3>
              <p className="text-[17px] font-os text-[#333]">{kdrama.episodes}</p>
            </div>

            <div>
              <h3 className="text-base font-medium font-roboto text-[#999999]">Status</h3>
              <p className="text-[17px] font-os text-[#333]">{kdrama.status}</p>
            </div>

            <div>
            <h2 className="text-base font-medium font-roboto text-[#999999]">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {kdrama.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3.5 py-2 bg-[#F5F5F5] font-os text-[#333] text-md rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          </div>

          {/* Add to watchlist btn */}
          <div className="mt-8">
            <button className="font-os font-medium text-[#fff] text-lg bg-[#2E7D32] hover:bg-[#29702d] mx-auto w-full rounded-lg px-10 py-3.5" onClick={handleModalOpen}>Add to My List</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div>
        {/* Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black-1000 bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-md transform overflow-hidden bg-[#fff] rounded-lg p-6 text-left align-middle shadow-xl transition-all">
                        <div className="flex justify-end">
                            <button className="rounded-full p-1 hover:bg-[#ECF8ED]" onClick={handleModalClose}>
                            <XMarkIcon className="h-6 w-6 text-[#2E7D32]" />
                            </button>
                        </div>
                        <DialogTitle as="h3" className="text-2xl font-bold font-roboto text-[#2E7D32]">
                            {kdrama.name} ({kdrama.year})
                        </DialogTitle>
                        <div className="mt-3">
                          <form>
                            {/* Status dropdown */}
                            <div className="mt-6">
                              <label htmlFor="status" className="block text-sm font-os font-medium text-[#333]">
                                Status
                              </label>
                              <select
                                id="status"
                                name="status"
                                className="mt-2 block w-full px-4 py-3 text-base font-os border border-[#D1D1D1] outline-none sm:text-sm rounded-lg"
                                value={formData.status}
                                onChange={handleChange}
                              >
                                <option value="">Select Status</option>
                                <option value="Currently Watching">Currently Watching</option>
                                <option value="Plan to Watch">Plan to Watch</option>
                                <option value="Dropped">Dropped</option>
                                <option value="On-Hold">On-Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Rewatching">Rewatching</option>
                              </select>
                            </div>

                            {/* List dropdown */}
                            <div className="mt-6">
                              <label htmlFor="list" className="block text-sm font-os font-medium text-[#333]">
                                List
                              </label>
                              <select
                                id="list"
                                name="list"
                                className="mt-3 block w-full px-4 py-3 font-os text-base border border-[#D1D1D1] outline-none sm:text-sm rounded-lg"
                                value={formData.list}
                                onChange={handleChange}
                              >
                                <option value="">Select List</option>
                                <option value="Private List">Private List</option>
                                <option value="Default List">Default List</option>
                              </select>
                            </div>

                            {/* Thoughts textarea */}
                            <div className="mt-6">
                              <label htmlFor="thoughts" className="block text-sm font-os font-medium text-[#333]">
                                Thoughts (optional):
                              </label>
                              <textarea
                                id="thoughts"
                                name="thoughts"
                                rows="3"             
                                className="mt-3 block w-full px-4 py-3 sm:text-sm border border-[#D1D1D1] outline-none rounded-lg resize-none"
                                placeholder="Share your thoughts..."
                                value={formData.thoughts}
                                onChange={handleChange}
                              />
                            </div>

                            {/* Submit and Cancel buttons */}
                            <div className="mt-10 flex flex-col gap-y-4 md:flex-row md:justify-end md:space-x-4">
                              <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-primary-600 bg-lightgray-100 px-8 py-3 text-sm font-os font-medium text-primary-600"
                                onClick={handleModalClose}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex justify-center px-8 py-3 text-sm font-os font-medium text-[#fff] bg-[#2E7D32] hover:bg-[#29702d] mx-auto w-full md:w-fit rounded-lg"
                                disabled={loadingSubmit} 
                                onClick={handleSubmit}
                              >
                                {loadingSubmit ? "Adding..." : "Add to My List"}
                              </button>
                            </div>
                          </form>
                        </div>
                        </DialogPanel>
                    </TransitionChild>
                    </div>
                </div>
                </Dialog>
            </Transition>
      </div>
      {/* Toast container */}
      <ToastContainer />
      {/* <BottomNavBar /> */}
    </div>
  );
}

export default KdramaDetailPage;
