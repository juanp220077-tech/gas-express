import React, { useState, useEffect } from 'react';

export default function DriverPanel({ API_URL, currentOrder, setCurrentOrder }) {
  const [driverId] = useState("65f987654321098765432109");

  useEffect(() => {
    const checkIncomingOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/driver/${driverId}`);
        if (response.ok) {
          const orderData = await response.json();
          if (orderData) {
            setCurrentOrder(orderData);
          }
        }
      } catch (err) {
        console.error("Error al consultar órdenes:", err);
      }
    };

    checkIncomingOrders();
    const interval = setInterval(checkIncomingOrders, 3000);
    return () => clearInterval(interval);
  }, [driverId, API_URL, setCurrentOrder]);

  const acceptOrder = async () => {
    if (!currentOrder) return;
    try {
      const response = await fetch(`${API_URL}/orders/accept/${currentOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId })
      });
      const data = await response.json();
      setCurrentOrder(data);
      alert("⚡ ¡Pedido aceptado!");
    } catch (err) {
      console.error(err);
    }
  };

  const completeDelivery = async () => {
    if (!currentOrder) return;
    try {
      const response = await fetch(`${API_URL}/orders/deliver/${currentOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentOrder(data);
        alert("📦 ¡Tanque de gas entregado con éxito!");
      }
    } catch (err) {
      console.error("Error al completar la entrega:", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.08)', borderTop: '5px solid #2ecc71' }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>🚛 Panel del Distribuidor Exclusivo</h3>
      <p style={{ fontSize: '0.85rem', color: '#7f8c8d', textAlign: 'center' }}>📡 Monitoreando base de datos en tiempo real...</p>
      
      {currentOrder && currentOrder.status === 'pending' ? (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <p style={{ fontWeight: 'bold', color: '#c0392b', fontSize: '1.1rem' }}>⚠️ ¡SOLICITUD ENTRANTE EN TU ZONA!</p>
          <button style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#2ecc71' }} onClick={acceptOrder}>
            ⚡ Aceptar Servicio
          </button>
        </div>
      ) : currentOrder && currentOrder.status === 'accepted' ? (
        <div style={{ backgroundColor: '#e8f8f5', padding: '15px', borderRadius: '8px', textAlign: 'center', color: '#117a65', marginTop: '15px' }}>
          <p>✅ Pedido aceptado. Ruta trazada hacia el domicilio.</p>
          <p>ETA asignado: <strong>{currentOrder.eta} min.</strong></p>
          <button style={{ width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#e74c3c', marginTop: '15px' }} onClick={completeDelivery}>
            🛑 Marcar como Entregado
          </button>
        </div>
      ) : currentOrder && currentOrder.status === 'delivered' ? (
        <div style={{ backgroundColor: '#e8f8f5', padding: '15px', borderRadius: '8px', textAlign: 'center', color: '#117a65', marginTop: '15px' }}>
          <p>🎉 Entrega finalizada con éxito.</p>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#95a5a6', margin: '20px 0' }}>Esperando solicitudes de clientes en el sector...</p>
      )}
    </div>
  );
}
