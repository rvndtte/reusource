/**
 * Centralized Business Rules & Economic/CO2e Engine for ReuSource / Bylink
 * All thresholds, grading logic, and factor tables are declared here for easy adjustment.
 */

// 1. DYNAMIC THRESHOLD CONSTANTS
export const GRADING_THRESHOLDS = {
  WEIGHT_GRADE_A: 100, // kg threshold for Grade A
  WEIGHT_GRADE_B: 30,  // kg threshold for Grade B
};

export const CLUSTER_CONFIG = {
  THRESHOLD_VOLUME_KG: 500, // Target volume per cluster to unlock "Siap Dijual / Siap Diambil"
};

// 2. CO2e EMISSION FACTOR LOOKUP TABLE (kg CO2e prevented per kg biomass waste)
// TODO: Validasi angka faktor emisi riset berdasarkan studi LCA (Life Cycle Assessment) terbaru
export const EMISSION_FACTOR_CO2E_TABLE = {
  'Serbuk Serutan Kayu Jati': 1.25, // kg CO2e / kg
  'Wood Chips / Serpihan Kayu': 1.15,
  'Potongan Kayu Padat (Offcuts)': 1.05,
  'Kulit Kayu & Sisa Sawmill': 0.95,
  'DEFAULT': 1.10
};

// 3. ECONOMIC REFERENCE PRICE LOOKUP TABLE (Rp / kg per grade per waste type)
// TODO: Validasi harga referensi pasar agregasi lokal
export const ECONOMIC_PRICE_TABLE = {
  'Serbuk Serutan Kayu Jati': {
    'A': 800,  // Rp / kg (Kering ≤15%)
    'B': 450,  // Rp / kg (Lembap 16-30%)
    'C': 250,  // Rp / kg (Basah >30%)
  },
  'Wood Chips / Serpihan Kayu': {
    'A': 750,
    'B': 400,
    'C': 220,
  },
  'Potongan Kayu Padat (Offcuts)': {
    'A': 900,
    'B': 500,
    'C': 300,
  },
  'Kulit Kayu & Sisa Sawmill': {
    'A': 600,
    'B': 350,
    'C': 180,
  },
  'DEFAULT': {
    'A': 700,
    'B': 400,
    'C': 200,
  }
};

/**
 * Rule-Based Automatic Grading Logic (Explicit If-Else Engine)
 * @param {boolean} kering - Is the wood waste dry (doesn't clump when squeezed)?
 * @param {boolean} kontaminasi - Is it FREE of contamination (plastic/metal/soil)? (Note: false means NO contamination)
 * @param {number} berat - Estimated weight in kg
 * @returns {object} { grade: 'A'|'B'|'C'|'ditolak', status: 'Lolos'|'Ditolak', badgeColor: string, reason: string }
 */
export function calculateAutomaticGrade(kering, bebasKontaminasi, berat) {
  const kontaminasi = !bebasKontaminasi; // convert to contamination flag

  if (kering === true && kontaminasi === false && berat >= GRADING_THRESHOLDS.WEIGHT_GRADE_A) {
    return {
      grade: 'A',
      status: 'Lolos (Kualitas Utama)',
      badgeColor: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#10b981',
      reason: 'Material kering sempurna (≤15%), bebas kontaminasi, dan memenuhi volume minimal Grade A (≥100 kg).'
    };
  } else if ((kering === true || kontaminasi === false) && berat >= GRADING_THRESHOLDS.WEIGHT_GRADE_B) {
    return {
      grade: 'B',
      status: 'Lolos (Kualitas Standar)',
      badgeColor: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#3b82f6',
      reason: 'Memenuhi salah satu standar kebersihan/kering dasar dengan volume memadai (≥30 kg).'
    };
  } else if (berat < GRADING_THRESHOLDS.WEIGHT_GRADE_B || (kering === false && kontaminasi === true)) {
    let rejectionReasons = [];
    if (berat < GRADING_THRESHOLDS.WEIGHT_GRADE_B) {
      rejectionReasons.push(`Berat material (${berat} kg) kurang dari batas minimum agregasi 30 kg`);
    }
    if (kering === false && kontaminasi === true) {
      rejectionReasons.push('Material basah/menggumpal serta terindikasi kontaminasi asing (plastik/logam/tanah)');
    }
    return {
      grade: 'ditolak',
      status: 'Ditolak (Tidak Memenuhi Standar)',
      badgeColor: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#f87171',
      reason: rejectionReasons.join('. ') || 'Material tidak memenuhi batas minimum kualitas.'
    };
  } else {
    return {
      grade: 'C',
      status: 'Lolos (Kualitas Dasar)',
      badgeColor: '#d97706',
      bgColor: '#fffbe6',
      borderColor: '#f59e0b',
      reason: 'Limbah kategori lembap atau kualitas dasar (Grade C).'
    };
  }
}

/**
 * Calculates estimated prevented CO2e emissions in kg CO2e
 */
export function calculateCO2eImpact(wasteType, weightKg) {
  const factor = EMISSION_FACTOR_CO2E_TABLE[wasteType] || EMISSION_FACTOR_CO2E_TABLE['DEFAULT'];
  return Number((weightKg * factor).toFixed(2));
}

/**
 * Calculates estimated economic revenue in Rupiah
 */
export function calculateEconomicValue(wasteType, grade, weightKg) {
  const priceMap = ECONOMIC_PRICE_TABLE[wasteType] || ECONOMIC_PRICE_TABLE['DEFAULT'];
  const pricePerKg = priceMap[grade] || 300;
  return weightKg * pricePerKg;
}
