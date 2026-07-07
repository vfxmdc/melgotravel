import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styling.scss';
import Plasma from '../Plasma/Plasma'; // Import Plasma

const AIRPORTS = [
    { code: 'ALG', city: 'Algiers' },
    { code: 'CDG', city: 'Paris CDG' },
    { code: 'ORY', city: 'Paris Orly' },
    { code: 'MRS', city: 'Marseille' },
    { code: 'LYS', city: 'Lyon' },
    { code: 'ORN', city: 'Oran' },
    { code: 'CZL', city: 'Constantine' },
    { code: 'BCN', city: 'Barcelona' },
    { code: 'MAD', city: 'Madrid' },
    { code: 'ALC', city: 'Alicante' },
    { code: 'LHR', city: 'London Heathrow' },
    { code: 'FCO', city: 'Rome' },
    { code: 'FRA', city: 'Frankfurt' },
    { code: 'GVA', city: 'Geneva' },
    { code: 'YUL', city: 'Montreal' },
    { code: 'JFK', city: 'New York' },
    { code: 'IAD', city: 'Washington DC' },
    { code: 'IST', city: 'Istanbul' },
    { code: 'SVO', city: 'Moscow' },
    { code: 'JED', city: 'Jeddah' },
    { code: 'MED', city: 'Medina' },
    { code: 'DXB', city: 'Dubai' },
    { code: 'DOH', city: 'Doha' },
    { code: 'AUH', city: 'Abu Dhabi' },
    { code: 'KWI', city: 'Kuwait' },
    { code: 'CAI', city: 'Cairo' },
    { code: 'TUN', city: 'Tunis' },
    { code: 'CMN', city: 'Casablanca' },
    { code: 'AMM', city: 'Amman' },
    { code: 'BEY', city: 'Beirut' },
    { code: 'MCT', city: 'Muscat' },
    { code: 'PEK', city: 'Beijing' },
    { code: 'CAN', city: 'Guangzhou' },
    { code: 'PVG', city: 'Shanghai' },
    { code: 'KUL', city: 'Kuala Lumpur' },
    { code: 'HAN', city: 'Hanoi' },
    { code: 'SGN', city: 'Ho Chi Minh City' },
    { code: 'MLE', city: 'Maldives' },
    { code: 'CGK', city: 'Jakarta' },
    { code: 'DPS', city: 'Bali' },
    { code: 'ZNZ', city: 'Zanzibar' }
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

            try {
                const res = await fetch(`/api/flights/search?origin=${departure}&destination=${arrival}&date=${departDate}`);
                const data = await res.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setFlights(data.flights || []);
                }
            } catch (err) {
                setError('Failed to fetch flights. Please try again.');
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
                                <div key={index} className="flight-card">
                                    <div className="flight-info">
                                        <div className="airline-section">
                                            <div className="airline-logo">✈</div>
                                            <div className="airline-name">{flight.Airline || 'Airline'}</div>
                                        </div>

                                        <div className="times-section">
                                            <div className="time-item">
                                                <span className="time">{flight.DepartureDate ? new Date(flight.DepartureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                                                <span className="airport">{flight.Origin || departure}</span>
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
                                                <span className="time">{flight.ArrivalDate ? new Date(flight.ArrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                                                <span className="airport">{flight.Destination || arrival}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-price-section">
                                        <div className="price-container">
                                            <span className="price-label">Final Price</span>
                                            <span className="price">{flight.FinalPrice ? `${flight.FinalPrice} DA` : 'N/A'}</span>
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
