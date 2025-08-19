import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import postcodeData from "../postcode_data.json";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093] },
    { id: 2, name: "Trek Majura Park", position: [-35.308, 149.19] }
  ]);

  const [activeStore, setActiveStore] = useState(null);
  const [assignments, setAssignments] = useState({}); // { postcode: storeId }

  const onEachPostcode = (feature, layer) => {
    const pc = feature.properties?.postcode || feature.properties?.POA_CODE21;
    layer.on("click", () => {
      if (!activeStore) {
        alert("Select a store first by clicking its marker.");
        return;
      }
      setAssignments((prev) => {
        const newAssignments = { ...prev };
        newAssignments[pc] = activeStore;
        return newAssignments;
      });
      layer.setStyle({ fillColor: "blue", fillOpacity: 0.5 });
    });
  };

  const downloadCSV = () => {
    if (Object.keys(assignments).length === 0) {
      alert("No postcodes assigned.");
      return;
    }
    const rows = [["Postcode", "Store"]];
    for (const [pc, storeId] of Object.entries(assignments)) {
      const storeName = stores.find((s) => s.id === storeId)?.name || "";
      rows.push([pc, storeName]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assignments.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Multi-Store Postcode Assignment Tool</h1>

      <p>
        Click a <b>store marker</b> to set it active. Then click postcode areas
        to assign them. Export when finished.
      </p>

      <div style={{ height: "500px" }}>
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
            <Marker
              key={store.id}
              position={store.position}
              eventHandlers={{ click: () => setActiveStore(store.id) }}
            >
              <Popup>
                <b>{store.name}</b>
                <br />
                {activeStore === store.id
                  ? "Active store (click postcodes to assign)"
                  : "Click marker to activate"}
              </Popup>
            </Marker>
          ))}

          <GeoJSON
            data={postcodeData}
            style={{ color: "red", weight: 1, fillOpacity: 0.1 }}
            onEachFeature={onEachPostcode}
          />
        </MapContainer>
      </div>

      <button
        onClick={downloadCSV}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "black",
          color: "white",
          borderRadius: "8px"
        }}
      >
        Export CSV
      </button>
    </div>
  );
}

export default App;
