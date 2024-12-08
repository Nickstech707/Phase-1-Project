import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import FindJobs from './pages/FindJobs';
import Companies from './pages/Companies';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Footer from './components/Footer';
import Unsubscribe from './pages/Unsubscribe';
import About from './pages/About';
import RemoteWorkGuide from './pages/RemoteWorkGuide';
import InterviewTips from './pages/InterviewTips';

import { ThemeProvider } from './context/ThemeContext';

import { jobPrefetchService } from './services/jobPrefetch';

// Start prefetching as soon as the app loads
jobPrefetchService.fetchJobs().catch(console.error);

// Layout component to handle conditional rendering of Header and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isUnsubscribePage = location.pathname.includes('/unsubscribe');

  return (
    <div className="app-container">
      {!isUnsubscribePage && <Header />}
      {children}
      {!isUnsubscribePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/remote-work-guide" element={<RemoteWorkGuide />} />
            <Route path="/resources/interview-tips" element={<InterviewTips />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />  
            <Route path="/unsubscribe/:email" element={<Unsubscribe />} />  
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;