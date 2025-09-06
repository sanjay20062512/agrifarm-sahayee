export interface ClimateData {
  temperature: {
    min: number;
    max: number;
    optimal: number;
  };
  rainfall: {
    annual: number;
    monsoon: number;
    winter: number;
  };
  humidity: {
    avg: number;
    range: [number, number];
  };
  soilTypes: string[];
  mainCrops: string[];
  seasons: {
    kharif: string[];
    rabi: string[];
    zaid: string[];
  };
}

export interface DistrictClimate {
  [district: string]: ClimateData;
}

export interface StateClimateMapping {
  [state: string]: DistrictClimate;
}

export const stateDistrictClimate: StateClimateMapping = {
  "Tamil Nadu": {
    "Chennai": {
      temperature: { min: 19, max: 39, optimal: 28 },
      rainfall: { annual: 1400, monsoon: 900, winter: 500 },
      humidity: { avg: 75, range: [60, 90] },
      soilTypes: ["Sandy", "Clay", "Coastal alluvial"],
      mainCrops: ["Rice", "Groundnut", "Sugarcane", "Cotton"],
      seasons: {
        kharif: ["Rice", "Cotton", "Sugarcane", "Groundnut"],
        rabi: ["Groundnut", "Sesame", "Sunflower"],
        zaid: ["Groundnut", "Fodder crops"]
      }
    },
    "Coimbatore": {
      temperature: { min: 18, max: 35, optimal: 26 },
      rainfall: { annual: 700, monsoon: 400, winter: 300 },
      humidity: { avg: 65, range: [45, 85] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Cotton", "Turmeric", "Sugarcane", "Coconut"],
      seasons: {
        kharif: ["Cotton", "Sugarcane", "Turmeric", "Maize"],
        rabi: ["Groundnut", "Sunflower", "Bengal gram"],
        zaid: ["Fodder crops", "Vegetables"]
      }
    },
    "Madurai": {
      temperature: { min: 21, max: 37, optimal: 29 },
      rainfall: { annual: 850, monsoon: 550, winter: 300 },
      humidity: { avg: 70, range: [50, 85] },
      soilTypes: ["Red", "Black", "Sandy"],
      mainCrops: ["Rice", "Cotton", "Chili", "Onion"],
      seasons: {
        kharif: ["Rice", "Cotton", "Chili", "Maize"],
        rabi: ["Onion", "Bengal gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Salem": {
      temperature: { min: 20, max: 36, optimal: 27 },
      rainfall: { annual: 900, monsoon: 600, winter: 300 },
      humidity: { avg: 68, range: [48, 85] },
      soilTypes: ["Red", "Black", "Loamy"],
      mainCrops: ["Rice", "Sugarcane", "Turmeric", "Mango"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Cotton", "Turmeric"],
        rabi: ["Groundnut", "Sunflower", "Bengal gram"],
        zaid: ["Vegetables", "Fodder crops"]
      }
    },
    "Erode": {
      temperature: { min: 19, max: 37, optimal: 28 },
      rainfall: { annual: 700, monsoon: 450, winter: 250 },
      humidity: { avg: 65, range: [45, 80] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Cotton", "Turmeric", "Coconut", "Sugarcane"],
      seasons: {
        kharif: ["Cotton", "Turmeric", "Sugarcane", "Maize"],
        rabi: ["Groundnut", "Sunflower", "Bengal gram"],
        zaid: ["Vegetables", "Fodder"]
      }
    }
  },
  "Karnataka": {
    "Bangalore": {
      temperature: { min: 15, max: 32, optimal: 24 },
      rainfall: { annual: 970, monsoon: 650, winter: 320 },
      humidity: { avg: 60, range: [40, 80] },
      soilTypes: ["Red", "Laterite", "Black"],
      mainCrops: ["Rice", "Ragi", "Sugarcane", "Mulberry"],
      seasons: {
        kharif: ["Rice", "Ragi", "Sugarcane", "Cotton"],
        rabi: ["Wheat", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Mysore": {
      temperature: { min: 16, max: 33, optimal: 25 },
      rainfall: { annual: 800, monsoon: 500, winter: 300 },
      humidity: { avg: 65, range: [45, 85] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Rice", "Sugarcane", "Ragi", "Coconut"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Ragi", "Cotton"],
        rabi: ["Wheat", "Gram", "Groundnut"],
        zaid: ["Vegetables", "Fodder crops"]
      }
    }
  },
  "Andhra Pradesh": {
    "Hyderabad": {
      temperature: { min: 17, max: 40, optimal: 28 },
      rainfall: { annual: 800, monsoon: 600, winter: 200 },
      humidity: { avg: 60, range: [35, 85] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Rice", "Cotton", "Maize", "Sugarcane"],
      seasons: {
        kharif: ["Rice", "Cotton", "Maize", "Sugarcane"],
        rabi: ["Wheat", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Visakhapatnam": {
      temperature: { min: 18, max: 36, optimal: 27 },
      rainfall: { annual: 1100, monsoon: 800, winter: 300 },
      humidity: { avg: 75, range: [60, 90] },
      soilTypes: ["Coastal alluvial", "Red", "Sandy"],
      mainCrops: ["Rice", "Sugarcane", "Groundnut", "Coconut"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Groundnut", "Cotton"],
        rabi: ["Groundnut", "Sesame", "Bengal gram"],
        zaid: ["Vegetables", "Fodder crops"]
      }
    }
  }
};

export const getClimateData = (state: string, district: string): ClimateData | null => {
  return stateDistrictClimate[state]?.[district] || null;
};

export const getOptimalCropsForClimate = (climateData: ClimateData, season: string): string[] => {
  switch (season.toLowerCase()) {
    case 'kharif':
    case 'monsoon':
      return climateData.seasons.kharif;
    case 'rabi':
    case 'winter':
      return climateData.seasons.rabi;
    case 'zaid':
    case 'summer':
      return climateData.seasons.zaid;
    default:
      return [...climateData.seasons.kharif, ...climateData.seasons.rabi];
  }
};

export const getCropSuitabilityScore = (
  cropName: string, 
  climateData: ClimateData, 
  soilType: string,
  season: string
): number => {
  let score = 0;
  
  // Season suitability (40% weight)
  const seasonalCrops = getOptimalCropsForClimate(climateData, season);
  if (seasonalCrops.some(crop => crop.toLowerCase().includes(cropName.toLowerCase()))) {
    score += 40;
  }
  
  // Soil suitability (30% weight)
  if (climateData.soilTypes.some(soil => soil.toLowerCase() === soilType.toLowerCase())) {
    score += 30;
  }
  
  // Main crop of region (20% weight)
  if (climateData.mainCrops.some(crop => crop.toLowerCase().includes(cropName.toLowerCase()))) {
    score += 20;
  }
  
  // Temperature suitability (10% weight)
  // This is a basic check - can be enhanced with crop-specific temperature requirements
  if (climateData.temperature.optimal >= 20 && climateData.temperature.optimal <= 35) {
    score += 10;
  }
  
  return Math.min(score, 100);
};