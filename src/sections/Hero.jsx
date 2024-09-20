
import { Link } from "react-router-dom"
import HeroImg from "../assets/images/hero-img.png"

function Hero() {
  return (
    <section className="mx-4 md:mx-14">
        {/* Hero content */}
        <div className="flex flex-col md:flex-row gap-0">
            {/* Hero text */}
            <div className=''>
                <h1 className='text-4xl md:text-[54px] font-roboto font-bold text-gray-600 mt-4 md:mt-14 w-full md:w-[590px] leading-normal md:leading-snug'>Discover, Rate, and Connect!</h1>
                <p className='mt-6 md:mt-3 font-os font-normal w-full md:w-[516px] leading-relaxed text-lg text-gray-500'>Join our growing community! Share your thoughts, manage your kdrama watchlist, review your favorite series, and connect with fans around the globe.</p>
                <div className='mt-8 md:mt-6 flex flex-col md:flex-row lg:flex-row gap-x-3 gap-y-4'>
                <Link to='signup'>
                  <button type='button' className='bg-[#2E7D32] rounded-md font-os text-center block md:inline font-lato text-white text-lg font-normal w-full md:w-fit px-7 py-3.5 hover:bg-primary-800'>Get started!</button>
                </Link>
                <Link to='/discover'>
                  <button type='button' className='border border-[#2E7D32] rounded-md font-os text-center block md:inline font-lato text-[#2E7D32] text-[18px] font-normal w-full md:w-fit px-7 py-3.5'>Explore Kdramas</button>
                </Link>
                </div>
            </div>

            {/* Hero image */}
            <div className='w-12/12 md:w-12/12 mt-8 md:mt-0 flex self-center'>
                <img className='w-full' src={HeroImg} alt="Collection of kdrama poster images from Etsy designed by Pierceyourheart" />
            </div>
        </div>
    </section>
  )
}

export default Hero