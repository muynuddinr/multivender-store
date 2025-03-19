'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { FiPlus, FiUser } from 'react-icons/fi';

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: `cust-${i + 1}`,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
        orders: Math.floor(Math.random() * 10),
        totalSpent: `$${Math.floor(Math.random() * 1000)}`,
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        joinedDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toLocaleDateString()
      }));
      setCustomers(mockData as any);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (customer: any) => {
    alert(`Edit customer: ${customer.name}`);
  };

  const handleDelete = (customer: any) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      alert(`Deleted: ${customer.name}`);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (value: any, item: any) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
          <FiUser className="h-5 w-5 text-gray-500" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    )},
    { key: 'phone', header: 'Phone' },
    { key: 'orders', header: 'Orders' },
    { key: 'totalSpent', header: 'Total Spent' },
    { key: 'status', header: 'Status', render: (value: any) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'joinedDate', header: 'Joined Date' },
  ];

  const actionButtons = (
    <button className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <FiPlus className="mr-2 h-4 w-4" />
      Add Customer
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <DataTable
        title="Customer Management"
        data={customers}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actionButtons={actionButtons}
        searchPlaceholder="Search customers..."
        emptyStateMessage="No customers found. Add a new customer to get started."
      />
    </div>
  );
} 