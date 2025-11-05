import React from "react";

const Apps = () => {
  const apps = [
    {
      name: "Kite",
      description: "Trading platform for stocks, F&O, commodities",
      icon: "📈",
      status: "Active",
      category: "Trading"
    },
    {
      name: "Coin",
      description: "Mutual fund investment platform",
      icon: "💰",
      status: "Active",
      category: "Investment"
    },
    {
      name: "Console",
      description: "Developer API and tools",
      icon: "⚙️",
      status: "Active",
      category: "Developer"
    },
    {
      name: "Varsity",
      description: "Educational content and courses",
      icon: "📚",
      status: "Active",
      category: "Education"
    },
    {
      name: "Streak",
      description: "Algo trading platform",
      icon: "🤖",
      status: "Active",
      category: "Trading"
    },
    {
      name: "Sensibull",
      description: "Options trading platform",
      icon: "📊",
      status: "Active",
      category: "Trading"
    }
  ];

  const categories = ["All", "Trading", "Investment", "Developer", "Education"];

  return (
    <>
      <h3 className="title">Apps & Tools</h3>
      
      <div className="apps-container">
        <div className="apps-header">
          <p>Discover and manage Zerodha's ecosystem of apps</p>
        </div>

        <div className="apps-grid">
          {apps.map((app, index) => (
            <div key={index} className="app-card">
              <div className="app-icon">{app.icon}</div>
              <div className="app-info">
                <h4>{app.name}</h4>
                <p>{app.description}</p>
                <div className="app-meta">
                  <span className="app-category">{app.category}</span>
                  <span className={`app-status ${app.status.toLowerCase().replace(' ', '-')}`}>
                    {app.status}
                  </span>
                </div>
              </div>
              <div className="app-actions">
                {app.status === "Active" ? (
                  <button className="btn btn-blue">Open</button>
                ) : (
                  <button className="btn btn-grey" disabled>Coming Soon</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="apps-footer">
          <h4>Developer Resources</h4>
          <div className="dev-resources">
            <div className="resource-card">
              <h5>API Documentation</h5>
              <p>Complete API reference for developers</p>
              <button className="btn btn-outline">View Docs</button>
            </div>
            <div className="resource-card">
              <h5>SDK & Libraries</h5>
              <p>Pre-built libraries for popular languages</p>
              <button className="btn btn-outline">Download</button>
            </div>
            <div className="resource-card">
              <h5>Support</h5>
              <p>Get help with integration and development</p>
              <button className="btn btn-outline">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apps;
