import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import { MessageSquare } from 'lucide-react';
import { reviewService } from '../../api/services';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllAdminReviews();
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (row) => {
    const action = row.isApproved ? 'disapprove' : 'approve';
    if (!window.confirm(`Are you sure you want to ${action} this review?`)) return;

    try {
      await reviewService.approveReview(row.id, { isApproved: !row.isApproved });
      fetchReviews();
    } catch (err) {
      console.error('Failed to toggle approval', err);
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to completely delete this review?')) return;
    try {
      await reviewService.deleteReviewAdmin(row.id);
      setReviews(prev => prev.filter(r => r._id !== row.id));
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Delete failed.');
    }
  };

  const tableData = reviews.map(r => ({
    id: r._id,
    productName: r.product?.name || 'Unknown Product',
    userName: r.user?.name || 'Unknown User',
    rating: r.rating,
    comment: r.comment,
    isApproved: r.isApproved,
    date: new Date(r.createdAt).toLocaleDateString(),
    originalData: r
  }));

  const columns = [
    { 
      header: 'Product', 
      accessor: 'productName',
      render: (productName) => <div className="font-medium text-neutral-900 line-clamp-1">{productName}</div>
    },
    { 
      header: 'User', 
      accessor: 'userName',
      render: (userName) => <div className="text-neutral-600">{userName}</div>
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      render: (rating) => (
        <div className="flex items-center text-gold-dark">
          {rating} ★
        </div>
      )
    },
    { 
      header: 'Comment', 
      accessor: 'comment',
      render: (comment) => <div className="text-sm text-neutral-500 max-w-xs truncate">{comment}</div>
    },
    { 
      header: 'Status', 
      accessor: 'isApproved',
      render: (isApproved) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {isApproved ? 'Approved' : 'Pending'}
        </span>
      )
    },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Reviews</h1>
          <p className="text-sm text-neutral-500 mt-1">Moderate customer reviews before they appear publicly.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm font-bold text-gray-400">Loading reviews...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={tableData} 
          onEdit={handleToggleApprove} // Pencil acts as toggle approval
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminReviews;
