import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import postcodeData from "./postcode_data.json";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093] },
    { id: 2, name: "Trek Majura Park", position: [-35.308, 149.19] }
  ]);

  const [activeStore, setActiveStore] = useState(null);
  const [assignments, setAssignments] = useState({}); // { postcode: storeId }

  // Function to handle postcode polygons
  const onEachPostcode = (feature, layer) => {
    const postcode = feature.properties.POA_CODE21; // adjust key if different in your JSON

    // Dynamic polygon color
    const getColor = () => {
      if (assignments[postcode] === activeStore?.id) return "blue";
      if (assignments[postcode]) return "gray";
      return "lightgray";
    };

    layer.setStyle({
      color: "black",
      weight: 1,
      fillColor: getColor(),
      fillOpacity: 0.5,
    });

    // Click to toggle assignment
    layer.on("click", () => {
      if (!activeStore) {
        alert("Select a store first, then click a postcode.");
        return;
      }

      setAssignments((prev) => {
        const newAssignments = { ...prev };
        if (newAssignments[postcode] === activeStore.id) {
          delete newAssignments[postcode]; // unassign if already assigned
        } else {
          newAssignments[postcode] = activeStore.id; // assign to active store
        }
        return newAssignments;
      });
    });

    // Popup info
    layer.bindPopup(`Postcode: ${postcode}`);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Map Section */}
      <MapContainer
        center={[-33.8688, 151.2093]}
        zoom={6}
        style={{ flex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Store markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={store.position}
            eventHandlers={{
              click: () => setActiveStore(store),
            }}
          >
            <Popup>
              <strong>{store.name}</strong>
              <br />
              Click to set active store
            </Popup>
          </Marker>
        ))}

        {/* Postcodes Layer */}
        <GeoJSON data={postcodeData} onEachFeature={onEachPostcode} />
      </MapContainer>

      {/* Sidebar Controls */}
      <aside style={{ width: "300px", padding: "10px", borderLeft: "1px solid #ccc" }}>
        <h2>Stores</h2>
        <ul>
          {stores.map((store) => (
            <li key={store.id}>
              <button
                style={{
                  fontWeight: activeStore?.id === store.id ? "bold" : "normal",
                }}
                onClick={() => setActiveStore(store)}
              >
                {store.name}
              </button>
            </li>
          ))}
        </ul>

        <h3>Assignments</h3>
        <pre>{JSON.stringify(assignments, null, 2)}</pre>
      </aside>
    </div>
  );
}

export default App;
