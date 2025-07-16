import { initializeSampleData } from '../services/firestore';

// Function to initialize sample data if needed
export const initializeAppData = async () => {
  try {
    // Check if we need to initialize sample data
    // This could be based on environment variables or user preference
    const shouldInitialize = localStorage.getItem('sampleDataInitialized') !== 'true';
    
    if (shouldInitialize) {
      console.log('Initializing sample data...');
      await initializeSampleData();
      localStorage.setItem('sampleDataInitialized', 'true');
      console.log('Sample data initialized successfully!');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};