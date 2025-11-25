import React, { useState } from 'react';
import axios from 'axios';

const getAqiDescription = (category) => {
  switch (category) {
    case 'Good':
      return 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
    case 'Moderate':
      return 'Air quality is acceptable; however, some pollutants may be a moderate health concern for a very small number of people.';
    case 'Unhealthy for Sensitive Groups':
      return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    case 'Unhealthy':
      return 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.';
    case 'Very Unhealthy':
      return 'Health alert: The risk of health effects is increased for everyone.';
    case 'Hazardous':
      return 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
    default:
      return 'Air quality information is unavailable.';
  }
};

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Please enter a city name.');
      setData(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const res = await axios.get('/api/aqi', { params: { city: trimmedCity } });
      setData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDetails = () => {
    if (!data || !data.details) return null;
    const entries = Object.entries(data.details);
    if (!entries.length) return null;
    return (
      <div className="card-section">
        <h3>Pollutant Details</h3>
        <div className="details-grid">
          {entries.map(([key, value]) => (
            <div key={key} className="detail-item">
              <span className="detail-label">{key.toUpperCase()}</span>
              <span className="detail-value">{value && value.v != null ? value.v : '-'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Air Quality Index (AQI) Search</h1>
        <p>Type a city name to check its air quality in real time.</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter city name, e.g. Pune"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {data && (
          <section className="result-card">
            <div className="card-header">
              <div>
                <h2>{data.city}</h2>
                {data.time && <p className="updated-time">Last updated: {new Date(data.time).toLocaleString()}</p>}
                {data.geo && <p className="coordinates">Coordinates: {data.geo.join(', ')}</p>}
              </div>
              <div className="aqi-badge" style={{ backgroundColor: data.color || '#9e9e9e' }}>
                <span className="aqi-value">{data.aqi ?? '-'}</span>
                <span className="aqi-label">AQI</span>
              </div>
            </div>

            <div className="card-section">
              <h3>Air Quality</h3>
              <p className="category">{data.category}</p>
              <p className="description">{getAqiDescription(data.category)}</p>
              {data.dominantPollutant && (
                <p className="dominant">
                  Dominant pollutant: <strong>{data.dominantPollutant.toUpperCase()}</strong>
                </p>
              )}
              {data.source && (
                <p className="source">
                  Data source: <strong>{data.source === 'cache' ? 'Cached result' : 'Live API call'}</strong>
                </p>
              )}
            </div>

            {renderDetails()}
          </section>
        )}

        {!data && !error && !loading && (
          <section className="hint-card">
            <h2>How it works</h2>
            <ul>
              <li>Enter a city name above and click <strong>Search</strong>.</li>
              <li>The app calls a local backend, which fetches data from the AQICN API.</li>
              <li>Results are cached on the backend for faster repeat queries.</li>
              <li>The card colors and text follow AQI levels from the Air Quality Index standard.</li>
            </ul>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          AQI data provided via <a href="https://aqicn.org/api/" target="_blank" rel="noreferrer">AQICN API</a>.
        </p>
      </footer>
    </div>
  );
}

export default App;