import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styling.scss';
import Plasma from '../Plasma/Plasma'; // Import Plasma

const MOCK_FLIGHTS = [
    {
        id: 1,
        airline: 'Air Algérie',
        departure: '07:30',
        arrival: '10:45',
        duration: '3h 15m',
        price: 285,
        stops: 'Nonstop',
        date: '2026-07-15'
    },
    {
        id: 2,
        airline: 'Turkish Airlines',
        departure: '11:20',
        arrival: '15:50',
        duration: '3h 30m',
        price: 340,
        stops: 'Nonstop',
        date: '2026-07-15'
    },
    {
        id: 3,
        airline: 'Air France',
        departure: '09:00',
        arrival: '11:25',
        duration: '2h 25m',
        price: 250,
        stops: 'Nonstop',
        date: '2026-07-15'
    },
    {
        id: 4,
        airline: 'Tassili Airlines',
        departure: '13:15',
        arrival: '15:10',
        duration: '1h 55m',
        price: 120,
        stops: 'Nonstop',
        date: '2026-07-15'
    },
    {
        id: 5,
        airline: 'Saudia',
        departure: '18:30',
        arrival: '01:10',
        duration: '4h 40m',
        price: 430,
        stops: 'Nonstop',
        date: '2026-07-15'
    },
    {
        id: 6,
        airline: 'Qatar Airways',
        departure: '21:00',
        arrival: '08:15',
        duration: '10h 15m',
        price: 620,
        stops: '1 Stop',
        date: '2026-07-15'
    }
];

const AIRPORTS = [
    { code: 'ALG', city: 'Algiers' },
    { code: 'ORN', city: 'Oran' },
    { code: 'CZL', city: 'Constantine' },
    { code: 'AAE', city: 'Annaba' },
    { code: 'BJA', city: 'Béjaïa' },
    { code: 'TLM', city: 'Tlemcen' },
    { code: 'BLJ', city: 'Batna' },
    { code: 'GJL', city: 'Jijel' },
    { code: 'TMR', city: 'Tamanrasset' },
    { code: 'OGX', city: 'Ouargla' },

    // International destinations
    { code: 'CDG', city: 'Paris' },
    { code: 'IST', city: 'Istanbul' },
    { code: 'JED', city: 'Jeddah' }
];

