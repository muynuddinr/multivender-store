'use client';

import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function SellersPage() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const mockData = Array.from({ length: 8 }, (_, i) => ({
        id: `seller-${i + 1}`,
        name: `Seller ${i + 1}`,
        storeName: `Store ${i + 1}`,
        email: `seller${i + 1}@example.com`,
        phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
        products: Math.floor(Math.random() * 50),
        revenue: `$${Math.floor(Math.random() * 10000)}`,
        commissionRate: `${Math.floor(Math.random() * 10) + 5}%`,
        status: Math.random() > 0.2 ? 'Active' : 'Pending',
        joinedDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toLocaleDateString()
      }));
      setSellers(mockData as any);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (seller: any) => {
    alert(`Edit seller: ${seller.name}`);
  };

  const handleDelete = (seller: any) => {
    if (confirm(`Are you sure you want to delete ${seller.name}?`)) {
      alert(`Deleted: ${seller.name}`);
    }
  };

  const columns = [
    { key: 'name', header: 'Seller Details', render: (value: any, item: any) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
          <FiShoppingBag className="h-5 w-5 text-green-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    )},
    { key: 'storeName', header: 'Store Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'products', header: 'Products' },
    { key: 'revenue', header: 'Revenue' },
    { key: 'commissionRate', header: 'Commission' },
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
      Add Seller
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sellers</h1>
      <DataTable
        title="Seller Management"
        data={sellers}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actionButtons={actionButtons}
        searchPlaceholder="Search sellers..."
        emptyStateMessage="No sellers found. Add a new seller to get started."
      />
    </div>
  );
} 