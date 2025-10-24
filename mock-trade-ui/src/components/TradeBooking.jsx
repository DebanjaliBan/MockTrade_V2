
import React, { useState, useEffect } from "react";
import "./BloombergTheme.css";

function TradeBooking() {
  const [instrument, setInstrument] = useState("GOVT10Y FUT SEP25");
  const [side, setSide] = useState("SELL");
  const [qty, setQty] = useState("5");
  const [price, setPrice] = useState("101.60");
  const [execTime, setExecTime] = useState("");
  const [broker, setBroker] = useState("BRK-NB");
  const [account, setAccount] = useState("ACC-TRAIN");
  const [message, setMessage] = useState("");
  const [trades, setTrades] = useState([]);
  const [selectedTradeId, setSelectedTradeId] = useState(null);

  const fetchTrades = async () => {
    try {
      const response = await fetch("http://localhost:8000/trade/");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setMessage("Could not load trades from server.");
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleBookTrade = async () => {
    setMessage("");
    const tradeData = {
      instrument_id: instrument,
      side,
      qty: parseInt(qty, 10),
      price: parseFloat(price),
      exec_time: execTime || new Date().toISOString(),
      broker_id: broker,
      account_id: account,
    };
    try {
      const response = await fetch("http://localhost:8000/trade/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fetchTrades();
      setMessage("Trade booked successfully.");
    } catch (error) {
      console.error("Error booking trade:", error);
      setMessage(`Booking failed: ${error.message}`);
    }
  };

  const handleAmendTrade = async () => {
    if (!selectedTradeId) return;
    const tradeData = {
      instrument_id: instrument,
      side,
      qty: parseInt(qty, 10),
      price: parseFloat(price),
      exec_time: execTime || new Date().toISOString(),
      broker_id: broker,
      account_id: account,
    };
    try {
      const response = await fetch(`http://localhost:8000/trade/${selectedTradeId}/amend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fetchTrades();
      setMessage("Trade amended successfully.");
    } catch (error) {
      console.error("Error amending trade:", error);
      setMessage(`Amend failed: ${error.message}`);
    }
  };

  const handleCancelTrade = async () => {
    if (!selectedTradeId) return;
    try {
      const response = await fetch(`http://localhost:8000/trade/${selectedTradeId}/cancel`, {
        method: "POST"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fetchTrades();
      setMessage("Trade cancelled.");
      setSelectedTradeId(null);
    } catch (error) {
      console.error("Error cancelling trade:", error);
      setMessage("Cancel failed.");
    }
  };

  const handleExportVisibleTrades = () => {
    if (trades.length === 0) {
      setMessage("No trades to export.");
      return;
    }
    const headers = ["TradeId", "OrderId", "Instrument", "Side", "Qty", "Price", "Status", "ExecTime"];
    const rows = trades.map(t => [
      t.id,
      t.order_id,
      t.instrument,
      t.side,
      t.qty,
      t.price,
      t.status,
      t.exec_time ? new Date(t.exec_time).toLocaleString() : ""
    ]);
    const csvContent = [headers, ...rows]
      .map(e => e.map(v => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "trades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="order-entry-container">
      <h3>Trade Booking</h3>
      <div className="form-row-inline">
        <label>Instrument:</label>
        <input value={instrument} onChange={(e) => setInstrument(e.target.value)} />
        <label style={{ marginLeft: "20px" }}>Side:</label>
        <label><input type="radio" value="BUY" checked={side === "BUY"} onChange={() => setSide("BUY")} />Buy</label>
        <label><input type="radio" value="SELL" checked={side === "SELL"} onChange={() => setSide("SELL")} />Sell</label>
      </div>
      <div className="form-row-inline">
        <label>Qty:</label>
        <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" />
        <label style={{ marginLeft: "20px" }}>Price:</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" />
        <label style={{ marginLeft: "20px" }}>Exec Time:</label>
        <input value={execTime} onChange={(e) => setExecTime(e.target.value)} type="datetime-local" />
      </div>
      <div className="form-row-inline">
        <label>Broker:</label>
        <input value={broker} onChange={(e) => setBroker(e.target.value)} />
        <label style={{ marginLeft: "20px" }}>Account:</label>
        <input value={account} onChange={(e) => setAccount(e.target.value)} />
      </div>
      <div className="button-row">
        <button type="button" onClick={handleBookTrade}>Book Trade</button>
        <button type="button" disabled={!selectedTradeId} onClick={handleAmendTrade}>Amend</button>
        <button type="button" disabled={!selectedTradeId} onClick={handleCancelTrade}>Cancel Trade</button>
      </div>
      {message && <div className="message">{message}</div>}
      <hr />
      <h4>Trade Blotter</h4>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={handleExportVisibleTrades}
          style={{
            backgroundColor: '#007BFF',
            color: 'white',
            fontWeight: 'bold',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export
        </button>
      </div>
      <table className="orders-table blotter">
        <thead>
          <tr>
            <th>TradeId</th>
            <th>OrderId</th>
            <th>Instr</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>ExecTime</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr
              key={t.id}
              onClick={() => setSelectedTradeId(t.id)}
              className={selectedTradeId === t.id ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>{t.id}</td>
              <td>{t.order_id}</td>
              <td>{t.instrument}</td>
              <td>{t.side}</td>
              <td>{t.qty}</td>
              <td>{t.price}</td>
              <td><span className={`status-badge status-${(t.status || '').toLowerCase()}`}>{t.status}</span></td>
              <td>{t.exec_time ? new Date(t.exec_time).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradeBooking;
