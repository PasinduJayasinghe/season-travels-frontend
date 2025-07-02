import { useState } from 'react'
import './App.css'
import FlightSearchForm from './components/FlightSearchForm'
import FlightResults from './components/FlightResults'

function App() {
  // Application state
  const [currentStep, setCurrentStep] = useState('search') // 'search' or 'results'
  const [searchData, setSearchData] = useState(null)
  const [flightResults, setFlightResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)

  // Handle flight search submission
  const handleFlightSearch = async (results, formData) => {
    setIsLoading(false) // The search is already done in FlightSearchForm
    setSearchData(formData)
    setFlightResults(results)
    setCurrentStep('results')
  }

  // Handle flight selection
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight)
    console.log('Flight selected:', flight)
    
    // Here you would typically:
    // 1. Call Amadeus Flight Offer Price API to get updated pricing
    // 2. Navigate to booking form
    // 3. Store flight data for booking process
    
    alert(`Selected flight ${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number} for ${flight.price.currency} ${flight.price.total}. Next: Get pricing and proceed to booking.`)
  }

  // Handle modify search (go back to search form)
  const handleModifySearch = () => {
    setCurrentStep('search')
    setFlightResults([])
    setSelectedFlight(null)
    // Optionally keep searchData to pre-populate the form
  }

  // Render based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'search':
        return (
          <FlightSearchForm 
            onSearch={handleFlightSearch}
            initialData={searchData} // Pre-populate form if returning from results
          />
        )
      case 'results':
        return (
          <FlightResults
            flights={flightResults}
            searchData={searchData}
            loading={isLoading}
            onFlightSelect={handleFlightSelect}
            onModifySearch={handleModifySearch}
          />
        )
      default:
        return <FlightSearchForm onSearch={handleFlightSearch} />
    }
  }

  return (
    <div className="App">
      {renderCurrentStep()}
    </div>
  )
}

export default App