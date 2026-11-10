import { SoilTestRecord, SoilReading, CropInfo } from '../types/soil';
import { CROPS_CATALOG, DEFAULT_PROTOTYPE_READINGS, generateFertilizerRecommendation } from './agronomy';

const STORAGE_KEY = 'smart_soil_records_v1';
const SETTINGS_KEY = 'smart_soil_device_settings_v1';

export interface DeviceSettings {
  isOnline: boolean;
  batteryLevel: number;
  autoSync: boolean;
  soundEnabled: boolean;
  screenBrightness: 'high' | 'auto' | 'battery-saver';
  fieldLocationName: string;
  fieldGpsCoords: string;
  samplingDepthCm: number;
}

export const DEFAULT_SETTINGS: DeviceSettings = {
  isOnline: false, // Default to Offline Mode per scenario
  batteryLevel: 95, // 95% per storyboard
  autoSync: true,
  soundEnabled: true,
  screenBrightness: 'high',
  fieldLocationName: 'North Field #04 (Sector B)',
  fieldGpsCoords: '01°58′22″S, 30°05′44″E',
  samplingDepthCm: 18,
};

// Seed records to showcase history
const INITIAL_RECORDS: SoilTestRecord[] = [
  {
    id: 'rec_prev_01',
    testCode: 'TEST-2026-049',
    date: 'Yesterday, Nov 09',
    time: '14:20',
    fieldName: 'East Ridge Plot A',
    crop: CROPS_CATALOG.find((c) => c.id === 'beans') || CROPS_CATALOG[1],
    readings: {
      ph: 6.2,
      nitrogen: 42,
      phosphorus: 28,
      potassium: 120,
      moisture: 32,
      temperature: 23,
      ec: 0.4,
    },
    assessment: 'Balanced pH for legume cultivation. Nitrogen fixation supported with adequate phosphorus.',
    recommendation: generateFertilizerRecommendation(
      CROPS_CATALOG[1],
      { ph: 6.2, nitrogen: 42, phosphorus: 28, potassium: 120, moisture: 32, temperature: 23, ec: 0.4 }
    ),
    syncStatus: 'synced',
    location: {
      name: 'East Ridge Plot A',
      coords: '01°58′10″S, 30°05′30″E',
    },
  },
  {
    id: 'rec_prev_02',
    testCode: 'TEST-2026-048',
    date: 'Nov 07, 2026',
    time: '09:45',
    fieldName: 'Valley Terrace 02',
    crop: CROPS_CATALOG.find((c) => c.id === 'irish_potatoes') || CROPS_CATALOG[2],
    readings: {
      ph: 5.2,
      nitrogen: 55,
      phosphorus: 34,
      potassium: 165,
      moisture: 36,
      temperature: 20,
      ec: 0.48,
    },
    assessment: 'Favorable acidic pH preventing streptomyces scabies. High potassium reserves for tuber growth.',
    recommendation: generateFertilizerRecommendation(
      CROPS_CATALOG[2],
      { ph: 5.2, nitrogen: 55, phosphorus: 34, potassium: 165, moisture: 36, temperature: 20, ec: 0.48 }
    ),
    syncStatus: 'synced',
    location: {
      name: 'Valley Terrace 02',
      coords: '01°57′50″S, 30°06′15″E',
    },
  },
];

export function loadSavedRecords(): SoilTestRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECORDS;
  }
}

export function saveSoilRecord(record: SoilTestRecord): void {
  try {
    const existing = loadSavedRecords();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving record locally', e);
  }
}

export function loadDeviceSettings(): DeviceSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveDeviceSettings(settings: DeviceSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function createNewRecord(
  crop: CropInfo,
  readings: SoilReading = DEFAULT_PROTOTYPE_READINGS,
  settings: DeviceSettings = DEFAULT_SETTINGS
): SoilTestRecord {
  const timestamp = new Date();
  const id = `test_${Date.now()}`;
  const count = (loadSavedRecords().length + 1).toString().padStart(3, '0');
  const code = `TEST-${timestamp.getFullYear()}-${count}`;
  
  const rec = generateFertilizerRecommendation(crop, readings);
  const assessment = `Your soil requires further nutrient assessment before fertilizer application. Soil acidity (pH ${readings.ph.toFixed(1)}) should also be considered for ${crop.name} cultivation.`;

  return {
    id,
    testCode: code,
    date: 'Today, Nov 10',
    time: `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`,
    fieldName: settings.fieldLocationName,
    crop,
    readings,
    assessment,
    recommendation: rec,
    syncStatus: settings.isOnline ? 'synced' : 'pending',
    location: {
      name: settings.fieldLocationName,
      coords: settings.fieldGpsCoords,
    },
  };
}
