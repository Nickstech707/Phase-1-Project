import React, { useState, useEffect  } from 'react';
import { Briefcase, Book, Video, Smile, Clock, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const InterviewTips = () => {
  const [expandedSections, setExpandedSections] = useState({});
  

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tips = [
    {
      id: 'research',
      title: 'Research the Company',
      icon: <Briefcase className="w-6 h-6" />,
      content: "Thoroughly research the company's mission, values, and recent projects. This knowledge will help you tailor your responses and ask insightful questions.",
      quote: "\" Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family.\" - Kofi Annan",
      
     
    },
    {
      id: 'practice',
      title: 'Practice Common Questions',
      icon: <Book className="w-6 h-6" />,
      content: "Prepare answers for common interview questions. Practice your responses out loud to build confidence and clarity.",
      quote: "\" I will prepare and some day my chance will come.\"  - Abraham Lincoln",
      
    },
    {
      id: 'tech',
      title: 'Test Your Technology',
      icon: <Video className="w-6 h-6" />,
      content: "For remote interviews, test your video conferencing setup, microphone, and internet connection well in advance.",
      quote: "\" The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.\" - Bill Gates",
      
    },
    {
      id: 'body-language',
      title: 'Mind Your Body Language',
      icon: <Smile className="w-6 h-6" />,
      content: "Maintain good posture, make eye contact, and smile. Your body language communicates as much as your words.",
      quote: "\" Your body communicates as well as your mouth. Don't contradict yourself.\" - Allen Ruddock",
      
    },
    {
      id: 'time',
      title: 'Be Punctual',
      icon: <Clock className="w-6 h-6" />,
      content: "Arrive or log in 5-10 minutes early. This shows respect for the interviewer's time and demonstrates your reliability.",
      quote: "\" Punctuality is the politeness of kings.\" - Louis XVIII" ,
     
    },
    {
      id: 'follow-up',
      title: 'Follow Up',
      icon: <ThumbsUp className="w-6 h-6" />,
      content: "Send a thank-you email within 24 hours of the interview. Reiterate your interest and briefly mention key points from your conversation.",
      quote: "\" The fortune of us that are the moon's men doth ebb and flow like the sea.\" - William Shakespeare",
     
    }
  ];

  return (
    <div className="pt-[120px] pb-[80px] px-4 md:px-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interview Tips
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Ace your remote job interviews with these essential tips. Learn how to prepare, what to expect, and how to impress your interviewers.
      </motion.p>
      
      <div className="space-y-6">
        {tips.map((tip, index) => (
          <TipSection key={tip.id} tip={tip} index={index} expanded={expandedSections[tip.id]} toggleSection={toggleSection} />
        ))}
      </div>

      <motion.div 
        className="mt-12 bg-emerald-100 dark:bg-emerald-900 p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">Use this checklist to track your interview preparation progress:</p>
        <InterviewChecklist />
      </motion.div>
    </div>
  );
};

const TipSection = ({ tip, index, expanded, toggleSection }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <button
        onClick={() => toggleSection(tip.id)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <div className="flex items-center space-x-4 ">
          <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
            {tip.icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tip.title}</h2>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{tip.content}</p>
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 dark:text-gray-400">
              "{tip.quote}"
            </blockquote>
          </div>
         
        </div>
      </motion.div>
    </motion.div>
  );
};

const InterviewChecklist = () => {
    // Initialize state from localStorage or default values
    const [checklist, setChecklist] = useState(() => {
      const savedChecklist = localStorage.getItem('interviewChecklist');
      return savedChecklist ? JSON.parse(savedChecklist) : {
        research: false,
        practice: false,
        outfit: false,
        questions: false,
        documents: false,
      };
    });
  
    // Update localStorage whenever checklist changes
    useEffect(() => {
      localStorage.setItem('interviewChecklist', JSON.stringify(checklist));
    }, [checklist]);
  
    const toggleItem = (item) => {
      setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
    };
  
    const calculateProgress = () => {
      const totalItems = Object.keys(checklist).length;
      const checkedItems = Object.values(checklist).filter(Boolean).length;
      return (checkedItems / totalItems) * 100;
    };
  
    return (
        <>
      <div className="mb-6 ">
        <div className="space-y-2 pb-1 mb-245">
          {Object.entries(checklist).map(([key, checked]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(key)}
                className="form-checkbox h-5 w-5 text-emerald-600 transition duration-150 ease-in-out"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-emerald-600">
                  {calculateProgress().toFixed(0)}%
                </span>
              </div>
            </div>
            <motion.div 
              className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                style={{ width: `${calculateProgress()}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      </>
    );
  };
  
export default InterviewTips;

