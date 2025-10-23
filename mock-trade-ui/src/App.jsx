import React from 'react';
import OrderEntry from './components/TradingDashboard';
import './components/_blotter_override.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <OrderEntry />
    </div>
  );
}

export default App;