export default function FlightBooking() {
    const router = useRouter();
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
    const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (departure && arrival && departDate) {
            setSearched(true);
            setLoading(true);
            setError(null);

            // Filter mock flights by selected date (always include them)
            const matchingMocks = MOCK_FLIGHTS.filter(f => f.date === departDate);
            // Normalise mock flights to shared shape
            const normalisedMocks = matchingMocks.map(f => ({
                _source: 'mock',
                airline: f.airline,
                departureTime: f.departure,
                arrivalTime: f.arrival,
                duration: f.duration,
                price: `${f.price} USD`,
                stops: f.stops,
            }));

            try {
                const res = await fetch(`/api/flights/search?origin=${departure}&destination=${arrival}&date=${departDate}`);
                const data = await res.json();

                if (data.error) {
                    // Still show mocks on API error
                    setFlights(normalisedMocks);
                    if (normalisedMocks.length === 0) setError(data.error);
                } else {
                    // Normalise sheet flights and merge
                    const sheetFlights = (data.flights || []).map(f => ({
                        _source: 'sheet',
                        airline: f.Airline,
                        departureTime: f.DepartureDate
                            ? new Date(f.DepartureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '--:--',
                        arrivalTime: f.ArrivalDate
                            ? new Date(f.ArrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '--:--',
                        duration: f.duration || 'Direct',
                        price: f.FinalPrice ? `${f.FinalPrice} DA` : 'N/A',
                        stops: f.stops || 'Nonstop',
                    }));
                    setFlights([...normalisedMocks, ...sheetFlights]);
                }
            } catch (err) {
                // Network error – still show mocks
                setFlights(normalisedMocks);
                if (normalisedMocks.length === 0) setError('Failed to fetch flights. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const swapAirports = () => {
        const temp = departure;
        setDeparture(arrival);
        setArrival(temp);
    };

    const filteredDepartures = AIRPORTS.filter(
        airport => airport.code.toLowerCase().includes(departure.toLowerCase()) ||
            airport.city.toLowerCase().includes(departure.toLowerCase())
    );

    const filteredArrivals = AIRPORTS.filter(
        airport => airport.code.toLowerCase().includes(arrival.toLowerCase()) ||
            airport.city.toLowerCase().includes(arrival.toLowerCase())
    );

    return (
        <div className="flight-booking-container">
            <div className="plasma-background">
                <Plasma
                    color="#ef4444"
                    speed={0.6}
                    direction="forward"
                    scale={1.5}
                    opacity={1}
                    mouseInteractive={false}
                />
            </div>
            <div className="content-overlay">
                {/* Header */}
                <div className="flight-booking-header">
                    <div className="header-content">
                        <h1 className="header-title" style={{ fontSize: '6vw' }}>
                            <span style={{ color: 'white', fontWeight: 'bold' }}>Mel</span>{' '}
                            <span style={{ color: '#ef4444' }}>Go</span>
                        </h1>
                        <p className="header-subtitle">Find and book your perfect flight</p>
                    </div>
                </div>

                {/* Search Form */}
                <form className="flight-booking-form" onSubmit={handleSearch}>
                    <div className="search-inputs">
                        {/* Departure Airport */}
                        <div className="input-group">
                            <label>From</label>
                            <div className="airport-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Departure airport"
                                    value={departure}
                                    onChange={(e) => {
                                        setDeparture(e.target.value);
                                        setShowDepartureDropdown(true);
                                    }}
                                    onFocus={() => setShowDepartureDropdown(true)}
                                    className="airport-input"
                                />
                                {showDepartureDropdown && departure && (
                                    <div className="dropdown-menu">
                                        {filteredDepartures.length > 0 ? (
                                            filteredDepartures.map(airport => (
                                                <div
                                                    key={airport.code}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setDeparture(airport.code);
                                                        setShowDepartureDropdown(false);
                                                    }}
                                                >
                                                    <span className="airport-code">{airport.code}</span>
                                                    <span className="airport-city">{airport.city}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-item disabled">No airports found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button
                            type="button"
                            className="swap-button"
                            onClick={swapAirports}
                            title="Swap airports"
                        >
                            ⇄
                        </button>

                        {/* Arrival Airport */}
                        <div className="input-group">
                            <label>To</label>
                            <div className="airport-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Arrival airport"
                                    value={arrival}
                                    onChange={(e) => {
                                        setArrival(e.target.value);
                                        setShowArrivalDropdown(true);
                                    }}
                                    onFocus={() => setShowArrivalDropdown(true)}
                                    className="airport-input"
                                />
                                {showArrivalDropdown && arrival && (
                                    <div className="dropdown-menu">
                                        {filteredArrivals.length > 0 ? (
                                            filteredArrivals.map(airport => (
                                                <div
                                                    key={airport.code}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setArrival(airport.code);
                                                        setShowArrivalDropdown(false);
                                                    }}
                                                >
                                                    <span className="airport-code">{airport.code}</span>
                                                    <span className="airport-city">{airport.city}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="dropdown-item disabled">No airports found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Departure Date */}
                        <div className="input-group">
                            <label>Depart</label>
                            <input
                                type="date"
                                value={departDate}
                                onChange={(e) => setDepartDate(e.target.value)}
                                className="date-input"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="search-button"
                            disabled={!departure || !arrival || !departDate}
                        >
                            Search Flights
                        </button>
                    </div>
                </form>

                {/* Flight Results */}
                {searched && (
                    <div className="flight-results">
                        <div className="results-header">
                            <h2 className="results-title">
                                Available flights from {departure} to {arrival}
                            </h2>
                            <p className="results-subtitle">
                                {loading ? 'Searching for flights...' : error ? error : `${flights.length} flights found for ${departDate}`}
                            </p>
                        </div>

                        <div className="flights-list">
                            {loading && <div className="loading-state" style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading flights...</div>}
                            {!loading && flights.length === 0 && !error && <div className="no-flights" style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>No flights found for this route on this date.</div>}
                            {!loading && flights.map((flight, index) => (
                                <div key={index} className={`flight-card${flight._source === 'mock' ? ' mock-flight' : ''}`}>
                                    <div className="flight-info">
                                        <div className="airline-section">
                                            <div className="airline-logo">✈</div>
                                            <div className="airline-name">{flight.airline || 'Airline'}</div>
                                        </div>

                                        <div className="times-section">
                                            <div className="time-item">
                                                <span className="time">{flight.departureTime || '--:--'}</span>
                                                <span className="airport">{departure}</span>
                                            </div>
                                            <div className="duration-section">
                                                <span className="duration">{flight.duration || 'Direct'}</span>
                                                <div className="flight-line">
                                                    <div className="line-dot"></div>
                                                    <div className="line"></div>
                                                    <div className="line-dot"></div>
                                                </div>
                                                <span className="stops">{flight.stops || 'Nonstop'}</span>
                                            </div>
                                            <div className="time-item">
                                                <span className="time">{flight.arrivalTime || '--:--'}</span>
                                                <span className="airport">{arrival}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-price-section">
                                        <div className="price-container">
                                            <span className="price-label">Final Price</span>
                                            <span className="price">{flight.price || 'N/A'}</span>
                                        </div>
                                        <button
                                            className="select-button"
                                            onClick={() => router.push('/book')}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!searched && (
                    <div className="empty-state">
                        <div className="empty-icon">✈️</div>
                        <h3>Start your journey</h3>
                        <p>Select your departure and arrival airports, choose a date, and find the best flights</p>
                    </div>
                )}
            </div>
        </div>
    );
}
