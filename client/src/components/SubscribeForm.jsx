import { useState } from 'react';

function SubscribeForm({ newJobs = [] }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setNotification('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase(),
          newJobs 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error subscribing to alerts');
      }

      setNotification('You have Successfully subscribed to job alerts. You will get notified when new jobs are posted');
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      
      setNotification(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = `
    px-6 py-2.5 rounded-lg text-sm font-medium text-white
    transition-all duration-200 ease-in-out
    ${isLoading 
      ? 'bg-emerald-600 cursor-wait' 
      : isSubscribed 
        ? 'bg-emerald-800 cursor-not-allowed opacity-75'
        : 'bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg'
    }
  `;

  const inputStyles = `
    flex-1 px-4 py-2.5 rounded-lg
    bg-emerald-800/50 border border-emerald-600
    focus:outline-none focus:ring-2 focus:ring-emerald-500
    text-sm text-white placeholder-emerald-200/60
    transition-all duration-200 ease-in-out
    disabled:opacity-75 disabled:cursor-not-allowed
  `;

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-gradient-to-b from-emerald-900/20 to-transparent rounded-[15px]">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-base text-emerald-200/80">
            Get notified when new jobs are posted. No spam, no clutter.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              disabled={isLoading || isSubscribed}
              className={inputStyles}
              required
            />
            <button 
              type="submit"
              disabled={isLoading || isSubscribed} 
              className={buttonStyles}
            >
              {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          
          {notification && (
            <div 
              className={`
                text-sm text-center py-2 px-4 rounded-lg
                ${notification.includes('Error') || notification.includes('already')
                  ? 'text-red-400 bg-red-900/20'
                  : 'text-emerald-200 bg-emerald-900/20'
                }
              `}
            >
              {notification}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SubscribeForm;