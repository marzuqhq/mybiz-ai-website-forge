
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Download } from 'lucide-react';

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5.5);
  const [term, setTerm] = useState<number>(30);
  const [results, setResults] = useState<any>(null);

  const calculateLoan = () => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    
    // Generate amortization schedule (first 12 months)
    const schedule = [];
    let balance = principal;
    
    for (let month = 1; month <= Math.min(12, numPayments); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      schedule
    });
  };

  const exportResults = () => {
    let data = `Loan Calculator Results
Principal: $${principal.toLocaleString()}
Interest Rate: ${rate}%
Term: ${term} years
Monthly Payment: $${parseFloat(results.monthlyPayment).toLocaleString()}
Total Payment: $${parseFloat(results.totalPayment).toLocaleString()}
Total Interest: $${parseFloat(results.totalInterest).toLocaleString()}

Amortization Schedule (First 12 months):
Month\tPayment\t\tPrincipal\tInterest\tBalance
`;

    results.schedule.forEach((payment: any) => {
      data += `${payment.month}\t$${payment.payment.toFixed(2)}\t$${payment.principal.toFixed(2)}\t$${payment.interest.toFixed(2)}\t$${payment.balance.toFixed(2)}\n`;
    });

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-analysis.txt';
    a.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Business Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="principal">Loan Amount ($)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="term">Term (years)</Label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>

        <Button onClick={calculateLoan} className="w-full">
          Calculate Loan
        </Button>

        {results && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-blue-600">${parseFloat(results.monthlyPayment).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Payment</p>
                <p className="text-xl font-semibold">${parseFloat(results.totalPayment).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-xl font-semibold text-red-600">${parseFloat(results.totalInterest).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Amortization Schedule (First 12 Months)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-right p-2">Payment</th>
                      <th className="text-right p-2">Principal</th>
                      <th className="text-right p-2">Interest</th>
                      <th className="text-right p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map((payment: any) => (
                      <tr key={payment.month} className="border-b">
                        <td className="p-2">{payment.month}</td>
                        <td className="text-right p-2">${payment.payment.toFixed(2)}</td>
                        <td className="text-right p-2">${payment.principal.toFixed(2)}</td>
                        <td className="text-right p-2">${payment.interest.toFixed(2)}</td>
                        <td className="text-right p-2">${payment.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Button onClick={exportResults} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Full Schedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;
