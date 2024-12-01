import React from 'react';

function Resources() {
  const resources = [
    {
      title: 'Remote Work Guide',
      description: 'Complete guide to working remotely effectively',
      category: 'Guides',
      link: '/resources/remote-work-guide'
    },
    {
      title: 'Interview Tips',
      description: 'Ace your remote job interviews',
      category: 'Career Tips',
      link: '/resources/interview-tips'
    },
    
  ];

  return (
    <div className="pt-[120px] pb-[80px] px-4 md:px-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Remote Work Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{resource.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>
            <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-200 px-2 py-1 rounded text-sm">
              {resource.category}
            </span>
            <a 
              href={resource.link}
              className="block mt-4 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources; 