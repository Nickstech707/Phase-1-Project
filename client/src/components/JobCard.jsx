import React, { useState } from 'react';
import JobDetailsDialog from '../pages/JobDetailsDialog';

const JobCard = ({ job }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700 flex flex-col">
      <div className="p-6 space-y-4 flex-grow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg p-2">
            {!imageError ? (
              <img
                src={job.company_logo_url || job.company_logo}
                alt={`${job.company_name} logo`}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              <img
                src="/api/placeholder/400/300"
                alt="Company placeholder"
                className="w-full h-full object-contain opacity-50"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white">{job.title}</h3>
            <span className="text-sm text-gray-300">{job.company_name}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 text-xs rounded-full border border-emerald-700">
            {job.category}
          </span>
          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-700">
            Remote
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <div>{job.candidate_required_location}</div>
          {job.salary && <div>{job.salary}</div>}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full mb-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View Details
        </button>
      </div>

      <JobDetailsDialog 
        job={job} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
};

export default JobCard;