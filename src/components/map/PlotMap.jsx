import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function scoreColor(score) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function FitBounds({ farmers }) {
  const map = useMap();
  useEffect(() => {
    if (farmers.length > 0) {
      const bounds = farmers.map(f => [f.lat, f.lng]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [farmers, map]);
  return null;
}

export default function PlotMap({ farmers, onSelect, height = 420 }) {
  return (
    <MapContainer
      center={[22.5, 79.0]}
      zoom={5}
      style={{ height, width: '100%', borderRadius: 'var(--radius-lg)' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <FitBounds farmers={farmers} />
      {farmers.map(f => (
        <CircleMarker
          key={f.id}
          center={[f.lat, f.lng]}
          radius={14}
          pathOptions={{
            fillColor: scoreColor(f.healthScore),
            fillOpacity: 0.88,
            color: '#fff',
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelect && onSelect(f) }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong style={{ fontSize: 13 }}>{f.name}</strong>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{f.village}</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11 }}>Health Score:</span>
                <strong style={{ color: scoreColor(f.healthScore), fontSize: 13 }}>{f.healthScore}</strong>
              </div>
              <div style={{ fontSize: 11, marginTop: 2 }}>🌱 {f.cropType} · {f.plotSize} acre</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
