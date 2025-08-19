import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import postcodeData from "./postcode_data.json";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093] },
    { id: 2, name: "Trek Majura Park", position: [-35.308, 149.19] }
  ]);

  const [activeStore, setActiveStore] = useState(null);
  const [assignments, setAssignments] = useState({}); // { postcode: storeId }

  // Handle clicking a postcode circle
  const handlePostcodeClick = (pc) => {
    if (!activeStore) {
      alert("Select a store first!");
      return;
    }
    setAssignments((prev) => ({
      ...prev,
      [pc.postcode]: activeStore.id
    }));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Map */}
      <MapContainer center={[-33.8688, 151.2093]} zoom={6} style={{ flex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Store markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={store.position}
            eventHandlers={{
              click: () => setActiveStore(store)
            }}
          >
            <Popup>{store.name}</Popup>
          </Marker>
        ))}

        {/* Postcode centroids */}
        {postcodeData.map((pc) => (
          <CircleMarker
            key={pc.postcode}
            center={[pc.lat, pc.lng]}
            radius={4}
            pathOptions={{
              color:
                assignments[pc.postcode] === activeStore?.id
                  ? "red" // highlight if assigned to active store
                  : assignments[pc.postcode]
                  ? "blue" // already assigned to some store
                  : "grey" // unassigned
            }}
            eventHandlers={{
              click: () => handlePostcodeClick(pc)
            }}
          >
            <Popup>
              <div>
                <strong>Postcode:</strong> {pc.postcode}
                <br />
                <strong>Assigned to:</strong>{" "}
                {assignments[pc.postcode]
                  ? stores.find((s) => s.id === assignments[pc.postcode])?.name
                  : "None"}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Sidebar */}
      <aside style={{ width: "250px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Stores</h3>
        {stores.map((s) => (
          <div key={s.id}>
            <button
              style={{
                background: activeStore?.id === s.id ? "black" : "white",
                color: activeStore?.id === s.id ? "white" : "black",
                padding: "5px 10px",
                margin: "5px 0",
                borderRadius: "5px",
                width: "100%",
                cursor: "pointer"
              }}
              onClick={() => setActiveStore(s)}
            >
              {s.name}
            </button>
          </div>
        ))}

        <h4>Assignments</h4>
        <ul>
          {Object.entries(assignments).map(([pc, storeId]) => (
            <li key={pc}>
              {pc} → {stores.find((s) => s.id === storeId)?.name}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default App;
