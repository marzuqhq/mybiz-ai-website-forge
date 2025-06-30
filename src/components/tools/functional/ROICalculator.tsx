
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(0);
  const [returns, setReturns] = useState<number>(0);
  const [timeFrame, setTimeFrame] = useState<number>(12);
  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    const roi = ((returns - investment) / investment) * 100;
    const annualizedROI = (roi / timeFrame) * 12;
    const netProfit = returns - investment;
    const profitMargin = (netProfit / returns) * 100;

    setResults({
      roi: roi.toFixed(2),
      annualizedROI: annualizedROI.toFixed(2),
      netProfit: netProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(2)
    });
  };

  const exportResults = () => {
    const data = `ROI Analysis Report
Investment: $${investment.toLocaleString()}
Returns: $${returns.toLocaleString()}
Time Frame: ${timeFrame} months
ROI: ${results.roi}%
Annualized ROI: ${results.annualizedROI}%
Net Profit: $${parseFloat(results.netProfit).toLocaleString()}
Profit Margin: ${results.profitMargin}%
Generated: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roi-analysis.txt';
    a.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment">Initial Investment ($)</Label>
            <Input
              id="investment"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
              placeholder="10000"
            />
          </div>
          <div>
            <Label htmlFor="returns">Total Returns ($)</Label>
            <Input
              id="returns"
              type="number"
              value={returns}
              onChange={(e) => setReturns(parseFloat(e.target.value) || 0)}
              placeholder="15000"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="timeFrame">Time Frame (months)</Label>
          <Input
            id="timeFrame"
            type="number"
            value={timeFrame}
            onChange={(e) => setTimeFrame(parseFloat(e.target.value) || 1)}
            placeholder="12"
          />
        </div>

        <Button onClick={calculateROI} className="w-full">
          Calculate ROI
        </Button>

        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4">ROI Analysis Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-green-600">{results.roi}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annualized ROI</p>
                <p className="text-2xl font-bold text-blue-600">{results.annualizedROI}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-xl font-semibold">${parseFloat(results.netProfit).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-xl font-semibold">{results.profitMargin}%</p>
              </div>
            </div>
            <Button onClick={exportResults} variant="outline" className="mt-4">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
