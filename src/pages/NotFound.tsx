import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-purple-500/20 blur-sm">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best cricketers miss sometimes!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              to="/"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Home size={20} />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
              <Search size={20} />
              <span>Looking for something specific?</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/home" className="text-purple-400 hover:text-purple-300 underline">
                Dashboard
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/login" className="text-purple-400 hover:text-purple-300 underline">
                Login
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/" className="text-purple-400 hover:text-purple-300 underline">
                Home
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFound;