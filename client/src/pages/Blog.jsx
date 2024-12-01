import React from 'react';
import { Clock, Building2, Tags, MapPin, User } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`rounded-lg border border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-emerald-500">
          Exploring cutting-edge strategies for finding remote opportunities
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              November 30, 2024
            </span>
            <span>·</span>
            <span>10 min read</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-lg overflow-hidden">
        <img
  src="https://res.cloudinary.com/dzqt3usfp/image/upload/v1732982407/illustration_kg8cgi.svg"
  alt="Remote work illustration"
  className="w-full h-[500px] object-cover object-center"
/>

        </div>

        {/* Content */}
        <article className="prose prose-invert prose-emerald max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">
              The Evolution of Remote Job Platforms
            </h2>
            <p className="mb-6 leading-relaxed">
              In today's rapidly evolving job market, the ability to efficiently search and filter through remote opportunities has become crucial. Modern job platforms are implementing sophisticated caching mechanisms and real-time updates to provide job seekers with the most current opportunities while maintaining optimal performance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">
              Key Features of Modern Job Search
            </h2>
            <div className="grid gap-6">
              <Card className="bg-gray-800">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg">
                      <Building2 className="w-10 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Smart Caching System</h3>
                      <p className="text-gray-400">
                      To deliver a seamless experience, platforms use techniques like storing job data locally to ensure users can access saved jobs even when offline. Additionally, these platforms refresh listings periodically, so you never miss out on opportunities.
                        For example, platforms prefetch job categories based on user preferences.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg">
                      <Tags className="w-10 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
                      <p className="text-gray-400">
                        Powerful search capabilities that allow users to filter through job listings by title, company, and description while categorizing results for better organization. Filters can include options like job type, salary range, or preferred time zones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg">
                      <MapPin className="w-10 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                      <p className="text-gray-400">
                        Automatic refresh mechanisms ensure job listings stay current, with manual refresh options for immediate updates when needed. Platforms like Remohive and Remotive notify users about new postings via email or app notifications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">
              Technical Implementation
            </h2>
            <p className="mb-6 leading-relaxed">
              The platform implements several optimization techniques to ensure a smooth user experience:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-300">
              <li>Efficient data storage with automatic cleanup of outdated cache entries</li>
              <li>Optimized job data structure to reduce memory footprint</li>
              <li>Intelligent refresh intervals to balance data freshness with performance</li>
              <li>Error handling with fallback to cached data when network requests fail</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">
              Looking Forward
            </h2>
            <p className="mb-6 leading-relaxed">
              As remote work continues to grow, job search platforms must evolve to meet the changing needs of both job seekers and employers. Future improvements may include AI-powered job matching, enhanced filtering capabilities, and more sophisticated caching mechanisms.
            </p>
          </section>
        </article>

        {/* Author Bio */}
        <footer className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Written by Nicholas Muturi</h3>
              <p className="text-gray-400">
                Remote Work Technology Specialist
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Blog;