
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="mx-4 md:mx-14">
        {/* Hero content */}
        <div className="flex flex-col md:flex-row">
            {/* Hero text */}
            <div className=''>
                <h1 className='text-4xl md:text-[54px] font-os font-bold text-gray-600 mt-4 md:mt-14 w-full md:w-[590px] leading-normal md:leading-snug'>Discover, Rate, and Connect!</h1>
                <p className='mt-6 md:mt-3 font-os font-normal w-full md:w-[516px] leading-relaxed text-lg text-gray-500'>Join the ultimate K-drama community. Share your thoughts, review your favorite series, and connect with fans around the globe.</p>
                <div className='mt-8 md:mt-6'>
                <Link to="">
                  <button type='button' className='bg-[#2E7D32] rounded-md text-center block md:inline font-lato text-white text-lg font-normal w-full md:w-fit px-7 py-3.5 hover:bg-primary-800'>Join the community!</button>
                </Link>
                {/* <Link to='/login'>
                  <button type='button' className='border border-primary-600 rounded-[10px] text-center block md:inline font-lato text-primary-600 text-[18px] font-normal w-full md:w-[190px] px-[30px] py-[14px] mt-4'>Review your CV</button>
                </Link> */}
                </div>
            </div>

            {/* Hero image */}
            <div className='w-12/12 md:w-12/12 md:ml-16 mt-8 md:mt-0 flex self-center'>
                <img className='w-full' src="" alt="" />
            </div>
        </div>
    </section>
  )
}

export default Hero