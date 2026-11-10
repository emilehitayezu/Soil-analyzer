import { CropInfo, SoilReading, FertilizerRecommendation } from '../types/soil';

export const CROPS_CATALOG: CropInfo[] = [
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'Cereal',
    description: 'High nitrogen and phosphorus feeder. Sensitive to soil acidity below pH 5.8.',
    idealPh: [5.8, 7.0],
    targetN: [60, 95], // mg/kg
    targetP: [20, 35], // mg/kg
    targetK: [100, 160], // mg/kg
    moistureRange: [25, 45],
    durationDays: '110–140 days',
    badge: 'Primary Scenario',
  },
  {
    id: 'beans',
    name: 'Beans (Common Bush/Climbing)',
    scientificName: 'Phaseolus vulgaris',
    category: 'Legume',
    description: 'Fixes atmospheric nitrogen via Rhizobia. High phosphorus required for root nodules.',
    idealPh: [6.0, 6.8],
    targetN: [30, 50],
    targetP: [25, 40],
    targetK: [90, 140],
    moistureRange: [20, 38],
    durationDays: '75–90 days',
    badge: 'Nitrogen-Fixer',
  },
  {
    id: 'irish_potatoes',
    name: 'Irish Potatoes',
    scientificName: 'Solanum tuberosum',
    category: 'Tuber',
    description: 'Tolerates moderate acidity (prevents potato scab). Extremely heavy potassium feeder for tuber sizing.',
    idealPh: [5.0, 6.2],
    targetN: [50, 80],
    targetP: [30, 50],
    targetK: [140, 220],
    moistureRange: [30, 50],
    durationDays: '90–120 days',
    badge: 'High Potassium',
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    scientificName: 'Solanum lycopersicum',
    category: 'Horticulture',
    description: 'High value crop demanding balanced NPK, calcium for blossom end rot prevention, and well-drained soil.',
    idealPh: [6.0, 6.8],
    targetN: [65, 100],
    targetP: [30, 48],
    targetK: [130, 190],
    moistureRange: [28, 48],
    durationDays: '85–115 days',
    badge: 'Horticultural',
  },
  {
    id: 'rice',
    name: 'Rice (Lowland / Upland)',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    description: 'Adapted to submerged or upland conditions. High split nitrogen requirements during tillering and panicle.',
    idealPh: [5.5, 6.5],
    targetN: [55, 90],
    targetP: [20, 32],
    targetK: [80, 130],
    moistureRange: [40, 80],
    durationDays: '120–150 days',
    badge: 'Moisture Intensive',
  },
  {
    id: 'other',
    name: 'Other Crops (Cassava / Vegetables / Sorghum)',
    scientificName: 'Agricultural General',
    category: 'Other',
    description: 'General soil fertility baseline suitable for drought-resistant tubers, sorghum, or leafy green vegetables.',
    idealPh: [5.5, 7.0],
    targetN: [45, 80],
    targetP: [20, 35],
    targetK: [90, 150],
    moistureRange: [25, 45],
    durationDays: '90–180 days',
    badge: 'Custom Profile',
  },
];

// Prototype benchmark illustrative readings from the scenario:
export const DEFAULT_PROTOTYPE_READINGS: SoilReading = {
  ph: 5.5,
  nitrogen: 35,
  phosphorus: 12,
  potassium: 85,
  moisture: 28,
  temperature: 22,
  ec: 0.35,
};

