import React, { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { Filter, X } from 'lucide-react';
import { adminService, ordersService } from '../../api/services';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({ limit: 100 });
      setOrders(res.data?.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await ordersService.updateOrderStatus(selectedOrder.orderId, { status: newStatus });
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and fulfill customer orders.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors shadow-sm w-full sm:w-auto">
          <Filter size={16} />
          Filter Options
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm font-bold text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map(order => {
            let statusColor = 'bg-gray-100 text-gray-700';
            const status = order.orderStatus;
            if (status === 'Delivered') statusColor = 'bg-green-100 text-green-700';
            if (status === 'Processing' || status === 'Shipped' || status === 'Packed' || status === 'Out for Delivery') statusColor = 'bg-blue-100 text-blue-700';
            if (status === 'Pending') statusColor = 'bg-orange-100 text-orange-700';
            if (status === 'Cancelled' || status === 'Returned' || status === 'Refunded') statusColor = 'bg-red-100 text-red-700';

            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div key={order._id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow relative">
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-neutral-900">#{order.orderId}</span>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">{order.paymentMethod}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>{status}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-neutral-900">{order.shippingAddress?.name || order.userId?.name || 'Customer'}</span>
                  <span className="text-xs text-neutral-500 font-medium">{order.shippingAddress?.phone || 'No phone'}</span>
                  <span className="text-xs text-neutral-500 font-medium">{order.shippingAddress?.email || 'No email'}</span>
                  <span className="text-xs text-neutral-500 truncate mt-0.5">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">Total</span>
                    <span className="text-sm font-black text-neutral-900">₹{order.pricing?.total?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-neutral-700 font-bold">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold">{formatTime(order.createdAt)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleEdit(order)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="View Order Details"
                />
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Order Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveStatus} className="p-4 space-y-4">
              <div>
                <p className="text-sm text-neutral-600 mb-2">Order ID: <span className="font-semibold text-neutral-900">{selectedOrder.orderId}</span></p>
                <label className="block text-sm font-medium text-neutral-700 mb-1">New Status</label>
                <select required className="w-full border rounded-lg p-2 text-sm" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Delivery Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs text-neutral-500 mb-1">Recipient</span>
                      <span className="font-semibold">{selectedOrder.shippingAddress?.name}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-500 mb-1">Contact</span>
                      <span className="font-semibold">{selectedOrder.shippingAddress?.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs text-neutral-500 mb-1">Email Address</span>
                      <span className="font-semibold">{selectedOrder.shippingAddress?.email || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs text-neutral-500 mb-1">Full Address</span>
                      <span className="font-medium text-neutral-800">
                        {selectedOrder.shippingAddress?.addressLine1}
                        {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                        {selectedOrder.shippingAddress?.landmark && `, Near ${selectedOrder.shippingAddress.landmark}`}
                        <br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pinCode}
                        <br />
                        {selectedOrder.shippingAddress?.country || 'India'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Payment Information</h3>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="block text-xs text-neutral-500 mb-1">Method</span>
                      <span className="font-semibold">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-500 mb-1">Status</span>
                      <span className={`font-bold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-neutral-500 mb-1">Amount</span>
                      <span className="font-black text-neutral-900">₹{selectedOrder.pricing?.total?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl border border-neutral-200 p-3 bg-white">
                  <h3 className="text-sm font-semibold text-neutral-900">Order Items</h3>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={`${selectedOrder.orderId}-${index}`} className="flex items-center justify-between rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2 text-sm">
                      <div>
                        <div className="font-medium text-neutral-900">{item.name}</div>
                        <div className="text-xs text-neutral-500">{item.brandName || 'Brand'} • {item.categoryName || 'Category'} • {item.productCondition || 'Condition N/A'}</div>
                      </div>
                      <div className="text-right text-xs text-neutral-500">
                        <div>{[item.selectedStorage, item.selectedColor, item.selectedRam].filter(Boolean).join(' • ')}</div>
                        <div>Qty {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-neutral-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg">{saving ? 'Saving...' : 'Update Status'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
