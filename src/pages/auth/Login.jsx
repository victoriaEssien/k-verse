
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { auth } from "../../firebase_setup/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Login() {

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

  // Generate a random token
  const generateAccessToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < characters.length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  // Function to handle form submission
  const handleLogin = async (e) => {
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
      // sign in user with email and password in firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate access token and store it in a cookie with a 7-day expiration
      const accessToken = generateAccessToken();
      Cookies.set('k-verse-access-token', accessToken, { expires: 7 });

      setLoading(false);
      setError('');

      // Display a success toast message
      toast.success('Login successful! Redirecting...', {
        // position: "top-right",
        // autoClose: 5000,
        // hideProgressBar: false,
        // closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
        // progress: undefined,
      });
      
      // Redirect to discover page after a short delay
      setTimeout(() => {
        navigate('/explore')
      }, 3000);

    } catch (error) {
      if (error.message === 'Firebase: Error (auth/invalid-credential).') {
        toast.error('The email address or password you entered is incorrect. Please try again.');
      } else {
        toast.error('An error occurred while trying to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mx-4 md:mx-12 mt-6">
        <h1 className="text-3xl md:text-4xl font-roboto font-bold text-[#333] text-center leading-normal">Login to your <span className="text-[#2E7D32]">K-Verse </span>account</h1>
        <p className="text-[#A3A3A3] text-center mx-auto font-os text-base md:w-[460px] leading-normal mt-3">Sign in to continue your K-drama journey, manage your watchlist, and discover new fan favorites.</p>

        <div className="mt-10 mx-auto md:w-[400px]">
          <form className="w-full mx-auto" onSubmit={handleLogin}>
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
            </div>

             {/* Login Button */}
             <div className="mt-10 text-center">
                <button type="submit" disabled={loading || emailError || passwordError} className={`font-os font-medium text-[#fff] text-lg bg-[#2E7D32] hover:bg-[#29702d] mx-auto w-full rounded-lg px-10 py-3.5 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{loading ? 'Logging In...' : 'Log In'}</button>
                <p className='my-8 text-base font-os text-[#333]'>Don&apos;t have an account?{' '} <span className='text-base font-os font-semibold text-[#2E7D32]'><Link to='/signup'>Sign up</Link></span></p>
              </div>
          </form>
        </div>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  )
}

export default Login