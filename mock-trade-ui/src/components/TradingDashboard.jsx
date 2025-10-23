import React, { useState } from "react";
import OrderEntry from "./OrderEntry";
import TradeBooking from "./TradeBooking";
import Allocation from "./Allocation";
import Lifecycle from "./Lifecycle";
import "./TradingDashboard.css";

function TradingDashboard() {
  const [activeTab, setActiveTab] = useState("order");

  const renderContent = () => {
    switch (activeTab) {
      case "order":
        return <OrderEntry />;
      case "trade":
        return <TradeBooking />;
      case "allocation":
        return <Allocation />;
      case "lifecycle":
        return <Lifecycle />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Mock Trade Booking – Bond Futures</h2>
      <div className="tab-bar">
        <button
          className={activeTab === "order" ? "active" : ""}
          onClick={() => setActiveTab("order")}
        >
          Order Entry
        </button>
        <button
          className={activeTab === "trade" ? "active" : ""}
          onClick={() => setActiveTab("trade")}
        >
          Trade Booking
        </button>
        <button
          className={activeTab === "allocation" ? "active" : ""}
          onClick={() => setActiveTab("allocation")}
        >
          Allocation
        </button>
        <button
          className={activeTab === "lifecycle" ? "active" : ""}
          onClick={() => setActiveTab("lifecycle")}
        >
          Lifecycle
        </button>
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

export default TradingDashboard;