export function classifyParameter(
  param: keyof SoilReading,
  val: number,
  crop: CropInfo
): { status: string; tone: 'warning' | 'alert' | 'optimal' | 'neutral'; note: string } {
  switch (param) {
    case 'ph': {
      if (val < crop.idealPh[0]) {
        return {
          status: 'Acidic',
          tone: 'alert',
          note: `Below optimal (${crop.idealPh[0]}–${crop.idealPh[1]}). High risk of aluminum toxicity & locked nutrients.`,
        };
      } else if (val > crop.idealPh[1]) {
        return {
          status: 'Alkaline',
          tone: 'warning',
          note: `Above optimal (${crop.idealPh[0]}–${crop.idealPh[1]}). Zinc and iron availability may be restricted.`,
        };
      }
      return { status: 'Optimal', tone: 'optimal', note: 'Ideal range for maximum nutrient uptake.' };
    }
    case 'nitrogen': {
      if (val < crop.targetN[0]) {
        return {
          status: 'Deficient',
          tone: 'alert',
          note: `Deficit of ${crop.targetN[0] - val} mg/kg. Vegetative growth and leaf chlorophyll will be hindered.`,
        };
      } else if (val > crop.targetN[1]) {
        return { status: 'Excessive', tone: 'warning', note: 'Excess nitrogen risks lodging and delayed maturity.' };
      }
      return { status: 'Sufficient', tone: 'optimal', note: 'Adequate for healthy canopy development.' };
    }
    case 'phosphorus': {
      if (val < crop.targetP[0]) {
        return {
          status: 'Deficient',
          tone: 'alert',
          note: `Low by ${crop.targetP[0] - val} mg/kg. Root establishment and early vigorous seedling growth impaired.`,
        };
      } else if (val > crop.targetP[1]) {
        return { status: 'High', tone: 'neutral', note: 'Abundant soil phosphate reserves available.' };
      }
      return { status: 'Sufficient', tone: 'optimal', note: 'Optimal for root systems and cob formation.' };
    }
    case 'potassium': {
      if (val < crop.targetK[0]) {
        return {
          status: 'Moderate / Low',
          tone: 'warning',
          note: `Sub-optimal by ${crop.targetK[0] - val} mg/kg. May reduce stalk strength and drought resilience.`,
        };
      } else if (val > crop.targetK[1]) {
        return { status: 'High', tone: 'optimal', note: 'Rich potassium reserves.' };
      }
      return { status: 'Sufficient', tone: 'optimal', note: 'Healthy stalk resistance and grain filling.' };
    }
    case 'moisture': {
      if (val < crop.moistureRange[0]) {
        return { status: 'Dry Soil', tone: 'warning', note: 'Moisture below optimal germination threshold.' };
      } else if (val > crop.moistureRange[1]) {
        return { status: 'Waterlogged', tone: 'warning', note: 'Excess moisture may cause probe aeration deficits.' };
      }
      return { status: 'Optimal', tone: 'optimal', note: 'Good soil moisture for active root uptake.' };
    }
    case 'temperature': {
      if (val < 15) {
        return { status: 'Cool', tone: 'warning', note: 'Slow microbial decomposition and germination delay.' };
      } else if (val > 32) {
        return { status: 'High Heat', tone: 'warning', note: 'Elevated evapotranspiration stress.' };
      }
      return { status: 'Optimal', tone: 'optimal', note: 'Ideal biological activity range (20–25°C).' };
    }
    case 'ec': {
      if (val > 1.2) {
        return { status: 'Saline', tone: 'alert', note: 'High electrical conductivity. Salt stress detected.' };
      }
      return { status: 'Non-Saline', tone: 'optimal', note: 'Safe ionic salinity conductivity (0.2–0.8 mS/cm).' };
    }
  }
}

