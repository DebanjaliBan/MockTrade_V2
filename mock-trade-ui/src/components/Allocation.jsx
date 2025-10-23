import React, { useState } from "react";
import "./BloombergTheme.css";

function Allocation() {
  const [allocations, setAllocations] = useState([{ account: "ACC-A", qty: 6 }, { account: "ACC-B", qty: 4 }]);
  const [message, setMessage] = useState("");

  const handlePropose = () => setMessage("Allocation proposed.");
  const handleFinalize = () => setMessage("Allocation finalized.");

  return (
    <div className="allocation-container">
      <h2>Allocation</h2>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>AllocQty</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((alloc, idx) => (
            <tr key={idx}>
              <td>{alloc.account}</td>
              <td><input type="number" value={alloc.qty} onChange={(e) => {
                const newAlloc = [...allocations];
                newAlloc[idx].qty = parseInt(e.target.value);
                setAllocations(newAlloc);
              }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-row">
        <button onClick={handlePropose}>Propose</button>
        <button onClick={handleFinalize}>Finalize (Ops)</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Allocation;