  <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
    <div className="lg:col-span-3">
      <div className="h-[70vh] rounded-2xl overflow-hidden border">
        <MapContainer center={[-27, 134]} zoom={4} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToData stores={stores} />

          {/* Postcode polygons via GeoJSON. Style based on first matching store. */}
          {features.map((f, idx) => {
            // Determine fill color by first store that includes this postcode
            let fill = "#94a3b8"; // slate-400 default
            for (const s of stores) {
              if (assignments?.get(s.id)?.has(f?.properties?.pcode)) {
                fill = colorByStore[s.id] || fill;
                break;
              }
            }
            return (
              <GeoJSON
                key={f?.properties?.pcode || idx}
                data={f}
                style={() => ({ color: "#111827", weight: 0.5, fillColor: fill, fillOpacity: 0.25 })}
              />
            );
          })}

          {/* Store markers + radii */}
          {stores.map((s) => (
            <React.Fragment key={s.id}>
              <Marker position={[s.lat, s.lng]} icon={markerIcon}>
                <Popup>
                  <div className="space-y-2">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm">Radius: {s.radiusKm} km</div>
                    <button
                      onClick={() => exportPerStoreCSV(s.id)}
                      className="px-3 py-1 rounded bg-black text-white text-sm"
                    >
                      Download CSV
                    </button>
                  </div>
                </Popup>
              </Marker>
              <Circle center={[s.lat, s.lng]} radius={s.radiusKm * 1000} pathOptions={{ color: colorByStore[s.id] || "#2563eb" }} />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>

    {/* Controls */}
    <aside className="space-y-4">
      <div className=\"p-4 border rounded-2xl\">
        <div className=\"flex flex-col gap-2\">
          <button onClick={exportCombinedCSV} className=\"w-full px-4 py-2 rounded-xl bg-black text-white\">
            Export Combined CSV
          </button>
          <button onClick={exportMatrixCSV} className=\"w-full px-4 py-2 rounded-xl bg-black text-white\">
            Export Matrix CSV
          </button>
        </div>
        <div className=\"text-xs text-gray-500 mt-2 space-y-1\">
          <p>Combined: <code>store, postcode</code> for all stores.</p>
          <p>Matrix: rows=postcodes, columns=stores, values in {0,1}.</p>
        </div>
      </div>

      {/* Diagnostics Panel */}
      <div className="p-4 border rounded-2xl">
        <h3 className="font-semibold mb-2">Diagnostics</h3>
        <ul className="text-xs space-y-1">
          {diag.map((t, i) => (
            <li key={i} className={t.pass ? "text-green-600" : "text-red-600"}>
              {t.pass ? "✔" : "✖"} {t.name}
            </li>
          ))}
        </ul>
        {isSample ? (
          <p className="text-[11px] text-gray-500 mt-2">
            Using sample data: SYD→2000; MEL→3000,3057 should be green.
          </p>
        ) : (
          <p className="text-[11px] text-gray-500 mt-2">Upload real data to re-run generic checks.</p>
        )}
      </div>
    </aside>
  </div>

  <footer className="p-4 text-xs text-gray-500">
    <p>
      Preview uses a tiny demo GeoJSON. For production, upload full AU postcode polygons (ABS Postal Areas or Australia Post postcode boundaries) as a GeoJSON FeatureCollection with <code>properties.pcode</code>.
    </p>
  </footer>
</div>
