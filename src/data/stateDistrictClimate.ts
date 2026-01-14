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
    },
    "Thanjavur": {
      temperature: { min: 22, max: 38, optimal: 29 },
      rainfall: { annual: 1000, monsoon: 650, winter: 350 },
      humidity: { avg: 78, range: [60, 90] },
      soilTypes: ["Alluvial", "Clay", "Delta"],
      mainCrops: ["Rice", "Banana", "Sugarcane", "Coconut"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Banana", "Cotton"],
        rabi: ["Rice", "Pulses", "Groundnut"],
        zaid: ["Vegetables", "Fodder crops"]
      }
    },
    "Tiruchirappalli": {
      temperature: { min: 20, max: 38, optimal: 28 },
      rainfall: { annual: 800, monsoon: 500, winter: 300 },
      humidity: { avg: 70, range: [50, 85] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Rice", "Groundnut", "Cotton", "Sugarcane"],
      seasons: {
        kharif: ["Rice", "Cotton", "Sugarcane", "Maize"],
        rabi: ["Groundnut", "Pulses", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Tirunelveli": {
      temperature: { min: 23, max: 38, optimal: 30 },
      rainfall: { annual: 750, monsoon: 450, winter: 300 },
      humidity: { avg: 72, range: [55, 88] },
      soilTypes: ["Red", "Sandy", "Coastal"],
      mainCrops: ["Rice", "Banana", "Coconut", "Cotton"],
      seasons: {
        kharif: ["Rice", "Cotton", "Banana", "Sugarcane"],
        rabi: ["Groundnut", "Pulses", "Sesame"],
        zaid: ["Vegetables", "Fodder crops"]
      }
    },
    "Vellore": {
      temperature: { min: 18, max: 37, optimal: 27 },
      rainfall: { annual: 950, monsoon: 600, winter: 350 },
      humidity: { avg: 68, range: [45, 85] },
      soilTypes: ["Red", "Black", "Loamy"],
      mainCrops: ["Rice", "Groundnut", "Sugarcane", "Mango"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Groundnut", "Cotton"],
        rabi: ["Groundnut", "Sunflower", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Dindigul": {
      temperature: { min: 19, max: 36, optimal: 27 },
      rainfall: { annual: 850, monsoon: 550, winter: 300 },
      humidity: { avg: 70, range: [50, 85] },
      soilTypes: ["Red", "Black", "Sandy loam"],
      mainCrops: ["Rice", "Cotton", "Onion", "Garlic"],
      seasons: {
        kharif: ["Rice", "Cotton", "Maize", "Sugarcane"],
        rabi: ["Onion", "Garlic", "Groundnut"],
        zaid: ["Vegetables", "Fodder"]
      }
    }
  },
  "Karnataka": {
    "Bengaluru Urban": {
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
    "Bengaluru Rural": {
      temperature: { min: 14, max: 33, optimal: 24 },
      rainfall: { annual: 900, monsoon: 600, winter: 300 },
      humidity: { avg: 58, range: [38, 78] },
      soilTypes: ["Red", "Laterite", "Sandy loam"],
      mainCrops: ["Ragi", "Groundnut", "Vegetables", "Mulberry"],
      seasons: {
        kharif: ["Ragi", "Groundnut", "Maize", "Cotton"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Mysuru": {
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
    },
    "Tumkur": {
      temperature: { min: 17, max: 35, optimal: 26 },
      rainfall: { annual: 600, monsoon: 400, winter: 200 },
      humidity: { avg: 55, range: [35, 75] },
      soilTypes: ["Red", "Sandy", "Loamy"],
      mainCrops: ["Coconut", "Groundnut", "Ragi", "Sunflower"],
      seasons: {
        kharif: ["Groundnut", "Ragi", "Maize", "Sunflower"],
        rabi: ["Gram", "Sunflower", "Groundnut"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Mandya": {
      temperature: { min: 17, max: 34, optimal: 26 },
      rainfall: { annual: 750, monsoon: 500, winter: 250 },
      humidity: { avg: 65, range: [45, 82] },
      soilTypes: ["Red", "Black", "Alluvial"],
      mainCrops: ["Sugarcane", "Rice", "Ragi", "Coconut"],
      seasons: {
        kharif: ["Sugarcane", "Rice", "Ragi", "Maize"],
        rabi: ["Gram", "Groundnut", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Hassan": {
      temperature: { min: 15, max: 32, optimal: 24 },
      rainfall: { annual: 1200, monsoon: 800, winter: 400 },
      humidity: { avg: 70, range: [50, 88] },
      soilTypes: ["Red", "Laterite", "Black"],
      mainCrops: ["Coffee", "Rice", "Ragi", "Coconut"],
      seasons: {
        kharif: ["Rice", "Ragi", "Maize", "Coffee"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Belgaum": {
      temperature: { min: 16, max: 35, optimal: 26 },
      rainfall: { annual: 1100, monsoon: 750, winter: 350 },
      humidity: { avg: 68, range: [45, 85] },
      soilTypes: ["Black", "Red", "Laterite"],
      mainCrops: ["Sugarcane", "Jowar", "Groundnut", "Cotton"],
      seasons: {
        kharif: ["Sugarcane", "Cotton", "Jowar", "Maize"],
        rabi: ["Wheat", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Dharwad": {
      temperature: { min: 15, max: 34, optimal: 25 },
      rainfall: { annual: 900, monsoon: 600, winter: 300 },
      humidity: { avg: 65, range: [42, 82] },
      soilTypes: ["Black", "Red", "Mixed"],
      mainCrops: ["Cotton", "Jowar", "Groundnut", "Sugarcane"],
      seasons: {
        kharif: ["Cotton", "Jowar", "Groundnut", "Maize"],
        rabi: ["Wheat", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    }
  },
  "Kerala": {
    "Thiruvananthapuram": {
      temperature: { min: 22, max: 33, optimal: 27 },
      rainfall: { annual: 1800, monsoon: 1200, winter: 600 },
      humidity: { avg: 82, range: [70, 95] },
      soilTypes: ["Laterite", "Sandy", "Coastal alluvial"],
      mainCrops: ["Coconut", "Rice", "Rubber", "Banana"],
      seasons: {
        kharif: ["Rice", "Banana", "Vegetables", "Tapioca"],
        rabi: ["Rice", "Vegetables", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Ernakulam": {
      temperature: { min: 23, max: 32, optimal: 27 },
      rainfall: { annual: 3200, monsoon: 2200, winter: 1000 },
      humidity: { avg: 85, range: [72, 98] },
      soilTypes: ["Laterite", "Alluvial", "Coastal"],
      mainCrops: ["Coconut", "Rice", "Rubber", "Pepper"],
      seasons: {
        kharif: ["Rice", "Banana", "Pepper", "Ginger"],
        rabi: ["Rice", "Vegetables", "Tapioca"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Kozhikode": {
      temperature: { min: 23, max: 34, optimal: 28 },
      rainfall: { annual: 3100, monsoon: 2100, winter: 1000 },
      humidity: { avg: 83, range: [70, 95] },
      soilTypes: ["Laterite", "Coastal alluvial", "Red"],
      mainCrops: ["Coconut", "Rice", "Pepper", "Cashew"],
      seasons: {
        kharif: ["Rice", "Pepper", "Ginger", "Turmeric"],
        rabi: ["Rice", "Vegetables", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Thrissur": {
      temperature: { min: 22, max: 33, optimal: 27 },
      rainfall: { annual: 2900, monsoon: 1900, winter: 1000 },
      humidity: { avg: 80, range: [68, 94] },
      soilTypes: ["Laterite", "Alluvial", "Sandy"],
      mainCrops: ["Rice", "Coconut", "Rubber", "Banana"],
      seasons: {
        kharif: ["Rice", "Banana", "Vegetables", "Ginger"],
        rabi: ["Rice", "Vegetables", "Tapioca"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Palakkad": {
      temperature: { min: 21, max: 35, optimal: 28 },
      rainfall: { annual: 2200, monsoon: 1500, winter: 700 },
      humidity: { avg: 75, range: [60, 90] },
      soilTypes: ["Laterite", "Red", "Alluvial"],
      mainCrops: ["Rice", "Coconut", "Sugarcane", "Groundnut"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Groundnut", "Banana"],
        rabi: ["Rice", "Vegetables", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Wayanad": {
      temperature: { min: 15, max: 29, optimal: 22 },
      rainfall: { annual: 3500, monsoon: 2500, winter: 1000 },
      humidity: { avg: 85, range: [70, 98] },
      soilTypes: ["Laterite", "Forest loam", "Red"],
      mainCrops: ["Coffee", "Pepper", "Cardamom", "Rice"],
      seasons: {
        kharif: ["Rice", "Pepper", "Ginger", "Coffee"],
        rabi: ["Vegetables", "Cardamom", "Pepper"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Idukki": {
      temperature: { min: 14, max: 28, optimal: 21 },
      rainfall: { annual: 3800, monsoon: 2700, winter: 1100 },
      humidity: { avg: 88, range: [75, 98] },
      soilTypes: ["Forest loam", "Laterite", "Clay"],
      mainCrops: ["Cardamom", "Pepper", "Tea", "Coffee"],
      seasons: {
        kharif: ["Cardamom", "Pepper", "Ginger", "Vegetables"],
        rabi: ["Tea", "Vegetables", "Spices"],
        zaid: ["Vegetables", "Fodder"]
      }
    }
  },
  "Andhra Pradesh": {
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
    },
    "Guntur": {
      temperature: { min: 20, max: 42, optimal: 30 },
      rainfall: { annual: 900, monsoon: 650, winter: 250 },
      humidity: { avg: 68, range: [45, 85] },
      soilTypes: ["Black", "Red", "Alluvial"],
      mainCrops: ["Rice", "Cotton", "Chili", "Tobacco"],
      seasons: {
        kharif: ["Rice", "Cotton", "Chili", "Sugarcane"],
        rabi: ["Tobacco", "Groundnut", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Krishna": {
      temperature: { min: 21, max: 41, optimal: 30 },
      rainfall: { annual: 1000, monsoon: 700, winter: 300 },
      humidity: { avg: 72, range: [50, 88] },
      soilTypes: ["Alluvial", "Black", "Delta"],
      mainCrops: ["Rice", "Sugarcane", "Cotton", "Mango"],
      seasons: {
        kharif: ["Rice", "Cotton", "Sugarcane", "Maize"],
        rabi: ["Groundnut", "Pulses", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "West Godavari": {
      temperature: { min: 20, max: 40, optimal: 29 },
      rainfall: { annual: 1100, monsoon: 800, winter: 300 },
      humidity: { avg: 78, range: [60, 92] },
      soilTypes: ["Delta alluvial", "Coastal", "Black"],
      mainCrops: ["Rice", "Coconut", "Sugarcane", "Banana"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Banana", "Cotton"],
        rabi: ["Rice", "Groundnut", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "East Godavari": {
      temperature: { min: 19, max: 39, optimal: 28 },
      rainfall: { annual: 1200, monsoon: 850, winter: 350 },
      humidity: { avg: 80, range: [62, 94] },
      soilTypes: ["Delta alluvial", "Coastal", "Sandy"],
      mainCrops: ["Rice", "Coconut", "Sugarcane", "Cashew"],
      seasons: {
        kharif: ["Rice", "Sugarcane", "Coconut", "Cotton"],
        rabi: ["Rice", "Groundnut", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Chittoor": {
      temperature: { min: 18, max: 38, optimal: 27 },
      rainfall: { annual: 800, monsoon: 550, winter: 250 },
      humidity: { avg: 65, range: [45, 82] },
      soilTypes: ["Red", "Black", "Sandy loam"],
      mainCrops: ["Groundnut", "Sugarcane", "Mango", "Rice"],
      seasons: {
        kharif: ["Groundnut", "Rice", "Sugarcane", "Maize"],
        rabi: ["Groundnut", "Sunflower", "Pulses"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Anantapur": {
      temperature: { min: 19, max: 40, optimal: 29 },
      rainfall: { annual: 550, monsoon: 400, winter: 150 },
      humidity: { avg: 55, range: [35, 75] },
      soilTypes: ["Red", "Sandy", "Black"],
      mainCrops: ["Groundnut", "Sunflower", "Jowar", "Cotton"],
      seasons: {
        kharif: ["Groundnut", "Sunflower", "Cotton", "Jowar"],
        rabi: ["Groundnut", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Kurnool": {
      temperature: { min: 20, max: 42, optimal: 30 },
      rainfall: { annual: 650, monsoon: 450, winter: 200 },
      humidity: { avg: 58, range: [38, 78] },
      soilTypes: ["Black", "Red", "Mixed"],
      mainCrops: ["Jowar", "Groundnut", "Cotton", "Sunflower"],
      seasons: {
        kharif: ["Jowar", "Cotton", "Groundnut", "Maize"],
        rabi: ["Sunflower", "Gram", "Wheat"],
        zaid: ["Vegetables", "Fodder"]
      }
    }
  },
  "Telangana": {
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
    "Rangareddy": {
      temperature: { min: 16, max: 39, optimal: 27 },
      rainfall: { annual: 750, monsoon: 550, winter: 200 },
      humidity: { avg: 58, range: [35, 80] },
      soilTypes: ["Red", "Black", "Sandy"],
      mainCrops: ["Rice", "Maize", "Cotton", "Vegetables"],
      seasons: {
        kharif: ["Rice", "Cotton", "Maize", "Jowar"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Warangal": {
      temperature: { min: 18, max: 41, optimal: 29 },
      rainfall: { annual: 950, monsoon: 700, winter: 250 },
      humidity: { avg: 65, range: [42, 85] },
      soilTypes: ["Black", "Red", "Alluvial"],
      mainCrops: ["Rice", "Cotton", "Chili", "Turmeric"],
      seasons: {
        kharif: ["Rice", "Cotton", "Chili", "Maize"],
        rabi: ["Turmeric", "Gram", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Karimnagar": {
      temperature: { min: 17, max: 42, optimal: 29 },
      rainfall: { annual: 900, monsoon: 650, winter: 250 },
      humidity: { avg: 62, range: [40, 82] },
      soilTypes: ["Black", "Red", "Mixed"],
      mainCrops: ["Rice", "Cotton", "Maize", "Sugarcane"],
      seasons: {
        kharif: ["Rice", "Cotton", "Maize", "Jowar"],
        rabi: ["Gram", "Sunflower", "Wheat"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Nizamabad": {
      temperature: { min: 18, max: 41, optimal: 29 },
      rainfall: { annual: 1000, monsoon: 750, winter: 250 },
      humidity: { avg: 65, range: [42, 85] },
      soilTypes: ["Black", "Red", "Alluvial"],
      mainCrops: ["Rice", "Turmeric", "Sugarcane", "Cotton"],
      seasons: {
        kharif: ["Rice", "Turmeric", "Cotton", "Maize"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Khammam": {
      temperature: { min: 19, max: 42, optimal: 30 },
      rainfall: { annual: 1100, monsoon: 800, winter: 300 },
      humidity: { avg: 70, range: [48, 88] },
      soilTypes: ["Alluvial", "Black", "Red"],
      mainCrops: ["Rice", "Cotton", "Chili", "Maize"],
      seasons: {
        kharif: ["Rice", "Cotton", "Chili", "Maize"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Nalgonda": {
      temperature: { min: 18, max: 41, optimal: 29 },
      rainfall: { annual: 700, monsoon: 500, winter: 200 },
      humidity: { avg: 58, range: [38, 78] },
      soilTypes: ["Black", "Red", "Sandy"],
      mainCrops: ["Rice", "Cotton", "Jowar", "Groundnut"],
      seasons: {
        kharif: ["Rice", "Cotton", "Jowar", "Maize"],
        rabi: ["Gram", "Groundnut", "Sunflower"],
        zaid: ["Vegetables", "Fodder"]
      }
    },
    "Medak": {
      temperature: { min: 17, max: 40, optimal: 28 },
      rainfall: { annual: 850, monsoon: 600, winter: 250 },
      humidity: { avg: 60, range: [38, 80] },
      soilTypes: ["Red", "Black", "Mixed"],
      mainCrops: ["Rice", "Maize", "Cotton", "Vegetables"],
      seasons: {
        kharif: ["Rice", "Maize", "Cotton", "Jowar"],
        rabi: ["Gram", "Sunflower", "Vegetables"],
        zaid: ["Vegetables", "Fodder"]
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