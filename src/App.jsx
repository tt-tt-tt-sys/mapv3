import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import postcodeData from "./postcode_data.json";
import MarkerClusterGroup from "react-leaflet-cluster";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093], color: "red" },
    { id: 2, name: "Trek Majura Park", position: [-35.308, 149.19], color: "blue" }
  ]);

  const [activeStore, setActiveStore] = useState(null);
  const [assignments, setAssignments] = useState({}); // { postcode: storeId }

  // Assign/unassign postcodes when clicked
  const onEachPostcode = (feature, layer) => {
    const pc = feature.properties.postcode;
    layer.on({
      click: () => {
        if (!activeStore) return;
        setAssignments((prev) => {
          const newAssignments = { ...prev };
          if (newAssignments[pc] === activeStore.id) {
            delete newAssignments[pc]; // unassign if already assigned
          } else {
            newAssignments[pc] = activeStore.id;
          }
          return newAssignments;
        });
      }
    });
  };

  // Style postcodes
  const stylePostcode = (feature) => {
    const pc = feature.properties.postcode;
    const storeId = assignments[pc];
    if (!storeId) {
      return { color: "grey", weight: 1, fillOpacity: 0.1 };
    }
    const store = stores.find((s) => s.id === storeId);
    return {
      color: store.color,
      weight: 2,
      fillOpacity: 0.5,
    };
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar controls */}
      <aside style={{ width: "250px", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h2>Stores</h2>
        {stores.map((s) => (
          <button
            key={s.id}
            style={{
              display: "block",
              width: "100%",
              margin: "5px 0",
              padding: "10px",
              background: activeStore?.id === s.id ? s.color : "#eee",
              color: activeStore?.id === s.id ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => setActiveStore(s)}
          >
            {s.name}
          </button>
        ))}
        <pre style={{ marginTop: "20px", fontSize: "12px" }}>
          {JSON.stringify(assignments, null, 2)}
        </pre>
      </aside>

      {/* Map */}
      <MapContainer center={[-25, 133]} zoom={5} style={{ flex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Clustered postcodes */}
        <MarkerClusterGroup chunkedLoading>
          {postcodeData.features.map((feature, idx) => (
            <GeoJSON
              key={idx}
              data={feature}
              style={stylePostcode}
              onEachFeature={onEachPostcode}
            />
          ))}
        </MarkerClusterGroup>

        {/* Store markers */}
        {stores.map((s) => (
          <Marker key={s.id} position={s.position}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
