import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icon for stores
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Demo postcode polygons
const SAMPLE_POSTCODES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { pcode: "2000", name: "Sydney CBD" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [151.197, -33.878],
            [151.21, -33.878],
            [151.21, -33.865],
            [151.197, -33.865],
            [151.197, -33.878],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { pcode: "3000", name: "Melbourne CBD" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [144.955, -37.823],
            [144.979, -37.823],
            [144.979, -37.804],
            [144.955, -37.804],
            [144.955, -37.823],
          ],
        ],
      },
    },
  ],
};

// Download CSV
function downloadCSV(filename, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("No data to export.");
    return;
  }
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).join(",")).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendC
