import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import FindJobs from './pages/FindJobs';
import Companies from './pages/Companies';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Footer from './components/Footer';
import About from './pages/About';
import RemoteWorkGuide from './pages/RemoteWorkGuide';
import InterviewTips from './pages/InterviewTips';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/remote-work-guide" element={<RemoteWorkGuide />} />
            <Route path="/resources/interview-tips" element={<InterviewTips />} />
            <Route path="/about" element={<About />} />
            <Route path= "/blog" element={<Blog />} />  
          </Routes>
          <Footer /> 
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;