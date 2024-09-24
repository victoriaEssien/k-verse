
import { Link } from 'react-router-dom';

function ComingSoon({ heading, description, showButton = true }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl md:text-4xl font-roboto font-bold text-[#333]">{heading}</h1>
      <p className="text-base font-os text-[#888888] mt-4 mx-auto w-full md:w-3/6">{description}</p>
      {showButton && (
        <Link to="/feedback" className="block mt-8 bg-[#2E7D32] text-[#fff] font-os text-base font-medium px-4 py-3 w-full md:w-1/5 rounded-lg hover:bg-[#29702d]">
          Let us know
        </Link>
      )}
    </div>
  );
}

export default ComingSoon;
