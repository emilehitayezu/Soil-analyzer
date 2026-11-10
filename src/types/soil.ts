export type ScreenId = 
  | 'welcome'        // Screen 01
  | 'dashboard'      // Screen 02
  | 'crop_select'    // Screen 03
  | 'sensor_prep'    // Screen 04
  | 'measurement'    // Screen 05
  | 'results'        // Screen 06
  | 'fertilizer'     // Screen 07
  | 'completion';    // Screen 08

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Legume' | 'Tuber' | 'Horticulture' | 'Other';
  description: string;
  idealPh: [number, number];
  targetN: [number, number]; // mg/kg
  targetP: [number, number]; // mg/kg
  targetK: [number, number]; // mg/kg
  moistureRange: [number, number]; // %
  durationDays: string;
  badge: string;
}

export interface SoilReading {
  ph: number;
  nitrogen: number;      // mg/kg
  phosphorus: number;    // mg/kg
  potassium: number;     // mg/kg
  moisture: number;      // %
  temperature: number;   // °C
  ec: number;            // mS/cm
}

export interface SensorStatus {
  id: string;
  name: string;
  state: 'ready' | 'checking' | 'active' | 'error';
  accuracy: string;
  probeModel: string;
}

export interface FertilizerRecommendation {
  cropName: string;
  soilConditionSummary: string;
  primaryDeficit: string;
  limeRequired: boolean;
  limeRateKgHa: number;
  limeAdvice: string;
  basalFertilizer: {
    product: string;
    rateKgHa: number;
    timing: string;
    method: string;
    formula: string;
  };
  topDressing1: {
    product: string;
    rateKgHa: number;
    timing: string;
    method: string;
    formula: string;
  };
  topDressing2?: {
    product: string;
    rateKgHa: number;
    timing: string;
    method: string;
    formula: string;
  };
  organicMatterAdvice: string;
  irrigationMoistureAdvice: string;
  safetyPrecautions: string[];
}

export interface SoilTestRecord {
  id: string;
  testCode: string;
  date: string;
  time: string;
  fieldName: string;
  crop: CropInfo;
  readings: SoilReading;
  assessment: string;
  recommendation: FertilizerRecommendation;
  syncStatus: 'pending' | 'synced';
  location: {
    name: string;
    coords: string;
  };
}
