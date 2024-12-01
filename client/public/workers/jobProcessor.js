
self.onmessage = function(e) {
    const jobs = e.data;
    
    const processedJobs = jobs.map(job => ({
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
    }));
  
    self.postMessage(processedJobs);
  };