
import { Link } from "react-router-dom"
import ComingSoon from "../components/ComingSoon"
import BottomNavBar from "../components/BottomNavBar"

function HomePage() {
  return (
    <div>
        <header className="border-b sticky top-0 z-10 bg-[#fff] border-[#F5F5F5] px-4 md:px-12 lg:px-12 py-3 flex justify-between items-center">
            <Link to='/explore' className="font-roboto font-bold text-xl text-[#2e7d32] leading-8">
                K-Verse
            </Link>
        </header>

        {/* Main content */}
        <div className="mx-4 md:mx-12 mt-10">
          <ComingSoon />
        </div>

        {/* Bottom navbar */}
        <BottomNavBar />
    </div>
  )
}

export default HomePage