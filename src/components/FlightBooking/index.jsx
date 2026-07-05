import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styling.scss';
import Plasma from '../Plasma/Plasma'; // Import Plasma

const MOCK_FLIGHTS = [
    {
        id: 1,
        airline: 'United Airlines',
        departure: '08:30',
        arrival: '12:45',
        duration: '4h 15m',
        price: 245,
        stops: 'Nonstop',
        date: '2024-01-15'
    },
    {
        id: 2,
        airline: 'American Airlines',
        departure: '09:15',
        arrival: '14:30',
        duration: '5h 15m',
        price: 198,
        stops: '1 Stop',
        date: '2024-01-15'
    },
    {
        id: 3,
        airline: 'Delta Airlines',
        departure: '06:00',
        arrival: '10:20',
        duration: '4h 20m',
        price: 320,
        stops: 'Nonstop',
        date: '2024-01-15'
    },
    {
        id: 4,
        airline: 'Southwest Airlines',
        departure: '10:45',
        arrival: '16:15',
        duration: '5h 30m',
        price: 175,
        stops: '1 Stop',
        date: '2024-01-15'
    },
    {
        id: 5,
        airline: 'Alaska Airlines',
        departure: '13:00',
        arrival: '18:45',
        duration: '5h 45m',
        price: 210,
        stops: 'Nonstop',
        date: '2024-01-15'
    },
    {
        id: 6,
        airline: 'JetBlue Airways',
        departure: '15:30',
        arrival: '20:00',
        duration: '4h 30m',
        price: 235,
        stops: 'Nonstop',
        date: '2024-01-15'
    }
];

const AIRPORTS = [
    { code: 'JFK', city: 'New York' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'ORD', city: 'Chicago' },
    { code: 'DFW', city: 'Dallas' },
    { code: 'ATL', city: 'Atlanta' },
    { code: 'MIA', city: 'Miami' },
    { code: 'SFO', city: 'San Francisco' },
    { code: 'SEA', city: 'Seattle' },
    { code: 'BOS', city: 'Boston' },
    { code: 'LAS', city: 'Las Vegas' }
];

export default function FlightBooking() {
    const router = useRouter();
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
    const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (departure && arrival && departDate) {
            setSearched(true);
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
                    color="#a71a2a"
                    speed={0.6}
                    direction="forward"
                    scale={1.5}
                    opacity={0.4}
                    mouseInteractive={false}
                />
            </div>
            <div className="content-overlay">
                {/* Header */}
                <div className="flight-booking-header">
                    <div className="header-content">
                        <h1 className="header-title" style={{ fontSize: '6vw' }}>
                            <span style={{ color: 'white' }}>Mel</span>{' '}
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
                                {MOCK_FLIGHTS.length} flights found for {departDate}
                            </p>
                        </div>

                        <div className="flights-list">
                            {MOCK_FLIGHTS.map(flight => (
                                <div key={flight.id} className="flight-card">
                                    <div className="flight-info">
                                        <div className="airline-section">
                                            <div className="airline-logo">✈</div>
                                            <div className="airline-name">{flight.airline}</div>
                                        </div>

                                        <div className="times-section">
                                            <div className="time-item">
                                                <span className="time">{flight.departure}</span>
                                                <span className="airport">{departure}</span>
                                            </div>
                                            <div className="duration-section">
                                                <span className="duration">{flight.duration}</span>
                                                <div className="flight-line">
                                                    <div className="line-dot"></div>
                                                    <div className="line"></div>
                                                    <div className="line-dot"></div>
                                                </div>
                                                <span className="stops">{flight.stops}</span>
                                            </div>
                                            <div className="time-item">
                                                <span className="time">{flight.arrival}</span>
                                                <span className="airport">{arrival}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flight-price-section">
                                        <div className="price-container">
                                            <span className="price-label">From</span>
                                            <span className="price">${flight.price}</span>
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
