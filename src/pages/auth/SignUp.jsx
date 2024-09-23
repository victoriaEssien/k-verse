
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { auth } from "../../firebase_setup/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to handle password visibility toggle
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with email and password in firebase
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setError('');
      navigate('/login');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mx-4 md:mx-12 mt-6">
        <h1 className="text-3xl md:text-4xl font-roboto font-bold text-[#333] text-center leading-normal">Create an account on <span className="text-[#2E7D32]">K-Verse</span></h1>
        <p className="text-[#A3A3A3] text-center mx-auto font-os text-base md:w-[460px] leading-normal mt-2">Explore top-rated K-Dramas, track your favorites, and stay updated with the latest releases.</p>

        <div className="mt-10">
          <form className="w-full md:w-fit mx-auto">
            {/* Email Input */}
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="font-lato mx-auto w-full md:w-full block rounded-lg border border-[#D1D1D1] px-4 py-3 text-base text-[#333] placeholder:text-[#ccc] outline-[#2E7D32] '" placeholder="Email address" />
              {/* {emailError && <p className='text-sm text-red-500 mt-1'>{emailError}</p>} */}
            </div>

            {/* Password Input */}
            <div className='relative mt-4'>
                <div className='flex items-center'>
                    <input type={showPassword ? 'text' : 'password'} name='password' id='password' className="font-lato mx-auto w-[360px] md:w-full block rounded-lg border border-[#D1D1D1] px-4 py-3 text-base text-[#333] placeholder:text-[#ccc] outline-[#2E7D32] '" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type='button' className='absolute text-base font-montserrat right-0 px-4 py-3' onClick={handlePasswordVisibility}>{showPassword ? <EyeIcon className="h-6 w-6 text-[#b3b3b3]" /> : <EyeSlashIcon className="h-6 w-6 text-[#b3b3b3]" />}</button>
                </div>
                {/* {passwordError && <p className='text-sm text-red-500 mt-1'>{passwordError}</p>} */}
                
                <p className="font-lato text-[#b3b3b3] text-sm w-full mt-2 leading-relaxed">Your password must contain an uppercase letter, a lowercase letter, special characters, and digits.</p>
            </div>

             {/* Create Account Button */}
             <div className="mt-10 text-center">
                <button type="submit" disabled={loading} className="font-os font-medium text-[#fff] text-lg bg-[#2E7D32] hover:bg-[#29702d] mx-auto w-full rounded-lg px-10 py-3.5">{loading ? 'Creating Account...' : 'Create Account'}</button>
                <p className='my-8 text-base font-os text-[#333]'>Already have an account? <span className='text-base font-os font-semibold text-[#2E7D32]'><Link to='/login'>Log in</Link></span></p>
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp