// Per-acre economics baseline for South Indian crops.
// Costs in INR per acre; yield in quintals per acre; price in INR per quintal.
// Values are conservative averages — used for educational profit estimates only.

export interface CropEconomics {
  name: string;
  emoji: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Year-round";
  durationDays: number;
  costs: {
    seed: number;
    fertilizer: number;
    pesticide: number;
    labor: number;
    irrigation: number;
    machinery: number;
    other: number;
  };
  yieldQuintals: number; // expected yield per acre
  pricePerQuintal: number; // avg mandi price INR
  riskLevel: "Low" | "Medium" | "High";
}

export const cropEconomics: CropEconomics[] = [
  {
    name: "Rice",
    emoji: "🌾",
    season: "Kharif",
    durationDays: 120,
    costs: { seed: 1500, fertilizer: 6000, pesticide: 2500, labor: 12000, irrigation: 4000, machinery: 3500, other: 1500 },
    yieldQuintals: 22,
    pricePerQuintal: 2200,
    riskLevel: "Medium",
  },
  {
    name: "Wheat",
    emoji: "🌾",
    season: "Rabi",
    durationDays: 135,
    costs: { seed: 1800, fertilizer: 5500, pesticide: 2000, labor: 9000, irrigation: 3500, machinery: 3500, other: 1500 },
    yieldQuintals: 18,
    pricePerQuintal: 2275,
    riskLevel: "Low",
  },
  {
    name: "Sugarcane",
    emoji: "🎋",
    season: "Year-round",
    durationDays: 330,
    costs: { seed: 12000, fertilizer: 9000, pesticide: 3000, labor: 22000, irrigation: 8000, machinery: 5000, other: 3000 },
    yieldQuintals: 380,
    pricePerQuintal: 340,
    riskLevel: "Low",
  },
  {
    name: "Cotton",
    emoji: "🌱",
    season: "Kharif",
    durationDays: 165,
    costs: { seed: 2500, fertilizer: 7000, pesticide: 6000, labor: 14000, irrigation: 4500, machinery: 4000, other: 2000 },
    yieldQuintals: 10,
    pricePerQuintal: 7000,
    riskLevel: "High",
  },
  {
    name: "Tomato",
    emoji: "🍅",
    season: "Year-round",
    durationDays: 80,
    costs: { seed: 3500, fertilizer: 8000, pesticide: 5000, labor: 18000, irrigation: 5500, machinery: 3000, other: 3000 },
    yieldQuintals: 120,
    pricePerQuintal: 1500,
    riskLevel: "High",
  },
  {
    name: "Onion",
    emoji: "🧅",
    season: "Rabi",
    durationDays: 110,
    costs: { seed: 4000, fertilizer: 6500, pesticide: 3500, labor: 16000, irrigation: 3500, machinery: 2500, other: 2000 },
    yieldQuintals: 110,
    pricePerQuintal: 1800,
    riskLevel: "High",
  },
  {
    name: "Groundnut",
    emoji: "🥜",
    season: "Kharif",
    durationDays: 120,
    costs: { seed: 5000, fertilizer: 4500, pesticide: 2500, labor: 10000, irrigation: 3000, machinery: 2500, other: 1500 },
    yieldQuintals: 12,
    pricePerQuintal: 5800,
    riskLevel: "Medium",
  },
  {
    name: "Maize",
    emoji: "🌽",
    season: "Kharif",
    durationDays: 100,
    costs: { seed: 2000, fertilizer: 5000, pesticide: 2000, labor: 8000, irrigation: 3000, machinery: 3000, other: 1500 },
    yieldQuintals: 25,
    pricePerQuintal: 2090,
    riskLevel: "Low",
  },
  {
    name: "Turmeric",
    emoji: "🌿",
    season: "Kharif",
    durationDays: 270,
    costs: { seed: 15000, fertilizer: 8000, pesticide: 3000, labor: 20000, irrigation: 6000, machinery: 3500, other: 2500 },
    yieldQuintals: 25,
    pricePerQuintal: 8500,
    riskLevel: "Medium",
  },
  {
    name: "Banana",
    emoji: "🍌",
    season: "Year-round",
    durationDays: 330,
    costs: { seed: 18000, fertilizer: 12000, pesticide: 4000, labor: 24000, irrigation: 9000, machinery: 4000, other: 3000 },
    yieldQuintals: 350,
    pricePerQuintal: 1200,
    riskLevel: "Medium",
  },
  {
    name: "Chilli",
    emoji: "🌶️",
    season: "Kharif",
    durationDays: 150,
    costs: { seed: 4000, fertilizer: 7500, pesticide: 5500, labor: 17000, irrigation: 5000, machinery: 2500, other: 2500 },
    yieldQuintals: 18,
    pricePerQuintal: 9500,
    riskLevel: "High",
  },
  {
    name: "Coconut",
    emoji: "🥥",
    season: "Year-round",
    durationDays: 365,
    costs: { seed: 8000, fertilizer: 6000, pesticide: 1500, labor: 12000, irrigation: 5000, machinery: 2000, other: 2000 },
    yieldQuintals: 60,
    pricePerQuintal: 3000,
    riskLevel: "Low",
  },
];

export interface ProfitEstimate {
  crop: CropEconomics;
  totalCostPerAcre: number;
  totalCost: number;
  totalYieldQuintals: number;
  grossRevenue: number;
  netProfit: number;
  roiPercent: number;
  profitPerDay: number;
}

export function estimateProfit(crop: CropEconomics, acres: number): ProfitEstimate {
  const totalCostPerAcre = Object.values(crop.costs).reduce((a, b) => a + b, 0);
  const totalCost = totalCostPerAcre * acres;
  const totalYieldQuintals = crop.yieldQuintals * acres;
  const grossRevenue = totalYieldQuintals * crop.pricePerQuintal;
  const netProfit = grossRevenue - totalCost;
  const roiPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const profitPerDay = crop.durationDays > 0 ? netProfit / crop.durationDays : 0;
  return {
    crop,
    totalCostPerAcre,
    totalCost,
    totalYieldQuintals,
    grossRevenue,
    netProfit,
    roiPercent,
    profitPerDay,
  };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}