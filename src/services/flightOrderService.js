// src/services/flightOrderService.js
const API_BASE_URL = 'https://localhost:7136/api/FlightOrder';

export const createFlightOrder = async (orderData) => {
  try {
    console.log('Creating flight order...');
    console.log('Order data:', JSON.stringify(orderData, null, 2));

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Flight order response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error creating flight order:', error);
    throw error;
  }
};
