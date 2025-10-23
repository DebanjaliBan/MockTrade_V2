import React, { useState } from "react";
import "./BloombergTheme.css";

function TradeBooking() {
  const [instrument, setInstrument] = useState("");
  const [side, setSide] = useState("SELL");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [execTime, setExecTime] = useState(new Date().toISOString().slice(0, 16));
  const [broker, setBroker] = useState("");
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");

  const validateForm = () => {
    if (!instrument) return "Instrument is required.";
    if (!side) return "Side is required.";
    if (!qty || parseInt(qty) <= 0) return "Quantity must be greater than 0.";
    if (!price || parseFloat(price) <= 0) return "Price is required.";
    if (!broker) return "Broker is required.";
    return null;
  };

  const handleBookTrade = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }
    setMessage(`Trade booked for ${instrument} at ${price}.`);
  };

  return (
    <div className="trade-booking-container">
      <h2>Trade Booking</h2>
      <form onSubmit={handleBookTrade}>
        <div className="form-row">
          <label>Instrument:</label>
          <input value={instrument} onChange={(e) => setInstrument(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Side:</label>
          <label><input type="radio" value="BUY" checked={side === "BUY"} onChange={(e) => setSide(e.target.value)} /> Buy</label>
          <label><input type="radio" value="SELL" checked={side === "SELL"} onChange={(e) => setSide(e.target.value)} /> Sell</label>
        </div>
        <div className="form-row">
          <label>Qty:</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Exec Time:</label>
          <input type="datetime-local" value={execTime} onChange={(e) => setExecTime(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Broker:</label>
          <input value={broker} onChange={(e) => setBroker(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Account:</label>
          <input value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>
        <div className="button-row">
          <button type="submit">Book Trade</button>
          <button type="button">Amend</button>
          <button type="button">Cancel Trade</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default TradeBooking;