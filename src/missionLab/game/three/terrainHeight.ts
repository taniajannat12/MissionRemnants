import * as THREE from 'three';
const LUNAR_CRATERS = [

  { x: -26, z: 28, r: 14, depth: 3.4 },
  { x: 32, z: -22, r: 16, depth: 4.2 },
  { x: 22, z: 36, r: 10, depth: 2.6 },
  { x: -38, z: -32, r: 24, depth: 5.2 },
  { x: -16, z: -14, r: 7, depth: 1.8 },
  { x: 44, z: 30, r: 15, depth: 3.6 },
  { x: 8, z: -42, r: 18, depth: 4.5 },

  { x: 12, z: 14, r: 4.2, depth: 0.9 },
  { x: -10, z: 18, r: 4.8, depth: 1.1 },
  { x: 18, z: -8, r: 5.5, depth: 1.2 },
  { x: -20, z: 8, r: 3.8, depth: 0.75 },
  { x: 2, z: 24, r: 4.0, depth: 0.8 },
];

export function getLunarTerrainHeight(x: number, z: number): number {
  const distFromOrigin = Math.hypot(x, z);

  const broadSwell = Math.sin(x * 0.024) * Math.cos(z * 0.028) * 1.8 +
                     Math.sin(x * 0.012 + z * 0.015) * 2.2;

  const ridgeDist = Math.abs(x * 0.45 + z * 0.89 - 18);
  const wrinkleRidge = ridgeDist < 6.0 ? Math.cos((ridgeDist / 6.0) * (Math.PI * 0.5)) * 1.4 : 0;

  const microUndulation = Math.sin(x * 0.08 - z * 0.06) * 0.28 + Math.cos(x * 0.14 + z * 0.12) * 0.15;

  let elevation = broadSwell + wrinkleRidge + microUndulation;

  for (const c of LUNAR_CRATERS) {
    const d = Math.hypot(x - c.x, z - c.z);
    if (d < c.r * 1.5) {
      const norm = d / c.r;
      if (norm <= 1.0) {
        const bowl = (1.0 - Math.pow(norm, 2)) * -c.depth;
        elevation += bowl;
      } else {
        const rim = Math.sin((norm - 1.0) * Math.PI) * (c.depth * 0.26);
        elevation += rim;
      }
    }
  }

  if (distFromOrigin < 7.5) {
    const smoothFactor = Math.max(0, (distFromOrigin - 3.2) / 4.3);
    elevation *= smoothFactor;
  }

  return elevation;
}
export function getMartianTerrainHeight(x: number, z: number): number {
  const dist = Math.hypot(x, z);

  const broadBasin = Math.sin(x * 0.022 + z * 0.018) * 1.6 +
                     Math.cos(x * 0.014 - z * 0.025) * 1.4;

  const duneCoord = x * 0.055 + z * 0.042;
  const dunePhase = (duneCoord % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  let duneWave = 0;
  if (dunePhase < 4.2) {
    duneWave = Math.sin((dunePhase / 4.2) * (Math.PI * 0.5));
  } else {
    duneWave = Math.cos(((dunePhase - 4.2) / (Math.PI * 2 - 4.2)) * (Math.PI * 0.5));
  }
  const dunes = (duneWave - 0.5) * 1.85;

  
  const terracePhase = (x * 0.038 - z * 0.032) * 3;
  const terraceStep = (Math.sin(terracePhase) + 0.3 * Math.sin(terracePhase * 3)) * 0.35;

  
  const microRipples = Math.sin(x * 0.18 - z * 0.12) * 0.14 + Math.cos(x * 0.35 + z * 0.25) * 0.06;

  let elevation = broadBasin + dunes + terraceStep + microRipples;

  
  const ridgeDist = Math.hypot(x - 16, z - 18);
  if (ridgeDist < 16) {
    const rFactor = 1.0 - ridgeDist / 16;
    elevation += Math.pow(rFactor, 1.4) * 2.8;
  }

 
  const craterDist = Math.hypot(x + 22, z + 20);
  if (craterDist < 18) {
    const cn = craterDist / 18;
    if (cn <= 1.0) {
      elevation -= (1.0 - Math.pow(cn, 2)) * 2.8;
    } else if (cn <= 1.4) {
      elevation += Math.sin((cn - 1.0) * Math.PI) * 0.85;
    }
  }

 
  if (dist < 6.5) {
    const smoothFactor = Math.max(0, (dist - 2.8) / 3.7);
    elevation *= smoothFactor;
  }

  return elevation;
}

export function getTerrainSurfaceNormal(x: number, z: number, destination: 'Moon' | 'Mars'): THREE.Vector3 {
  const delta = 0.35;
  const getHeight = destination === 'Moon' ? getLunarTerrainHeight : getMartianTerrainHeight;

  const hL = getHeight(x - delta, z);
  const hR = getHeight(x + delta, z);
  const hD = getHeight(x, z - delta);
  const hU = getHeight(x, z + delta);

  return new THREE.Vector3(hL - hR, 2 * delta, hD - hU).normalize();
}

