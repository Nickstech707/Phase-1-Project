import React from 'react';
import { X, Calendar, MapPin, Currency, Clock } from 'lucide-react';

const JobOpeningsDialog = ({ company, isOpen, onClose }) => {
  if (!company || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-hide" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-gray-900 text-gray-100 rounded-lg shadow-xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full p-1">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold">{company.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-300">{company.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Open Positions ({company.jobs.length})</h3>
              {company.jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-emerald-400">{job.title}</h4>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                    >
                      Apply
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(job.publication_date).toLocaleDateString()}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <Currency size={16} />
                        {job.salary}
                      </div>
                    )}
                    {job.job_type && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.job_type}
                      </div>
                    )}
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobOpeningsDialog);