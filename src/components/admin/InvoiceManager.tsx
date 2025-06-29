
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { 
  FileText, 
  Plus, 
  Download, 
  Send, 
  DollarSign,
  Calendar,
  User,
  Building,
  Eye,
  Edit,
  Copy
} from 'lucide-react';

interface Invoice {
  id: string;
  websiteId: string;
  invoiceNumber: string;
  clientId: string;
  clientInfo: {
    name: string;
    email: string;
    address: string;
    company?: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes: string;
  terms: string;
  paymentMethod?: string;
  recurringSettings: {
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextInvoiceDate?: string;
  };
  createdAt: string;
}

const InvoiceManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await sdk.get('invoices');
      setInvoices(data || []);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load invoices.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoice = async () => {
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const newInvoice = await sdk.insert('invoices', {
        websiteId: 'demo-website',
        invoiceNumber,
        clientId: 'new-client',
        clientInfo: {
          name: 'New Client',
          email: 'client@example.com',
          address: '123 Client Street',
        },
        items: [{
          id: '1',
          description: 'Service/Product Description',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        }],
        subtotal: 100,
        taxRate: 10,
        taxAmount: 10,
        total: 110,
        currency: 'USD',
        status: 'draft' as const,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        notes: '',
        terms: 'Payment due within 30 days.',
        recurringSettings: {
          isRecurring: false,
        },
        createdAt: new Date().toISOString(),
      });
      setInvoices([newInvoice, ...invoices]);
      toast({
        title: "Invoice created",
        description: "New invoice has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create invoice.",
        variant: "destructive",
      });
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    try {
      const updates: Partial<Invoice> = { status };
      if (status === 'paid') {
        updates.paidDate = new Date().toISOString();
      }
      
      await sdk.update('invoices', invoiceId, updates);
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, ...updates } : inv
      ));
      
      toast({
        title: "Status updated",
        description: `Invoice status updated to ${status}.`,
      });
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update invoice status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter(inv => ['sent', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
        <Button onClick={createInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {invoice.clientInfo.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {invoice.currency} {invoice.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    {invoice.status === 'draft' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Send"
                        onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    {invoice.status === 'sent' && (
                      <Button 
                        size="sm"
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {invoice.recurringSettings.isRecurring && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center text-sm text-blue-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    Recurring {invoice.recurringSettings.frequency}
                    {invoice.recurringSettings.nextInvoiceDate && (
                      <span className="ml-2">
                        • Next: {new Date(invoice.recurringSettings.nextInvoiceDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500">
                Created: {new Date(invoice.createdAt).toLocaleDateString()}
                • Items: {invoice.items.length}
                {invoice.paidDate && (
                  <span className="text-green-600 ml-2">
                    • Paid: {new Date(invoice.paidDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invoices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first invoice to start billing your clients.
            </p>
            <Button onClick={createInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Invoice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoiceManager;
