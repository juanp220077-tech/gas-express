import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientPanel from './pages/ClientPanel';
import DriverPanel from './pages/DriverPanel';

//const API_URL = 'http://localhost:5000/api';

// ⚠️ Asegúrate de mantener el sufijo /api al final de la ruta
const API_URL = 'https://gas-backend-app.onrender.com/api';

function App() {
  const [coords, setCoords] = useState({ lng: -78.4678, lat: -0.1807 });
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lng: position.coords.longitude, lat: position.coords.latitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
        <header style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'center', padding: '15px' }}>
          <h2 style={{ margin: 0 }}>🚚 Sistema de Distribución Gas-Express</h2>
        </header>

        <main style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>📍 Geolocalización Activa: </span>
            <code>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</code>
          </div>

          <Routes>
            <Route path="/" element={
              <ClientPanel coords={coords} API_URL={API_URL} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
            } />
            <Route path="/driver" element={
              <DriverPanel API_URL={API_URL} currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
