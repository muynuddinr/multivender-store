'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiShoppingBag, FiPackage, FiBox, FiDollarSign, FiBarChart } from 'react-icons/fi';

// Stats card component
const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${color} p-3 rounded-full mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  </div>
);

// Chart component placeholder
const ChartPlaceholder = ({ title }: { title: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-base font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="bg-gray-100 h-60 rounded-md flex items-center justify-center">
      <FiBarChart className="h-16 w-16 text-gray-300" />
      <p className="text-gray-500 ml-2">Chart will be displayed here</p>
    </div>
  </div>
);

// Recent activity component
const RecentActivity = () => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-base font-semibold text-gray-700">Recent Activity</h3>
    </div>
    <div className="px-6 py-4">
      <ul className="divide-y divide-gray-200">
        {[1, 2, 3, 4, 5].map((item) => (
          <li key={item} className="py-3">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">User {item}</p>
                <p className="text-sm text-gray-500">
                  Performed action #{item} • {Math.floor(Math.random() * 24)} hours ago
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: '0',
    sellers: '0',
    resellers: '0',
    products: '0',
    revenue: '$0',
    orders: '0'
  });

  useEffect(() => {
    // Simulate loading data
    const loadData = setTimeout(() => {
      setStats({
        customers: '1,234',
        sellers: '56',
        resellers: '12',
        products: '4,321',
        revenue: '$12,345',
        orders: '267'
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadData);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h1 className="text-2xl font-bold mb-6 bg-gray-200 h-8 w-48 rounded"></h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-200 h-80 rounded-lg"></div>
          <div className="bg-gray-200 h-80 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.customers} 
          icon={FiUsers} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Sellers" 
          value={stats.sellers} 
          icon={FiShoppingBag} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Resellers" 
          value={stats.resellers} 
          icon={FiPackage} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Products" 
          value={stats.products} 
          icon={FiBox} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={stats.revenue} 
          icon={FiDollarSign} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Orders This Month" 
          value={stats.orders} 
          icon={FiShoppingBag} 
          color="bg-pink-500" 
        />
      </div>

      {/* Charts and Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartPlaceholder title="Sales Overview" />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
} 