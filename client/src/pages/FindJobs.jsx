import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import JobList from '../components/JobList';
import { saveDataInChunks, loadAllFromIndexedDB, clearIndexedDB } from '../utils/indexedDB';
import { useDebounce } from '../hooks/UseDebounce'

const CACHE_DURATION = 30 * 60 * 1000;
const API_REFRESH_INTERVAL = 5 * 60 * 1000;
const JOBS_PER_PAGE = 12;

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('All');
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef(null);
  const dataLoaded = useRef(false);

  // Debounce search input
  const debouncedFilter = useDebounce(filter, 300);

  const isCacheValid = useCallback(() => {
    return lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION);
  }, [lastFetchTime]);

  const loadFromCache = useCallback(async () => {
    if (dataLoaded.current) return true;
    
    try {
      const cachedData = await loadAllFromIndexedDB();
      if (cachedData?.length > 0) {
        setJobs(cachedData);
        setLastFetchTime(Date.now());
        setLoading(false);
        dataLoaded.current = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Cache load failed:', error);
      return false;
    }
  }, []);

  const processJob = useCallback((job) => ({
    id: job.id.toString(),
    title: job.title,
    company_name: job.company_name,
    category: job.category,
    url: job.url,
    company_logo: job.company_logo_url || job.company_logo || '/api/placeholder/400/300',
    salary: job.salary,
    job_type: job.job_type,
    publication_date: job.publication_date,
    description: job.description,
    location: job.candidate_required_location || 'Remote',
    tags: job.tags || [],
  }), []);

  const processJobsData = useCallback(async (jobsData) => {
    if (window.Worker) {
      return new Promise((resolve) => {
        const worker = new Worker('/workers/jobProcessor.js');
        worker.postMessage(jobsData);
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
      });
    }

    return jobsData.map(processJob);
  }, [processJob]);

  const saveToCache = useCallback(async (jobsData) => {
    try {
      await clearIndexedDB();
      await saveDataInChunks(jobsData);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Cache save failed:', error);
    }
  }, []);

  const fetchJobs = useCallback(async (force = false) => {
    if (!force && isCacheValid()) {
      if (await loadFromCache()) return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://remotive.com/api/remote-jobs', {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const processedJobs = await processJobsData(data.jobs);
      
      setJobs(processedJobs);
      await saveToCache(processedJobs);
      dataLoaded.current = true;
      
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      setError('Failed to fetch jobs. Using cached data if available.');
      if (!await loadFromCache()) {
        setError('Failed to fetch jobs and no cached data available.');
      }
    } finally {
      setLoading(false);
    }
  }, [isCacheValid, loadFromCache, processJobsData, saveToCache]);


  useEffect(() => {
    fetchJobs();
    
    const interval = setInterval(() => fetchJobs(true), API_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchJobs]);

  // Get unique categories from jobs
  const uniqueCategories = React.useMemo(() => {
    return [...new Set(jobs.map(job => job.category))].sort();
  }, [jobs]);

  const filteredJobs = React.useMemo(() => {
    const searchTerm = debouncedFilter.toLowerCase();
    return searchTerm === '' && category === 'All' 
      ? jobs
      : jobs.filter(job => {
          const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company_name.toLowerCase().includes(searchTerm) ||
            (job.description && job.description.toLowerCase().includes(searchTerm));
          return matchesSearch && (category === 'All' || job.category === category);
        });
  }, [jobs, debouncedFilter, category]);

  const paginatedJobs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Find Remote Jobs</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchJobs(true)}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              title="Refresh jobs"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                        text-gray-200 placeholder-gray-400
                        focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        transition-all duration-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg
                      text-gray-200 sm:w-47
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                      transition-all duration-200"
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

{loading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
) : (
  <>
    <JobList jobs={paginatedJobs} />
    {totalPages > 1 && (
      <div className="mt-8 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                    transition-colors duration-200 disabled:opacity-50 
                    flex items-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg transition-colors duration-200
                  ${currentPage === pageNum 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-1 text-gray-400">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 
                          text-gray-400 transition-colors duration-200"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                    transition-colors duration-200 disabled:opacity-50 
                    flex items-center"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    )}
  </>
)}
      </div>
    </div>
  );
};

export default React.memo(FindJobs);