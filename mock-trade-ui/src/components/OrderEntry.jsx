import React, { useState, useEffect } from "react";
import "./BloombergTheme.css";

function OrderEntry() {
  const [instrument, setInstrument] = useState("INS-GOV5Y-SEP25");
  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState("10");
  const [price, setPrice] = useState("101.55");
  const [type, setType] = useState("LIMIT");
  const [tif, setTif] = useState("DAY");
  const [trader, setTrader] = useState("TRDR01");
  const [account, setAccount] = useState("ACC-TRAIN");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Filters
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterTrader, setFilterTrader] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/order/");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("Could not load orders from server.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!instrument || !qty || !trader) {
      setMessage("Instrument, Qty, and Trader are required.");
      return;
    }
    const orderData = {
      instrument,
      side,
      qty: parseInt(qty, 10),
      price: type === "LIMIT" && price !== "" ? parseFloat(price) : null,
      type,
      tif,
      trader,
      account,
    };
    try {
      const response = await fetch("http://localhost:8000/order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`${err} HTTP ${response.status}`);
      }
      await fetchOrders();
      setMessage("Order submitted successfully.");
    } catch (error) {
      console.error("Error submitting order:", error);
      setMessage(`Submit failed: ${error.message}`);
    }
  };

  const handleSimulateFill = async () => {
    if (!selectedOrderId) return;
    try {
      const res = await fetch(`http://localhost:8000/order/${selectedOrderId}/simulate_fill`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchOrders();
      setMessage('Simulated fill');
      setSelectedOrderId(null);
    } catch (err) {
      console.error(err);
      setMessage('Simulate Fill failed');
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const res = await fetch(`http://localhost:8000/order/${selectedOrderId}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchOrders();
      setMessage('Order cancelled');
      setSelectedOrderId(null);
    } catch (err) {
      console.error(err);
      setMessage('Cancel failed');
    }
  };

  // ✅ Export function inside component
  const handleExportVisibleRows = () => {
    if (filteredOrders.length === 0) {
      setMessage("No rows to export.");
      return;
    }

    const headers = ["ID", "Instrument", "Side", "Qty", "Price", "Trader", "Status", "Created"];
    const rows = filteredOrders.map(o => [
      o.id,
      o.instrument,
      o.side,
      o.qty,
      o.price,
      o.trader,
      o.status,
      o.created_at ? new Date(o.created_at).toLocaleString() : ""
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.map(v => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "visible_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterInstrument && !o.instrument?.toLowerCase().includes(filterInstrument.toLowerCase())) return false;
    if (filterTrader && !o.trader?.toLowerCase().includes(filterTrader.toLowerCase())) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    if (filterDate) {
      const od = o.created_at ? new Date(o.created_at).toISOString().slice(0, 10) : "";
      if (od !== filterDate) return false;
    }
    return true;
  });

  return (
    <div className="order-entry-container">
      <h3>Order Entry</h3>
      <form onSubmit={handleSubmit} className="order-form">
        {/* Form rows */}
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
          <label style={{ marginLeft: "20px" }}>Price (Limit):</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" />
          <label style={{ marginLeft: "20px" }}>Type:</label>
          <label><input type="radio" value="LIMIT" checked={type === "LIMIT"} onChange={() => setType("LIMIT")} />Limit</label>
          <label><input type="radio" value="MARKET" checked={type === "MARKET"} onChange={() => setType("MARKET")} />Market</label>
        </div>
        <div className="form-row-inline">
          <label>TIF:</label>
          <label><input type="radio" value="DAY" checked={tif === "DAY"} onChange={() => setTif("DAY")} />Day</label>
          <label><input type="radio" value="IOC" checked={tif === "IOC"} onChange={() => setTif("IOC")} />IOC</label>
          <label style={{ marginLeft: "20px" }}>Trader:</label>
          <input value={trader} onChange={(e) => setTrader(e.target.value)} />
          <label style={{ marginLeft: "20px" }}>Account:</label>
          <input value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>
        <div className="button-row">
          <button type="submit">Submit</button>
          <button type="button" disabled={!selectedOrderId} onClick={handleSimulateFill}>Simulate Fill</button>
          <button type="button" disabled={!selectedOrderId} onClick={handleCancelOrder}>Cancel Order</button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>
      <hr />
      <h4>Orders</h4>

      {/* ✅ Export button above table */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={handleExportVisibleRows}
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
            <th>ID</th>
            <th>
              Instrument
              <div className="header-filter">
                <input placeholder="Symbol/Instr" value={filterInstrument} onChange={(e) => setFilterInstrument(e.target.value)} />
              </div>
            </th>
            <th>Side</th>
            <th>Qty</th>
            <th>Price</th>
            <th>
              Trader
              <div className="header-filter">
                <input placeholder="Trader" value={filterTrader} onChange={(e) => setFilterTrader(e.target.value)} />
              </div>
            </th>
            <th>
              Status
              <div className="header-filter">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="NEW">New</option>
                  <option value="FILLED">Filled</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </th>
            <th>
              Created
              <div className="header-filter">
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <tr
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              className={selectedOrderId === o.id ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>{o.id}</td>
              <td>{o.instrument}</td>
              <td>{o.side}</td>
              <td>{o.qty}</td>
              <td>{o.price}</td>
              <td>{o.trader}</td>
              <td>
                <span className={`status-badge status-${(o.status || '').toLowerCase()}`}>{o.status}</span>
              </td>
              <td>{o.created_at ? new Date(o.created_at).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderEntry;