import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';
import { adminService } from '../../api/services';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, ordersRes] = await Promise.all([
          adminService.getOverview(),
          adminService.getOrders({ limit: 5 })
        ]);
        
        if (overviewRes.data?.success) setStats(overviewRes.data.data);
        if (ordersRes.data?.success) {
          const formattedOrders = ordersRes.data.data.orders.map(o => ({
            id: o.orderId,
            customer: o.userId?.name || 'Guest',
            date: new Date(o.createdAt).toLocaleDateString(),
            status: o.orderStatus,
            total: `₹ ${o.pricing?.total?.toLocaleString('en-IN') || 0}`
          }));
          setRecentOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status) => {
        let badgeColor = 'bg-neutral-100 text-neutral-700';
        if (status === 'Delivered') badgeColor = 'bg-green-100 text-green-700';
        if (status === 'Processing' || status === 'Shipped') badgeColor = 'bg-blue-100 text-blue-700';
        if (status === 'Pending') badgeColor = 'bg-orange-100 text-orange-700';
        
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {status}
          </span>
        );
      }
    },
    { header: 'Total', accessor: 'total' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹ ${stats.totalRevenue.toLocaleString('en-IN')}`} 
          icon={IndianRupee} 
        />
        <StatCard 
          title="Active Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={Users} 
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={Package} 
        />
      </div>

      {/* Recent Orders Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
        </div>
        {loading ? (
          <div className="py-10 text-center text-sm font-bold text-gray-400">Loading orders...</div>
        ) : (
          <DataTable columns={columns} data={recentOrders} />
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
