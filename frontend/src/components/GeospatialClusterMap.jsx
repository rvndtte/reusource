import React, { useState } from 'react';
import { AnimatedMapPinIcon, AnimatedSlidersIcon, AnimatedShieldIcon, AnimatedActivityIcon } from './AnimatedIcons';

const WORKSHOP_NODES = [
  { id: 1, name: 'Bengkel Kayu Cluster A', x: 120, y: 160, volume: '850 kg/hr', moisture: '11.5%', status: 'Verified' },
  { id: 2, name: 'Penggergajian Regional B', x: 210, y: 110, volume: '1,200 kg/hr', moisture: '10.8%', status: 'Verified' },
  { id: 3, name: 'Sentra Mebel Regional C', x: 380, y: 190, volume: '620 kg/hr', moisture: '12.1%', status: 'Verified' },
  { id: 4, name: 'Pengrajin Kayu Regional D', x: 190, y: 230, volume: '940 kg/hr', moisture: '11.0%', status: 'Verified' },
  { id: 5, name: 'Industri Serbuk Regional E', x: 80, y: 220, volume: '750 kg/hr', moisture: '10.5%', status: 'Verified' },
  { id: 6, name: 'Kluster Kayu Regional F', x: 420, y: 240, volume: '1,100 kg/hr', moisture: '11.8%', status: 'Verified' },
];

const CLUSTER_CENTER = { x: 250, y: 180 };

export default function GeospatialClusterMap() {
  const [aggregationProgress, setAggregationProgress] = useState(75);
  const [selectedNode, setSelectedNode] = useState(WORKSHOP_NODES[0]);

  const isFullCluster = aggregationProgress >= 100;

  return (
    <div style={{
      backgroundColor: 'var(--surface-charcoal)',
      border: '1px solid var(--border-industrial)',
      borderRadius: '8px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Map Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AnimatedMapPinIcon size={18} color="var(--biomass-ochre)" />
            <h3 className="font-headline" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Peta Kluster Pasokan Geospasial
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Nodus agregasi serbuk kayu mikro Jawa (Radius 5–10 km)
          </p>
        </div>

        {/* Status Pill */}
        <div style={{
          padding: '4px 10px',
          borderRadius: '4px',
          backgroundColor: isFullCluster ? 'var(--verified-green-bg)' : 'var(--biomass-ochre-bg)',
          border: isFullCluster ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
          color: isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <AnimatedActivityIcon size={14} color={isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)'} />
          <span>{isFullCluster ? 'KLUSTER PENUH — READY PICKUP' : `Agregasi Kuota: ${aggregationProgress}%`}</span>
        </div>
      </div>

      {/* Map Canvas (Industrial Micro-Grid) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        backgroundColor: '#090c10',
        borderRadius: '6px',
        border: '1px solid var(--border-industrial)',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <pattern id="industrial-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21262d" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#industrial-grid-pattern)" />

          {/* Connection Lines */}
          {WORKSHOP_NODES.map((node) => {
            const opacity = (aggregationProgress / 100) * 0.95;
            return (
              <line
                key={`line-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={CLUSTER_CENTER.x}
                y2={CLUSTER_CENTER.y}
                stroke={isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)'}
                strokeWidth={isFullCluster ? 2.5 : 1.5}
                strokeDasharray={isFullCluster ? 'none' : '4 4'}
                strokeOpacity={opacity}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}

          {/* Consolidated Cluster Hub Circle */}
          <circle
            cx={CLUSTER_CENTER.x}
            cy={CLUSTER_CENTER.y}
            r={isFullCluster ? 55 : (aggregationProgress * 0.45)}
            fill={isFullCluster ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.08)'}
            stroke={isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)'}
            strokeWidth={isFullCluster ? 2 : 1}
            strokeOpacity={0.7}
            style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />

          {/* Central Hub Node */}
          <circle
            cx={CLUSTER_CENTER.x}
            cy={CLUSTER_CENTER.y}
            r={10}
            fill={isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)'}
          />
          <text
            x={CLUSTER_CENTER.x}
            y={CLUSTER_CENTER.y + 24}
            fill="#ffffff"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            {isFullCluster ? 'HUB LOGISTIK #01 (5.4 TON)' : 'PUSAT AGREGASI'}
          </text>

          {/* Workshop Nodes */}
          {WORKSHOP_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g key={`node-${node.id}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(node)}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="14"
                  fill="none"
                  stroke={isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)'}
                  strokeWidth="2"
                  className="animate-radar-industrial"
                />

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 7 : 5}
                  fill={isSelected ? '#ffffff' : (isFullCluster ? 'var(--verified-green)' : 'var(--biomass-ochre)')}
                  stroke="#090c10"
                  strokeWidth="2"
                />

                <text
                  x={node.x}
                  y={node.y - 10}
                  fill={isSelected ? '#ffffff' : 'var(--text-muted)'}
                  fontSize="9.5"
                  fontWeight={isSelected ? '700' : '600'}
                  textAnchor="middle"
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Tooltip */}
        {selectedNode && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            backgroundColor: '#161B22',
            border: '1px solid var(--border-industrial)',
            borderRadius: '6px',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedNode.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', gap: '0.85rem', marginTop: '2px' }}>
                <span>Pasokan: <strong style={{ color: 'var(--text-primary)' }}>{selectedNode.volume}</strong></span>
                <span>Moisture: <strong style={{ color: 'var(--text-primary)' }}>{selectedNode.moisture}</strong></span>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--verified-green)',
              backgroundColor: 'var(--verified-green-bg)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <AnimatedShieldIcon size={14} color="var(--verified-green)" />
              <span>Verifikasi Fisik</span>
            </div>
          </div>
        )}
      </div>

      {/* Aggregation Slider Control */}
      <div style={{
        backgroundColor: '#090c10',
        border: '1px solid var(--border-industrial)',
        borderRadius: '6px',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <AnimatedSlidersIcon size={18} color="var(--biomass-ochre)" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span style={{ fontWeight: 600 }}>Simulasi Agregasi Kuota Pasokan:</span>
            <span className="tabular-nums" style={{ color: 'var(--biomass-ochre)', fontWeight: 700 }}>
              {aggregationProgress}% ({((aggregationProgress / 100) * 5.4).toFixed(1)} / 5.4 Ton)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={aggregationProgress}
            onChange={(e) => setAggregationProgress(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--biomass-ochre)',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
}
