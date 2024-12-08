import { saveDataInChunks, loadAllFromIndexedDB, clearIndexedDB } from '../utils/indexedDB.js';

const CACHE_DURATION = 10 * 60 * 1000; 

class JobPrefetchService {
  constructor() {
    this.lastFetchTime = null;
    this.isLoading = false;
    this.initialLoadPromise = null;
  }

  async processJobsData(jobsData) {
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

    return jobsData.map(job => ({
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
  }

  isCacheValid() {
    return this.lastFetchTime && (Date.now() - this.lastFetchTime < CACHE_DURATION);
  }

  async loadFromCache() {
    try {
      const cachedData = await loadAllFromIndexedDB();
      if (cachedData?.length > 0) {
        this.lastFetchTime = Date.now();
        return cachedData;
      }
      return null;
    } catch (error) {
      // console.error('Cache load failed:', error);
      return null;
    }
  }

  async fetchJobs(force = false) {
    if (!force && this.isCacheValid()) {
      const cachedData = await this.loadFromCache();
      if (cachedData) return cachedData;
    }

    if (this.isLoading) {
      return this.initialLoadPromise;
    }

    this.isLoading = true;
    this.initialLoadPromise = (async () => {
      try {
        const response = await fetch('https://remotive.com/api/remote-jobs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const processedJobs = await this.processJobsData(data.jobs);
        
        await clearIndexedDB();
        await saveDataInChunks(processedJobs);
        this.lastFetchTime = Date.now();
        
        return processedJobs;
      } catch (error) {
        // console.error('Failed to fetch jobs:', error);
        const cachedData = await this.loadFromCache();
        if (cachedData) return cachedData;
        throw error;
      } finally {
        this.isLoading = false;
      }
    })();

    return this.initialLoadPromise;
  }
}

export const jobPrefetchService = new JobPrefetchService();

// Start prefetching immediately
jobPrefetchService.fetchJobs().catch(console.error);