import React from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-[var(--shadow-soft-ui)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/80 border-b border-neutral-200">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-neutral-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)}
                          className="p-1.5 text-neutral-400 hover:text-gold-accent hover:bg-gold-bg rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {(!onEdit && !onDelete) && (
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-neutral-500 text-sm">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Simple Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-white">
        <span className="text-sm text-neutral-500">
          Showing <span className="font-medium text-neutral-900">1</span> to <span className="font-medium text-neutral-900">{data.length}</span> of <span className="font-medium text-neutral-900">{data.length}</span> results
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
