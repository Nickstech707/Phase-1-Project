import React from 'react';
import { X, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

const JobDetailsDialog = ({ job, isOpen, onClose }) => {
  if (!job || !isOpen) return null;

  // Format publication date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return null;
    if (typeof salary === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(salary);
    }
    return salary;
  };

  // Format job type
  const formatJobType = (type) => {
    if (!type) return null;
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Process description text to handle formatting
  const processDescription = (description) => {
    if (!description) return { __html: 'No description available' };
    
    // Convert markdown-style bold text to proper HTML
    let processedHtml = description
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
      // Remove any existing underline styles
      .replace(/<u>/g, '<span>')
      .replace(/<\/u>/g, '</span>')
      // Convert bullet points to properly styled list items
      .replace(/\* (.*?)(?:\n|$)/g, '<li class="ml-4">$1</li>')
      // Basic XSS protection
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // Wrap list items in ul tags
    if (processedHtml.includes('<li')) {
      processedHtml = processedHtml.replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc ml-4 space-y-2">$&</ul>');
    }

    return { __html: processedHtml };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full h-full sm:max-w-full sm:w-full sm:h-full">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-3xl leading-6 font-bold text-white" id="modal-title">
                    {job.title || 'Job Title Not Available'}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white rounded-full p-1 border border-gray-200">
                        <img
                          src={job.company_logo || '/api/placeholder/400/300'}
                          alt={job.company_name || 'Company Logo'}
                          className="w-full h-full object-contain rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/300';
                          }}
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-300">
                        {job.company_name || 'Company Name Not Available'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location || 'Location Not Specified'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(job.publication_date)}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                      )}
                      {job.job_type && (
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{formatJobType(job.job_type)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h5 className="text-lg font-semibold mb-2 text-gray-300">Description</h5>
                      <div
                        className="text-gray-200 space-y-4"
                        dangerouslySetInnerHTML={processDescription(job.description)}
                      />
                    </div>

                    {job.tags && job.tags.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-lg font-semibold mb-2 text-gray-300">Tags</h5>
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-transform transform hover:scale-105"
              >
                Apply for this job
              </a>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-transform transform hover:scale-105"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsDialog;