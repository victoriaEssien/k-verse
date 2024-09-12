function DiscoverPage() {
    return (
      <div>
          <header className="border-b border-[#F5F5F5] px-4 md:px-12 py-3">
              <h1 className="font-roboto font-bold text-xl text-[#2E7D32] leading-8">K-Verse</h1>
          </header>
  
          <div className="mx-4 md:mx-12 mt-10 flex flex-row items-start md:items-center justify-between">
              <div>
                  <h1 className="text-4xl font-roboto font-bold text-[#333]">Discover</h1>
                  <p className="text-[#A3A3A3] font-os text-base leading-normal md:w-[450px] mt-2">Browse top-rated K-Dramas, new arrivals, and fan favorites to add to your watchlist.</p>
              </div>
  
              <div className="">
                  <select
                      id="category-filter"
                      name="category-filter"
                      className="mt-2 px-4 py-2 outline-none border border-[#D1D1D1] rounded-lg w-full max-w-xs font-os text-[#333]"
                  >
                      <option value="">All Categories</option>
                      <option value="romance">Romance</option>
                      <option value="action">Action</option>
                      <option value="comedy">Comedy</option>
                      <option value="drama">Drama</option>
                      <option value="thriller">Thriller</option>
                      {/* Add more options as needed */}
                  </select>
              </div>
          </div>
      </div>
    )
  }
  
  export default DiscoverPage
  