// src/services/flightDataUtils.js

/**
 * Validates and transforms flight offer data for Amadeus API compatibility
 */
export const prepareFlightOfferForPricing = (flightOffer) => {
  if (!flightOffer) {
    throw new Error('Flight offer is required');
  }

  // Create a deep copy to avoid modifying the original
  const preparedOffer = JSON.parse(JSON.stringify(flightOffer));

  console.log('🔧 Preparing flight offer for pricing...');
  console.log('Original lastTicketingDate:', preparedOffer.lastTicketingDate);
  console.log('Original lastTicketingDateTime:', preparedOffer.lastTicketingDateTime);

  // Fix property name mismatch - Amadeus expects lastTicketingDateTime, not lastTicketingDate
  if (preparedOffer.lastTicketingDate && !preparedOffer.lastTicketingDateTime) {
    preparedOffer.lastTicketingDateTime = preparedOffer.lastTicketingDate;
    delete preparedOffer.lastTicketingDate;
    console.log('✅ Fixed lastTicketingDate → lastTicketingDateTime');
  }

  // Ensure lastTicketingDateTime is in proper ISO format
  if (preparedOffer.lastTicketingDateTime && !preparedOffer.lastTicketingDateTime.includes('T')) {
    // If it's just a date, add time (use end of day for last ticketing)
    preparedOffer.lastTicketingDateTime = `${preparedOffer.lastTicketingDateTime}T23:59:59.000Z`;
    console.log('✅ Added time to lastTicketingDateTime:', preparedOffer.lastTicketingDateTime);
  }

  // Fix traveler pricing issues
  if (preparedOffer.travelerPricings) {
    preparedOffer.travelerPricings.forEach((tp, index) => {
      if (tp.price) {
        // Ensure grandTotal exists and has a value
        if (!tp.price.grandTotal || tp.price.grandTotal === '') {
          tp.price.grandTotal = tp.price.total;
          console.log(`✅ Fixed grandTotal for traveler ${index + 1}:`, tp.price.grandTotal);
        }

        // Ensure fees array exists
        if (!tp.price.fees) {
          tp.price.fees = [];
          console.log(`✅ Added fees array for traveler ${index + 1}`);
        }
      }

      // Fix fare details
      if (tp.fareDetailsBySegment) {
        tp.fareDetailsBySegment.forEach((fare, fareIndex) => {
          if (fare.includedCheckedBags) {
            // Ensure weight unit is set if weight is provided
            if (fare.includedCheckedBags.weight !== undefined && 
                (!fare.includedCheckedBags.weightUnit || fare.includedCheckedBags.weightUnit === '')) {
              fare.includedCheckedBags.weightUnit = 'KG';
              console.log(`✅ Fixed weightUnit for traveler ${index + 1}, segment ${fareIndex + 1}`);
            }
          }
        });
      }
    });
  }

  // Ensure all segments have proper structure
  if (preparedOffer.itineraries) {
    preparedOffer.itineraries.forEach((itinerary, itinIndex) => {
      if (itinerary.segments) {
        itinerary.segments.forEach((segment, segIndex) => {
          // Ensure departure and arrival times are in proper format
          if (segment.departure && segment.departure.at) {
            const originalTime = segment.departure.at;
            segment.departure.at = ensureISOFormat(segment.departure.at);
            if (originalTime !== segment.departure.at) {
              console.log(`✅ Fixed departure time for itinerary ${itinIndex + 1}, segment ${segIndex + 1}`);
            }
          }
          if (segment.arrival && segment.arrival.at) {
            const originalTime = segment.arrival.at;
            segment.arrival.at = ensureISOFormat(segment.arrival.at);
            if (originalTime !== segment.arrival.at) {
              console.log(`✅ Fixed arrival time for itinerary ${itinIndex + 1}, segment ${segIndex + 1}`);
            }
          }
        });
      }
    });
  }

  // Validate required fields
  validateFlightOffer(preparedOffer);

  console.log('✅ Flight offer preparation completed');
  return preparedOffer;
};

/**
 * Ensures date string is in proper ISO format
 */
const ensureISOFormat = (dateString) => {
  if (!dateString) return dateString;
  
  // If already in ISO format, return as is
  if (dateString.includes('T') && dateString.includes(':')) {
    return dateString;
  }
  
  // Try to parse and reformat
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (error) {
    console.warn('Could not parse date:', dateString);
    return dateString;
  }
};

/**
 * Validates that flight offer has all required fields for Amadeus pricing
 */
const validateFlightOffer = (flightOffer) => {
  const requiredFields = [
    'type',
    'id',
    'source',
    'itineraries',
    'price',
    'travelerPricings'
  ];

  for (const field of requiredFields) {
    if (!flightOffer[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate itineraries
  if (!Array.isArray(flightOffer.itineraries) || flightOffer.itineraries.length === 0) {
    throw new Error('Flight offer must have at least one itinerary');
  }

  flightOffer.itineraries.forEach((itinerary, index) => {
    if (!itinerary.segments || !Array.isArray(itinerary.segments) || itinerary.segments.length === 0) {
      throw new Error(`Itinerary ${index} must have at least one segment`);
    }
  });

  // Validate traveler pricings
  if (!Array.isArray(flightOffer.travelerPricings) || flightOffer.travelerPricings.length === 0) {
    throw new Error('Flight offer must have at least one traveler pricing');
  }

  console.log('✅ Flight offer validation passed');
};

/**
 * Logs flight offer structure for debugging
 */
export const logFlightOfferStructure = (flightOffer, label = 'Flight Offer') => {
  console.group(`🛫 ${label} Structure`);
  console.log('Type:', flightOffer?.type);
  console.log('ID:', flightOffer?.id);
  console.log('Source:', flightOffer?.source);
  console.log('Last Ticketing DateTime:', flightOffer?.lastTicketingDateTime);
  console.log('Itineraries:', flightOffer?.itineraries?.length);
  console.log('Traveler Pricings:', flightOffer?.travelerPricings?.length);
  
  if (flightOffer?.travelerPricings) {
    flightOffer.travelerPricings.forEach((tp, index) => {
      console.log(`Traveler ${index + 1} Grand Total:`, tp?.price?.grandTotal);
    });
  }
  
  console.groupEnd();
};
