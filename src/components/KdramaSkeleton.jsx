

function KdramaSkeleton() {
  return (
    <div className="relative cursor-pointer border border-[#F5F5F5] rounded-lg animate-pulse">
        <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
        <div className="absolute bottom-2 right-2 bg-gray-400 text-[#fff] px-3 py-1 rounded-full text-md flex items-center gap-x-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
            <span className="block h-4 w-8 bg-gray-300"></span>
        </div>
    </div>
  )
}

export default KdramaSkeleton