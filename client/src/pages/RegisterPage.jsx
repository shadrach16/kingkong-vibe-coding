import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Minimize, Square, X } from 'lucide-react';
import AuthLayout from '../components/common/layouts/AuthLayout';
import { toast } from 'react-hot-toast';
 
function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <title>Google Logo</title>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.673-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.452 0 20.704-8.794 20.916-20z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306 14.691L14.07 21.43l-2.072 2.083-7.766-6.745z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.001 1.761-4.757 2.795-7.219 2.795-4.404 0-8.044-3.04-9.358-7.108l-5.748 4.667C10.158 36.837 16.275 44 24 44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.673-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.452 0 20.704-8.794 20.916-20z"
        transform="translate(0 0)"
      ></path>
      <path
        fill="#FFC107"
        d="M12.955 24c0-2.457 0.992-4.697 2.607-6.338l-5.28-4.331C6.772 16.594 4 20.126 4 24z"
      ></path>
    </svg>
  );
}
 
const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex flex-col w-[450px] mx-auto my-12 mt-[8em] bg-gray-100 rounded-xl shadow-md  border border-gray-300 overflow-hidden font-sans align-center justify-center">
    <a href="/" className='w-full flex align-center mx-auto justify-center py-3 border-b' >  <svg width='60px' height='60px' viewBox="0 0 300 300" id="monkey3" version="1.1"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <circle cx="74" cy="82" r="32" 
        style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <circle cx="234" cy="82" r="32" 
              style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <circle cx="154" cy="138" r="88"     style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <path d=" M154,117.996C146.702,108.283,135.085,102,122,102c-22.091,0-40,17.909-40,40s17.909,40,40,40c13.085,0,24.702-6.283,32-15.996 c7.298,9.713,18.915,15.996,32,15.996c22.091,0,40-17.909,40-40s-17.909-40-40-40C172.915,102,161.298,108.283,154,117.996z"     style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <path d=" M154,258c22.091,0,40-17.909,40-40s-17.909-64-40-64s-40,41.909-40,64S131.909,258,154,258z" 
              style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#dedede",stroke:'#2a2222',strokeWidth:7.7333,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <path d=" M114,218c12.102,5.113,25.839,8,40.402,8c14.241,0,27.693-2.761,39.598-7.664" 
              style={{ fill:"none",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <circle cx="122" cy="134" r="8" 
          style={{fillRule:'evenodd',clipRule:'evenodd'}}></circle> <circle cx="190" cy="134" r="8"  style={{fillRule:'evenodd',clipRule:'evenodd'}}></circle> <path d=" M148.875,172.466c2.83-3.296,7.43-3.281,10.247,0l13.365,15.566c2.829,3.296,1.574,5.967-2.781,5.967h-31.415 c-4.365,0-5.597-2.687-2.781-5.967L148.875,172.466z" 
            style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#595959",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> </g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> </g></svg>

</a>
     
 
      {/* Main Content Panel */}
      <div className="flex-1 p-8 bg-white overflow-y-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm font-medium text-gray-500 mb-8">
            Get started for free
          </p>
        </div>
 
        <div className="space-y-4">
          <button
            className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <GoogleIcon className="h-5 w-5 mr-3" />
            <span>Sign up with Google</span>
          </button>
        </div>
 
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
 
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
          </div>
 
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>
 
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
 
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default RegisterPage;