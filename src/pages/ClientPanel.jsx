import React, { useState, useEffect } from 'react';

export default function ClientPanel({ coords, API_URL, currentOrder, setCurrentOrder }) {
  const [clientId] = useState("65f123456789012345678901");
  const [nearbyDrivers, setNearbyDrivers] = useState([]);

  // 🔄 Polling del Cliente: Consulta el estado del pedido en Atlas cada 3 segundos
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/driver/65f987654321098765432109`);
        if (response.ok) {
          const orderData = await response.json();
          if (orderData) {
            setCurrentOrder(orderData);
          }
        }
      } catch (err) {
        console.error("Error en sondeo de cliente:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [API_URL, setCurrentOrder]);

  const findGas = async () => {
    try {
      await fetch(`${API_URL}/drivers/sync-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longitude: coords.lng, latitude: coords.lat })
      });

      const response = await fetch(`${API_URL}/drivers/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longitude: coords.lng, latitude: coords.lat })
      });
      const data = await response.json();
      if (Array.isArray(data)) setNearbyDrivers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const requestGas = async (selectedDriverId) => {
    try {
      const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, driverId: selectedDriverId })
      });
      const data = await response.json();
      setCurrentOrder(data);
      alert("🛒 ¡Pedido enviado con éxito!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.08)' }}>
      <h3>📱 Panel del Cliente</h3>
      <button style={{ width: '100%', padding: '12px', backgroundColor: '#e67e22', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }} onClick={findGas}>
        🔍 Escanear Mi Zona
      </button>
      
      <div style={{ marginTop: '15px' }}>
        {nearbyDrivers.map(d => (
          <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #e67e22' }}>
            <div>
              <strong>{d.driverName}</strong> <br/>
              <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Placa: {d.plate}</span>
            </div>
            <button style={{ backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => requestGas(d._id)}>
              Pedir
            </button>
          </div>
        ))}
      </div>

      {currentOrder && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: currentOrder.status === 'delivered' ? '#e8f8f5' : '#ebf5fb', borderRadius: '8px', border: '1px solid', borderColor: currentOrder.status === 'delivered' ? '#2ecc71' : '#aec6cf' }}>
          <h4>Detalles de tu Solicitud:</h4>
          <p>Estado: <strong style={{ backgroundColor: currentOrder.status === 'delivered' ? '#2ecc71' : '#3498db', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{currentOrder.status.toUpperCase()}</strong></p>
          {currentOrder.eta && <p>⏳ Llegada estimada: <strong>{currentOrder.eta} minutos</strong></p>}
          {currentOrder.status === 'delivered' && <p style={{ color: '#27ae60', fontWeight: 'bold', marginTop: '10px' }}>🎉 ¡El gas llegó a tu destino!</p>}
        </div>
      )}
    </div>
  );
}
