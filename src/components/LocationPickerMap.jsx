import React, { useEffect, useRef, useState } from 'react';

export default function LocationPickerMap({ value, onChange, label = "Pin Lokasi Usaha di Peta (Leaflet OpenStreetMap)" }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markerRef = useRef(null);

  // Default coordinate: Jakarta (neutral center point for Indonesia)
  const [coords, setCoords] = useState(value || { lat: -6.2088, lng: 106.8456, address: 'Jakarta, Indonesia' });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Reverse geocoding lookup using free Nominatim OSM API
  const fetchAddress = async (lat, lng) => {
    setIsLoadingAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        const shortAddress = data.address?.city || data.address?.town || data.address?.regency || data.address?.county || data.display_name.split(',')[0];
        const stateName = data.address?.state || '';
        const fullAddr = `${shortAddress}${stateName ? ', ' + stateName : ''}`;
        const updated = { lat, lng, address: fullAddr || data.display_name };
        setCoords(updated);
        if (onChange) onChange(updated);
      } else {
        const updated = { lat, lng, address: `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
        setCoords(updated);
        if (onChange) onChange(updated);
      }
    } catch {
      const updated = { lat, lng, address: `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
      setCoords(updated);
      if (onChange) onChange(updated);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Forward geocoding - search location by name/address
  const searchLocation = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchError('Masukkan minimal 3 karakter untuk pencarian');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&countrycodes=id`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0]; // Take first result
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const address = result.display_name;

        const updated = { lat, lng, address };
        setCoords(updated);

        // Update map center and marker position
        if (leafletInstance.current && markerRef.current) {
          leafletInstance.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
          markerRef.current.bindPopup(`<b>Lokasi Usaha</b><br/>${address}`).openPopup();
        }

        if (onChange) onChange(updated);
      } else {
        setSearchError('Lokasi tidak ditemukan. Coba kata kunci lain.');
      }
    } catch (error) {
      setSearchError('Gagal mencari lokasi. Periksa koneksi internet.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let pollInterval = null;

    const initMap = () => {
      if (!isMounted || !mapRef.current || !window.L || leafletInstance.current) return;
      const L = window.L;

      try {
        // Initialize map instance
        const map = L.map(mapRef.current, {
          center: [coords.lat, coords.lng],
          zoom: 12,
          zoomControl: true
        });

        // Add OpenStreetMap tile layer (Free Tier)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Custom green marker icon
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: #059669;
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 12px rgba(5, 150, 105, 0.5);
            ">
              <div style="
                width: 10px;
                height: 10px;
                background-color: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        // Add draggable marker
        const marker = L.marker([coords.lat, coords.lng], {
          icon: customIcon,
          draggable: true
        }).addTo(map);

        marker.bindPopup(`<b>Lokasi Usaha</b><br/>${coords.address}`).openPopup();

        marker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          marker.setLatLng([lat, lng]);
          fetchAddress(lat, lng);
        });

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          fetchAddress(lat, lng);
        });

        leafletInstance.current = map;
        markerRef.current = marker;

        // Invalidate map size after rendering in modal
        setTimeout(() => {
          if (map && map._container) {
            map.invalidateSize();
          }
        }, 300);
      } catch (err) {
        console.error('Error initializing Leaflet map:', err);
      }
    };

    // Ensure Leaflet CSS is loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (window.L) {
      initMap();
    } else {
      let script = document.getElementById('leaflet-js');
      if (!script) {
        script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          if (isMounted) initMap();
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', () => {
          if (isMounted) initMap();
        });
      }

      // Polling fallback in case script is already loaded asynchronously
      pollInterval = setInterval(() => {
        if (window.L && !leafletInstance.current) {
          clearInterval(pollInterval);
          initMap();
        }
      }, 200);
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>
          {label} <span style={{ color: 'var(--critical-red)' }}>*</span>
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--primary-green)', fontWeight: 600 }}>
          💡 Klik / geser pin di peta
        </span>
      </div>

      {/* Search Location Input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari alamat (contoh: Bandung, Jawa Barat)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchLocation(searchQuery);
            }
          }}
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            border: '1.5px solid var(--card-border)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => searchLocation(searchQuery)}
          disabled={isSearching}
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: 'var(--primary-green)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: isSearching ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isSearching ? '🔍 Mencari...' : '🔍 Cari'}
        </button>
      </div>

      {searchError && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--critical-red)',
          backgroundColor: 'var(--critical-red-light)',
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
        }}>
          ⚠️ {searchError}
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '210px',
          borderRadius: '8px',
          border: '1.5px solid var(--card-border)',
          overflow: 'hidden',
          zIndex: 1
        }}
      />

      {/* Location Status Card */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '6px',
        padding: '0.55rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>📍</span>
          <div>
            <div style={{ fontWeight: 700, color: '#047857' }}>
              {isLoadingAddress ? 'Mencari nama alamat...' : coords.address}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#047857',
          backgroundColor: '#dcfce7',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          Pin Tersemat
        </div>
      </div>
    </div>
  );
}
