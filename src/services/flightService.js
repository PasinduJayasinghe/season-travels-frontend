// src/services/flightService.js
const API_BASE_URL = 'https://localhost:7136/api/FlightSearch';

export const searchFlights = async (searchParams) => {
  try {
    // Convert search parameters to URL query parameters
    const queryParams = new URLSearchParams();
    
    // Add all non-null/non-empty parameters
    if (searchParams.originLocationCode) {
      queryParams.append('originLocationCode', searchParams.originLocationCode);
    }
    if (searchParams.destinationLocationCode) {
      queryParams.append('destinationLocationCode', searchParams.destinationLocationCode);
    }
    if (searchParams.departureDate) {
      queryParams.append('departureDate', searchParams.departureDate);
    }
    if (searchParams.returnDate) {
      queryParams.append('returnDate', searchParams.returnDate);
    }
    if (searchParams.adults) {
      queryParams.append('adults', searchParams.adults.toString());
    }
    if (searchParams.children) {
      queryParams.append('children', searchParams.children.toString());
    }
    if (searchParams.infants) {
      queryParams.append('infants', searchParams.infants.toString());
    }
    if (searchParams.currencyCode) {
      queryParams.append('currencyCode', searchParams.currencyCode);
    }
    if (searchParams.maxResults) {
      queryParams.append('maxResults', searchParams.maxResults.toString());
    }
    if (searchParams.travelClass) {
      queryParams.append('travelClass', searchParams.travelClass);
    }
    if (searchParams.nonStop !== undefined) {
      queryParams.append('nonStop', searchParams.nonStop.toString());
    }

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    console.log('API Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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