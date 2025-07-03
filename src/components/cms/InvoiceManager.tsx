import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, DollarSign, Calendar, Eye } from 'lucide-react';
import sdk from '@/lib/sdk';

interface Invoice {
  id: string;
  websiteId: string;
  customerId: string;
  invoiceNumber: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  total: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

interface InvoiceManagerProps {
  websiteId: string;
}

const InvoiceManager: React.FC<InvoiceManagerProps> = ({ websiteId }) => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    tax: 0,
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, [websiteId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [invoicesData, customersData] = await Promise.all([
        sdk.get('invoices') as Promise<Invoice[]>,
        sdk.get('customers')
      ]);
      
      const websiteInvoices = invoicesData.filter(invoice => invoice.websiteId === websiteId);
      const websiteCustomers = customersData.filter((customer: any) => customer.websiteId === websiteId);
      
      setInvoices(websiteInvoices);
      setCustomers(websiteCustomers);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    return subtotal + formData.tax;
  };

  const handleSubmit = async () => {
    if (!formData.customerId || formData.items.some(item => !item.description)) {
      toast({
        title: "Required fields missing",
        description: "Please select a customer and fill in all item descriptions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const items = formData.items.map(item => ({
        ...item,
        amount: item.quantity * item.rate
      }));

      const invoiceData = {
        websiteId,
        customerId: formData.customerId,
        invoiceNumber: editingInvoice?.invoiceNumber || generateInvoiceNumber(),
        items,
        total: calculateTotal(),
        tax: formData.tax,
        dueDate: formData.dueDate,
        status: 'draft' as const
      };

      if (editingInvoice) {
        await sdk.update('invoices', editingInvoice.id, invoiceData);
        toast({
          title: "Invoice updated",
          description: "Invoice has been updated successfully.",
        });
      } else {
        await sdk.insert('invoices', invoiceData);
        toast({
          title: "Invoice created",
          description: "Invoice has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingInvoice(null);
      setFormData({ customerId: '', items: [{ description: '', quantity: 1, rate: 0 }], tax: 0, dueDate: '' });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error saving invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerId: invoice.customerId,
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate
      })),
      tax: invoice.tax,
      dueDate: invoice.dueDate
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await sdk.delete('invoices', invoiceId);
      toast({
        title: "Invoice deleted",
        description: "Invoice has been deleted successfully.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ customerId: '', items: [{ description: '', quantity: 1, rate: 0 }], tax: 0, dueDate: '' });
    setEditingInvoice(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Create and manage customer invoices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </DialogTitle>
              <DialogDescription>
                {editingInvoice ? 'Update invoice details' : 'Create a new invoice for your customer'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer *</label>
                  <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Invoice Items</label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium">${(item.quantity * item.rate).toFixed(2)}</span>
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <div className="p-2 bg-gray-50 rounded border text-lg font-semibold">
                    ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-6">
              Start billing your customers by creating your first invoice.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                    <CardDescription className="mt-1">
                      {getCustomerName(invoice.customerId)}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    invoice.status === 'paid' ? 'default' : 
                    invoice.status === 'overdue' ? 'destructive' :
                    invoice.status === 'sent' ? 'secondary' : 'outline'
                  }>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Total
                    </span>
                    <span className="font-semibold text-lg">${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due Date
                    </span>
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span>{invoice.items.length}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(invoice)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(invoice.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;
