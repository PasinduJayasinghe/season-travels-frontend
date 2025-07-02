// src/services/flightService.js
const API_BASE_URL = 'http://localhost:7136/api/flights';

export const searchFlights = async (searchParams) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export const getFlightDetails = async (flightId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${flightId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
};