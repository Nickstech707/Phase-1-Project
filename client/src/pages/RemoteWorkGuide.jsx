import React, { useState, useEffect } from 'react';
import { Laptop, Clock, Coffee, Users, Zap, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RemoteWorkGuide = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tips = [
    {
      id: 'workspace',
      title: 'Set Up Your Workspace',
      icon: <Laptop className="w-6 h-6" />,
      content: "Create a dedicated, comfortable workspace that promotes focus and productivity. Ensure good lighting, ergonomic furniture, and minimal distractions.",
      quote: "\"Your environment shapes your behavior. Design a space that inspires your best work.\" - James Clear",
      
    },
    {
      id: 'routine',
      title: 'Establish a Routine',
      icon: <Clock className="w-6 h-6" />,
      content: "Maintain a consistent schedule to separate work and personal time. Start and end your workday at set times, and include regular breaks.",
      quote: "\"The secret of your future is hidden in your daily routine.\" - Mike Murdock",
      
    },
    {
      id: 'self-care',
      title: 'Prioritize Self-Care',
      icon: <Coffee className="w-6 h-6" />,
      content: "Take care of your physical and mental health. Exercise regularly, eat well, and make time for activities you enjoy outside of work.",
      quote: "\"Self-care is not self-indulgence, it is self-preservation.\" - Audre Lorde",
      
    },
    {
      id: 'communication',
      title: 'Communicate Effectively',
      icon: <Users className="w-6 h-6" />,
      content: "Overcommunicate with your team. Use video calls for important discussions, and keep your colleagues updated on your progress and availability.",
      quote: "\"The single biggest problem in communication is the illusion that it has taken place.\" - George Bernard Shaw",
      
    },
    {
      id: 'productivity',
      title: 'Boost Productivity',
      icon: <Zap className="w-6 h-6" />,
      content: "Use productivity techniques like the Pomodoro method, time-blocking, or the Eisenhower matrix to manage your tasks efficiently.",
      quote: "\"Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.\" - Paul J. Meyer",
      
    },
    {
      id: 'work-life-balance',
      title: 'Maintain Work-Life Balance',
      icon: <Headphones className="w-6 h-6" />,
      content: "Set clear boundaries between work and personal life. Avoid the temptation to work outside your designated hours, and make time for hobbies and relaxation.",
      quote: "\"You will never feel truly satisfied by work until you are satisfied by life.\" - Heather Schuck",
      
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
        Remote Work Guide
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Complete guide to working remotely effectively. This guide covers best practices, tools, and tips to enhance your remote work experience.
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Remote Work Toolkit</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Essential tools for effective remote work:</p>
        <RemoteWorkToolkit />
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
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
            {tip.icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tip.title}</h2>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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
              {tip.quote}
            </blockquote>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
};

const RemoteWorkToolkit = () => {
    // Initialize state from localStorage or default values
    const [checklist, setChecklist] = useState(() => {
      const savedChecklist = localStorage.getItem('remoteWorkToolkit');
      return savedChecklist ? JSON.parse(savedChecklist) : {
        videoConferencing: false,
        projectManagement: false,
        cloudStorage: false,
        instantMessaging: false,
        timeTracking: false,
      };
    });
  
    // Update localStorage whenever checklist changes
    useEffect(() => {
      localStorage.setItem('remoteWorkToolkit', JSON.stringify(checklist));
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
      <div>
        <div className="space-y-2">
          {Object.entries(checklist).map(([key, checked]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(key)}
                className="form-checkbox h-5 w-5 text-emerald-600 transition duration-150 ease-in-out"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {key.split(/(?=[A-Z])/).join(' ')}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                  Toolkit Progress
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
    );
  };
  

export default RemoteWorkGuide;

