import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CSVLink } from "react-csv";
import "leaflet/dist/leaflet.css";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093] },
    { id: 2, name: "Trek Majura Park", position: [-35.3080, 149.1900] }
  ]);

  const [selectedPostcodes, setSelectedPostcodes] = useState([]);

  const handleAssignPostcode = (storeId, postcode) => {
    setSelectedPostcodes((prev) => [...prev, { storeId, postcode }]);
  };

  const csvData = selectedPostcodes.map((entry) => {
    const store = stores.find((s) => s.id === entry.storeId);
    return {
      Store: store?.name || "",
      Postcode: entry.postcode
    };
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Multi-Store Postcode Assignment Tool</h1>

      <div style={{ height: "500px", width: "100%", marginBottom: "1rem" }}>
        <MapContainer
          center={[-33.8688, 151.2093]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {stores.map((store) => (
            <Marker key={store.id} position={store.position}>
              <Popup>
                <b>{store.name}</b>
                <br />
                <button
                  onClick={() =>
                    handleAssignPostcode(store.id, prompt("Enter postcode:"))
                  }
                >
                  Assign Postcode
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <CSVLink
        data={csvData}
        filename="postcode-assignments.csv"
        style={{
          background: "#0070f3",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          textDecoration: "none"
        }}
      >
        Export CSV
      </CSVLink>
    </div>
  );
}

export default App;
