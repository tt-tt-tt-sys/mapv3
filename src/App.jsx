import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [stores] = useState([
    { id: 1, name: "Trek Belmont", position: [-33.9688, 151.2093] },
    { id: 2, name: "Trek Majura Park", position: [-35.308, 149.19] }
  ]);

  const [activeStore, setActiveStore] = useState(null);
  const [assignments, setAssignments] = useState({}); // { postcode: storeId }
  const [postcodeData, setPostcodeData] = useState(null);

  // ✅ Load postcode_data.json dynamically
  useEffect(() => {
    fetch("/postcode_data.json")
      .then((res) => res.json())
      .then((data) => setPostcodeData(data))
      .catch((err) => console.error("Failed to load postcode_data.json", err));
  }, []);

  const onEachPostcode = (feature, layer) => {
    const pc = feature.properties.postcode;

    layer.on("click", () => {
      if (!activeStore) return;

      setAssignments((prev) => {
        const newAssignments = { ...prev };

        // Toggle assign/unassign
        if (newAssignments[pc] === activeStore.id) {
          delete newAssignments[pc];
        } else {
          newAssignments[pc] = activeStore.id;
        }

        return newAssignments;
      });
    });
  };

  const stylePostcode = (feature) => {
    const pc = feature.properties.postcode;
    const storeId = assignments[pc];

    if (storeId) {
      const color = storeId === 1 ? "blue" : "green";
      return { color, weight: 1, fillColor: color, fillOpacity: 0.4 };
    }

    return { color: "grey", weight: 1, fillOpacity: 0.1 };
  };

  // ✅ CSV export
  const exportCSV = () => {
    let csv = "Postcode,Store\n";
    Object.entries(assignments).forEach(([pc, storeId]) => {
      const store = stores.find((s) => s.id === storeId);
      csv += `${pc},${store.name}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assignments.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Map */}
      <MapContainer
        center={[-28, 133]}
        zoom={4}
        style={{ flex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {postcodeData && (
          <GeoJSON
            data={postcodeData}
            style={stylePostcode}
            onEachFeature={onEachPostcode}
          />
        )}
        {stores.map((s) => (
          <Marker key={s.id} position={s.position}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Sidebar controls */}
      <div style={{ width: "300px", padding: "10px", borderLeft: "1px solid #ccc" }}>
        <h3>Assign Postcodes</h3>
        {stores.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStore(s)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              backgroundColor: activeStore?.id === s.id ? "black" : "lightgrey",
              color: activeStore?.id === s.id ? "white" : "black",
              padding: "8px"
            }}
          >
            {s.name}
          </button>
        ))}

        <button
          onClick={exportCSV}
          style={{
            display: "block",
            width: "100%",
            backgroundColor: "green",
            color: "white",
            padding: "8px"
          }}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default App;
