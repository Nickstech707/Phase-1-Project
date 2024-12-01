import React, { useState, useEffect, useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { loadAllFromIndexedDB } from '../utils/indexedDB';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import JobOpeningsDialog from './JobOpeningsDialog';

const COMPANIES_PER_PAGE = 12;

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const processCompanies = useCallback((jobs) => {
    const companyMap = new Map();

    jobs.forEach(job => {
      if (!companyMap.has(job.company_name)) {
        companyMap.set(job.company_name, {
          name: job.company_name,
          logo: job.company_logo || '/api/placeholder/400/300',
          industry: job.category,
          location: job.location || 'Remote',
          openPositions: 1,
          jobs: [job],
          latestJobDate: new Date(job.publication_date)
        });
      } else {
        const company = companyMap.get(job.company_name);
        company.openPositions += 1;
        company.jobs.push(job);
        
        // Update industry if different
        if (!company.industry.includes(job.category)) {
          company.industry = `${company.industry}, ${job.category}`;
        }
        
        const jobDate = new Date(job.publication_date);
        if (jobDate > company.latestJobDate) {
          company.latestJobDate = jobDate;
        }
      }
    });

    return Array.from(companyMap.values())
      .map(company => ({
        ...company,
        description: `Hiring for ${company.industry}`
      }))
      .sort((a, b) => b.latestJobDate - a.latestJobDate);
  }, []);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const jobs = await loadAllFromIndexedDB();
        
        if (!jobs?.length) {
          setError('No jobs data available. Please fetch jobs first.');
          setCompanies([]);
          return;
        }

        const processedCompanies = processCompanies(jobs);
        setCompanies(processedCompanies);
        setError(null);
      } catch (err) {
        setError('Error loading companies. Please try again.');
        console.error('Error loading companies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [processCompanies]);

  const handleViewOpenings = (company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCompany(null);
  };

  // Paginate companies
  const paginatedCompanies = companies.slice(
    (currentPage - 1) * COMPANIES_PER_PAGE,
    currentPage * COMPANIES_PER_PAGE
  );
  const totalPages = Math.ceil(companies.length / COMPANIES_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-8 flex justify-center items-start">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 md:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Top Remote Companies</h1>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : paginatedCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No companies available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCompanies.map((company) => (
                <div
                  key={company.name}
                  className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 
                           hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 bg-white rounded-full p-2">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                          e.target.classList.add('error-img');
                        }}
                      />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-white text-center">
                    {company.name}
                  </h2>

                  <p className="text-gray-300 mb-4 text-center line-clamp-2 flex-grow">
                    {company.description}
                  </p>

                  <div className="text-sm text-gray-400 space-y-2 mb-3">
                    <p className="line-clamp-2">
                      <span className="font-medium">Industry:</span>{' '}
                      {company.industry}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {company.location}
                    </p>
                    <p>
                      <span className="font-medium">Open Positions:</span>{' '}
                      {company.openPositions}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleViewOpenings(company)}
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded 
                               hover:bg-emerald-700 transition-colors duration-200"
                    >
                      View {company.openPositions} Opening{company.openPositions !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
  <div className="mt-8 flex justify-center items-center space-x-2 pb-28">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                transition-colors duration-200 disabled:opacity-50"
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
                ? 'bg-emerald-600 text-white' 
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
                transition-colors duration-200 disabled:opacity-50"
    >
      <ChevronRight className="w-5 h-5 text-white" />
    </button>
  </div>
)}
          </>
        )}
      </div>

      <JobOpeningsDialog 
        company={selectedCompany}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}

export default React.memo(Companies);