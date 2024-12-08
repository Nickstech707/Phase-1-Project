import axios from 'axios';

// Sample test jobs data
const testJobs = [
  {
    title: "Senior Frontend Developer",
    company_name: "Test Company 1",
    category: "Software Development",
    candidate_required_location: "Remote - Worldwide",
    url: "https://example.com/job1"
  },
  {
    title: "Product Manager",
    company_name: "Test Company 2",
    category: "Product",
    candidate_required_location: "Remote - US Only",
    url: "https://example.com/job2"
  },
  {
    title: "DevOps Engineer",
    company_name: "Test Company 3",
    category: "DevOps",
    candidate_required_location: "Remote - Europe",
    url: "https://example.com/job3"
  }
];

// Test subscription first
async function testSubscription(email) {
  try {
    const response = await axios.post('http://localhost:5000/api/subscribe', {
      email,
      newJobs: testJobs
    });
    console.log('Subscription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Subscription error:', error.response?.data || error.message);
    throw error;
  }
}

// Test notification system
async function testNotification() {
  try {
    const response = await axios.post('http://localhost:5000/api/notify-subscribers', {
      jobs: testJobs
    });
    console.log('Notification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Notification error:', error.response?.data || error.message);
    throw error;
  }
}

// Run tests
async function runTests() {
  const testEmail = 'nicholas.muriithi1998@gmail.com'; // Replace with your email
  
  try {
    console.log('Testing subscription...');
    const subscriptionResult = await testSubscription(testEmail);
    
    // Check if the subscription was successful
    if (subscriptionResult.message !== 'Successfully subscribed') {
      throw new Error('Subscription failed');
    }
    
    console.log('\nWaiting 5 seconds before testing notifications...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Testing notification system...');
    const notificationResult = await testNotification();
    
    // Check if there are active subscribers
    if (notificationResult.message === 'No active subscribers found') {
      throw new Error('No active subscribers found for notifications');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the tests
runTests();