export function generateFertilizerRecommendation(
  crop: CropInfo,
  reading: SoilReading
): FertilizerRecommendation {
  const isMaize = crop.id === 'maize';
  const isAcidic = reading.ph < crop.idealPh[0];
  
  // Calculate lime requirement based on pH difference
  let limeRequired = false;
  let limeRateKgHa = 0;
  let limeAdvice = 'Soil pH is in a suitable range. No liming needed.';

  if (isAcidic) {
    limeRequired = true;
    const phGap = crop.idealPh[0] - reading.ph; // e.g. 5.8 - 5.5 = 0.3
    limeRateKgHa = Math.round(1500 + phGap * 2000); // ~2,100 kg/ha for pH 5.5
    limeAdvice = `Apply ${limeRateKgHa.toLocaleString()} kg/ha (approx. ${(limeRateKgHa / 2.47).toFixed(0)} kg/acre) of Agricultural Lime (Calcitic Limestone or Dolomite) 3 to 4 weeks before planting to buffer acidity and neutralize toxic free aluminum.`;
  }

  // Calculate NPK requirements
  const nDeficit = Math.max(0, crop.targetN[0] - reading.nitrogen);
  const pDeficit = Math.max(0, crop.targetP[0] - reading.phosphorus);
  const kDeficit = Math.max(0, crop.targetK[0] - reading.potassium);

  // Basal fertilizer (Planting time)
  let basalProduct = 'DAP (18-46-0)';
  let basalRate = 150; // kg/ha default
  let basalFormula = '18% Nitrogen, 46% Phosphate';

  if (isMaize) {
    if (pDeficit > 5) {
      basalProduct = 'DAP (18-46-0) + MOP';
      basalRate = 175; // kg/ha
      basalFormula = 'High Phosphate for deep taproot and early shoot establishment';
    } else {
      basalProduct = 'NPK (17-17-17)';
      basalRate = 200;
      basalFormula = 'Balanced blend for balanced soil';
    }
  } else if (crop.id === 'irish_potatoes') {
    basalProduct = 'NPK (14-14-20) or (17-17-17 + Potassium Sulfate)';
    basalRate = 250;
    basalFormula = 'High Potassium formulation for tuber initiation';
  } else if (crop.id === 'beans') {
    basalProduct = 'DAP (18-46-0) Starter';
    basalRate = 100;
    basalFormula = 'Low N starter with concentrated P for bacterial nodulation';
  } else if (crop.id === 'tomatoes') {
    basalProduct = 'NPK (15-15-15) + Calcium Nitrate';
    basalRate = 200;
    basalFormula = 'High P with soluble calcium';
  }

  // Top dressing 1 (Vegetative knee-high stage V4-V6)
  const top1Product = isAcidic ? 'CAN (Calcium Ammonium Nitrate 27% N)' : 'Urea (46% N)';
  const top1Rate = isAcidic ? 150 : 100; // kg/ha
  const top1Formula = isAcidic 
    ? '27% N with 20% Calcium (non-acidifying formulation for acidic soil)'
    : '46% Concentrated Nitrogen for vigorous leaf production';

  // Top dressing 2 (Pre-tasseling stage for maize / flowering)
  const top2Product = 'CAN (27% N) or Ammonium Sulfate';
  const top2Rate = 100;
  const top2Formula = 'Late vegetative boost before ear and cob filling';

  const conditionSummary = `Measured pH ${reading.ph.toFixed(1)} indicates ${isAcidic ? 'moderately acidic' : 'healthy'} soil. Nitrogen (${reading.nitrogen} mg/kg) and Phosphorus (${reading.phosphorus} mg/kg) are below the optimal thresholds for ${crop.name}. Potassium (${reading.potassium} mg/kg) is at moderate baseline.`;

  const primaryDeficit = nDeficit > 15 && pDeficit > 5
    ? 'Critical Nitrogen & Phosphorus Deficit + Soil Acidity'
    : 'Nutrient Replenishment Required';

  return {
    cropName: crop.name,
    soilConditionSummary: conditionSummary,
    primaryDeficit,
    limeRequired,
    limeRateKgHa,
    limeAdvice,
    basalFertilizer: {
      product: basalProduct,
      rateKgHa: basalRate,
      timing: 'At planting / Seed placement',
      method: 'Banding (5 cm to the side and 5 cm below seed depth). Do not place fertilizer directly in contact with seeds.',
      formula: basalFormula,
    },
    topDressing1: {
      product: top1Product,
      rateKgHa: top1Rate,
      timing: '3 to 4 weeks after emergence (V4–V6 knee-high stage)',
      method: 'Ring placement (10–15 cm radius around crop base) or side-dressing followed by light soil covering during weeding.',
      formula: top1Formula,
    },
    topDressing2: isMaize ? {
      product: top2Product,
      rateKgHa: top2Rate,
      timing: '6 to 7 weeks after emergence (Pre-tasseling / early cob development)',
      method: 'Side-dress along rows when soil is moist after rainfall or irrigation.',
      formula: top2Formula,
    } : undefined,
    organicMatterAdvice: 'Incorporate 5 to 10 tonnes/ha of well-decomposed farmyard manure or compost prior to harrowing. Organic matter buffers soil pH, boosts water retention capacity, and improves microbial CEC nutrient holding.',
    irrigationMoistureAdvice: `Current soil moisture is ${reading.moisture}%. Maintain steady moisture during vegetative and grain filling stages to avoid pollination drought stress.`,
    safetyPrecautions: [
      'Store fertilizers in a dry, ventilated, and sheltered store away from children and livestock.',
      'Wear protective gloves and dust masks when mixing and applying lime or chemical granules.',
      'Apply top dressing when soil is damp, never directly onto wet leaves to prevent chemical leaf scorching.',
      'Calibrate application spoons/cups (e.g. 5g bottle-cap per planting hill) for uniform field distribution.',
    ],
  };
}
