import React, { useState } from "react";
import "./BloombergTheme.css";

function Lifecycle() {
  const [valuationDate, setValuationDate] = useState("");
  const [message, setMessage] = useState("");

  const handlePreview = () => setMessage("Preview VM rows...");
  const handlePost = () => setMessage("VM posted.");
  const handleRoll = () => setMessage("Roll executed.");
  const handleExpire = () => setMessage("Contract expired.");

  return (
    <div className="lifecycle-container">
      <h2>Lifecycle</h2>
      <div className="form-row">
        <label>Valuation Date:</label>
        <input type="date" value={valuationDate} onChange={(e) => setValuationDate(e.target.value)} />
      </div>
      <div className="button-row">
        <button onClick={handlePreview}>Preview</button>
        <button onClick={handlePost}>Post</button>
      </div>
      <h3>Roll Wizard</h3>
      <div className="button-row">
        <button onClick={handleRoll}>Execute Roll</button>
      </div>
      <h3>Expiry</h3>
      <div className="button-row">
        <button onClick={handleExpire}>Expire Contract</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Lifecycle;