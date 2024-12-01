function About() {
  return (
    <div className="pt-[120px] px-4 md:px-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">About RemoHive</h1>
      
      <div className="max-w-3xl mx-auto">
        <section className="mb-8 transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            RemoHive is dedicated to connecting talented professionals with the best remote job opportunities worldwide. We believe in the future of remote work and its potential to transform lives and businesses.
          </p>
        </section>

        <section className="mb-8 transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">What We Do</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Curate the best remote job opportunities</li>
            <li>Connect professionals with remote-first companies</li>
            <li>Provide resources for remote work success</li>
            <li>Build a community of remote workers</li>
          </ul>
        </section>

        <section className="mb-8 transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea 
                className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                rows="4"
                placeholder="Your message"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default About; 