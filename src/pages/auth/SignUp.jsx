
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { auth, db } from "../../firebase_setup/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Function to handle password visibility toggle
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setTimeout(() => setEmailError(''), 3000);
    } else {
      setEmailError('');
    }
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Please enter a valid password'
      );
      setTimeout(() => setPasswordError(''), 3000);
    } else {
      setPasswordError('');
    }
  };

  // Function to handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate before submitting
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError || !email || !password) {
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password in firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Default profile values
      const defaultProfilePic = "https://firebasestorage.googleapis.com/v0/b/k-verse-7e64e.appspot.com/o/pfps%2Fdefaultpfp.png?alt=media&token=33792516-8689-423f-bf20-6dc47a6460e4";
      const defaultDisplayName = `User${user.uid.substring(0, 6)}`;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: defaultDisplayName,
        profilePicture: defaultProfilePic,
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      setError('');

      // Display a success toast message
      toast.success('Sign up successful! Redirecting...', {
        // position: "top-right",
        // autoClose: 5000,
        // hideProgressBar: false,
        // closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
        // progress: undefined,
      });


      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login')
      }, 3000);

    } catch (error) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        toast.error('This email address is already registered. Please log in instead.');
      } else {
        toast.error('An error occurred while trying to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mx-4 md:mx-12 mt-6">
        <h1 className="text-3xl md:text-4xl font-roboto font-bold text-[#333] text-center leading-normal">Create an account on <span className="text-[#2E7D32]">K-Verse</span></h1>
        <p className="text-[#A3A3A3] text-center mx-auto font-os text-base md:w-[460px] leading-normal mt-3">Explore top-rated K-Dramas, track your favorites, and stay updated with the latest releases.</p>

        <div className="mt-10 mx-auto md:w-[400px]">
          <form className="w-full mx-auto" onSubmit={handleSignUp}>
            {/* Email Input */}
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => validateEmail(email)} className="font-lato mx-auto w-full md:w-full block rounded-lg border border-[#D1D1D1] px-4 py-3 text-base text-[#333] placeholder:text-[#ccc] outline-[#2E7D32] '" placeholder="Email address" />
              {emailError && <p className='text-sm text-red-500 mt-1'>{emailError}</p>}
            </div>

            {/* Password Input */}
            <div className='relative mt-4'>
                <div className='flex items-center'>
                    <input type={showPassword ? 'text' : 'password'} name='password' id='password' className="font-lato mx-auto w-full block rounded-lg border border-[#D1D1D1] px-4 py-3 text-base text-[#333] placeholder:text-[#ccc] outline-[#2E7D32] '" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => validatePassword(password)} />
                    <button type='button' className='absolute text-base font-montserrat right-0 px-4 py-3' onClick={handlePasswordVisibility}>{showPassword ? <EyeIcon className="h-6 w-6 text-[#b3b3b3]" /> : <EyeSlashIcon className="h-6 w-6 text-[#b3b3b3]" />}</button>
                </div>
                {passwordError && <p className='text-sm text-red-500 mt-1'>{passwordError}</p>}
                
                <p className="font-lato text-[#b3b3b3] text-sm w-full mt-2 leading-relaxed">Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.</p>
            </div>

             {/* Create Account Button */}
             <div className="mt-10 text-center">
                <button type="submit" disabled={loading || emailError || passwordError} className={`font-os font-medium text-[#fff] text-lg bg-[#2E7D32] hover:bg-[#29702d] mx-auto w-full rounded-lg px-10 py-3.5 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{loading ? 'Creating Account...' : 'Create Account'}</button>
                <p className='my-8 text-base font-os text-[#333]'>Already have an account?{' '} <span className='text-base font-os font-semibold text-[#2E7D32]'><Link to='/login'>Log in</Link></span></p>
              </div>
          </form>
        </div>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  )
}

export default SignUp