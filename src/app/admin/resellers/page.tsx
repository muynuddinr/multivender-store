'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { FiPlus, FiPackage } from 'react-icons/fi';

export default function ResellersPage() {
  const [loading, setLoading] = useState(true);
  const [resellers, setResellers] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        id: `reseller-${i + 1}`,
        name: `Reseller ${i + 1}`,
        businessName: `Business ${i + 1}`,
        email: `reseller${i + 1}@example.com`,
        phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
        orders: Math.floor(Math.random() * 30),
        purchaseVolume: `$${Math.floor(Math.random() * 20000)}`,
        discountRate: `${Math.floor(Math.random() * 10) + 10}%`,
        status: Math.random() > 0.2 ? 'Active' : 'Pending',
        joinedDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toLocaleDateString()
      }));
      setResellers(mockData as any);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (reseller: any) => {
    alert(`Edit reseller: ${reseller.name}`);
  };

  const handleDelete = (reseller: any) => {
    if (confirm(`Are you sure you want to delete ${reseller.name}?`)) {
      alert(`Deleted: ${reseller.name}`);
    }
  };

  const columns = [
    { key: 'name', header: 'Reseller Details', render: (value: any, item: any) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
          <FiPackage className="h-5 w-5 text-purple-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    )},
    { key: 'businessName', header: 'Business Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'orders', header: 'Orders' },
    { key: 'purchaseVolume', header: 'Purchase Volume' },
    { key: 'discountRate', header: 'Discount Rate' },
    { key: 'status', header: 'Status', render: (value: any) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )},
  ];

  const actionButtons = (
    <button className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <FiPlus className="mr-2 h-4 w-4" />
      Add Reseller
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Resellers</h1>
      <DataTable
        title="Reseller Management"
        data={resellers}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actionButtons={actionButtons}
        searchPlaceholder="Search resellers..."
        emptyStateMessage="No resellers found. Add a new reseller to get started."
      />
    </div>
  );
} 