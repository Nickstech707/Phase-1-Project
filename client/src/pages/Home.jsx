import { useState } from 'react';
import { ReactTyped } from 'react-typed';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import SubscribeForm from '../components/SubscribeForm';
import SearchBox from '../components/SearchBox';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://remotive.io/api/remote-jobs');
      const data = await response.json();
      const matchingJobs = data.jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setJobs(matchingJobs);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching remote jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  const handleViewCompanies = () => {
    navigate('/companies');
  };

  const features = [
    {
      icon: '🌍',
      title: 'Global Opportunities',
      description: 'Access remote jobs from companies worldwide'
    },
    {
      icon: '💼',
      title: 'Verified Companies',
      description: 'All jobs are from verified and trusted employers'
    },
    {
      icon: '🚀',
      title: 'Career Growth',
      description: 'Find roles that match your career aspirations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-emerald-500">
              <ReactTyped
                strings={[
                  'Find Your Perfect ',
                  '<span class="text-emerald-400">Remote Job</span>',
                ]}
                typeSpeed={50}
                backSpeed={30}
                loop
              />
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Discover thousands of remote opportunities from top companies worldwide. 
              Your next career move is just a click away.
            </p>
            
            <SearchBox onSearch={handleSearch} />

            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={handleBrowseJobs}
                className="px-6 sm:px-8 py-3 text-sm sm:text-base bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                Browse Jobs
              </button>
              <button 
                onClick={handleViewCompanies}
                className="px-6 sm:px-8 py-3 text-sm sm:text-base bg-gray-800 text-emerald-400 rounded-full border-2 border-emerald-500 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                View Companies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-emerald-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-emerald-100">Remote Jobs</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Companies</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-emerald-500">Stay Updated with New Opportunities</h2>
          <SubscribeForm />
        </div>
      </div>

      {/* Job Search Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full">
                <div className="p-4 border-b flex justify-between items-center bg-emerald-500 text-white rounded-t-lg">
                  <h2 className="text-2xl font-semibold">Search Results</h2>
                  <button 
                    onClick={() => setShowResults(false)}
                    className="text-white hover:text-emerald-100 transition-colors duration-200"
                  >
                    <span className="text-3xl">×</span>
                  </button>
                </div>
                <div className="p-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                      <p className="mt-4 text-gray-400">Loading jobs...</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {jobs.map((job, index) => (
                        <JobCard key={index} job={job} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
