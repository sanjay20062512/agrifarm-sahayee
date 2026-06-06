import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calculator,
  Sprout,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  cropEconomics,
  estimateProfit,
  formatINR,
  type ProfitEstimate,
} from "@/data/cropEconomics";

export const ProfitPredictor = () => {
  const [cropName, setCropName] = useState<string>(cropEconomics[0].name);
  const [acres, setAcres] = useState<number>(1);

  const selectedCrop = useMemo(
    () => cropEconomics.find((c) => c.name === cropName) ?? cropEconomics[0],
    [cropName]
  );

  const estimate: ProfitEstimate = useMemo(
    () => estimateProfit(selectedCrop, Math.max(0.1, acres || 0.1)),
    [selectedCrop, acres]
  );

  const alternatives = useMemo(() => {
    return cropEconomics
      .filter((c) => c.name !== selectedCrop.name)
      .map((c) => estimateProfit(c, Math.max(0.1, acres || 0.1)))
      .sort((a, b) => b.netProfit - a.netProfit)
      .slice(0, 3);
  }, [selectedCrop, acres]);

  const isProfit = estimate.netProfit > 0;

  const riskColor = (lvl: string) =>
    lvl === "Low"
      ? "bg-success text-success-foreground"
      : lvl === "Medium"
      ? "bg-warning text-warning-foreground"
      : "bg-destructive text-destructive-foreground";

  const costBreakdown = [
    { label: "Seeds", value: selectedCrop.costs.seed },
    { label: "Fertilizer", value: selectedCrop.costs.fertilizer },
    { label: "Pesticide", value: selectedCrop.costs.pesticide },
    { label: "Labor", value: selectedCrop.costs.labor },
    { label: "Irrigation", value: selectedCrop.costs.irrigation },
    { label: "Machinery", value: selectedCrop.costs.machinery },
    { label: "Other", value: selectedCrop.costs.other },
  ];
  const maxCost = Math.max(...costBreakdown.map((c) => c.value));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Calculator className="w-7 h-7 text-primary" />
          Profit Predictor
        </h2>
        <p className="text-muted-foreground">
          Estimate costs, yield, and profit before you plant
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Farm</CardTitle>
          <CardDescription>Pick a crop and enter land area</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop</Label>
            <Select value={cropName} onValueChange={setCropName}>
              <SelectTrigger id="crop">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cropEconomics.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.emoji} {c.name} ({c.season})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="acres">Land area (acres)</Label>
            <Input
              id="acres"
              type="number"
              min={0.1}
              step={0.1}
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Investment</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <IndianRupee className="w-5 h-5" />
              {formatINR(estimate.totalCost).replace("₹", "")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expected Yield</CardDescription>
            <CardTitle className="text-2xl">
              {estimate.totalYieldQuintals.toFixed(1)} q
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gross Revenue</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {formatINR(estimate.grossRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className={isProfit ? "border-success" : "border-destructive"}>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle
              className={`text-2xl flex items-center gap-1 ${
                isProfit ? "text-success" : "text-destructive"
              }`}
            >
              {isProfit ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              {formatINR(estimate.netProfit)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Cost Breakdown</span>
              <Badge variant="secondary" className={riskColor(selectedCrop.riskLevel)}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {selectedCrop.riskLevel} Risk
              </Badge>
            </CardTitle>
            <CardDescription>Per acre cost components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {costBreakdown.map((c) => (
              <div key={c.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-medium">{formatINR(c.value)}</span>
                </div>
                <Progress value={(c.value / maxCost) * 100} className="h-2" />
              </div>
            ))}
            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Per acre total</span>
              <span>{formatINR(estimate.totalCostPerAcre)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Summary</CardTitle>
            <CardDescription>Performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Return on Investment
              </span>
              <span
                className={`text-xl font-bold ${
                  estimate.roiPercent >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {estimate.roiPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Duration
              </span>
              <span className="font-medium">{selectedCrop.durationDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4" /> Profit / day
              </span>
              <span className="font-medium">{formatINR(estimate.profitPerDay)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mandi price assumption</span>
              <span className="font-medium">
                {formatINR(selectedCrop.pricePerQuintal)} / quintal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expected yield / acre</span>
              <span className="font-medium">{selectedCrop.yieldQuintals} quintals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" /> Higher-Profit Alternatives
          </CardTitle>
          <CardDescription>
            Top 3 alternative crops with better estimated returns for {acres} acre(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alternatives.map((alt) => {
            const diff = alt.netProfit - estimate.netProfit;
            return (
              <Card key={alt.crop.name} className="border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{alt.crop.emoji}</span>
                    {alt.crop.name}
                  </CardTitle>
                  <CardDescription>
                    {alt.crop.season} · {alt.crop.durationDays} days
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit</span>
                    <span className="font-semibold text-success">
                      {formatINR(alt.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-medium">{alt.roiPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">vs current</span>
                    <span
                      className={`font-medium ${
                        diff >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {diff >= 0 ? "+" : ""}
                      {formatINR(diff)}
                    </span>
                  </div>
                  <Badge variant="secondary" className={riskColor(alt.crop.riskLevel)}>
                    {alt.crop.riskLevel} Risk
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Estimates use baseline South Indian averages and current mandi price ranges.
        Actual results vary with local weather, market timing, and farming practices.
      </p>
    </div>
  );
};