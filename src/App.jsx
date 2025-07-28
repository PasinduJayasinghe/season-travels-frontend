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
    console.log('Search completed:', results, formData);
    setIsLoading(false)
    setSearchData(formData)
    setFlightResults(results)
    setCurrentStep('results')
  }

  // Handle flight selection
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight)
    console.log('Flight pricing confirmed:', flight)
    
    // Here you would typically:
    // 1. Navigate to booking form with the confirmed pricing
    // 2. Store flight data for booking process
    // 3. Proceed to passenger details collection
    
    alert(`Flight pricing confirmed! Total: ${flight.price.currency} ${flight.price.grandTotal}. Next step: Proceed to booking form.`)
  }

  // Handle modify search (go back to search form)
  const handleModifySearch = () => {
    setCurrentStep('search')
    setFlightResults([])
    setSelectedFlight(null)
    // Keep searchData to pre-populate the form
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