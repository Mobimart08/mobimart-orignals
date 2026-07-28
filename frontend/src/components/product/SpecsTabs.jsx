import React, { useState } from 'react';
import {
  Smartphone,
  Cpu,
  Camera,
  Database,
  Battery,
  Settings,
  Layers,
  Wifi,
  Scale,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const SpecsTabs = ({ product }) => {
  const conditionLabel = product.productCondition || product.conditionType || product.condition || 'New';
  const inspectionEnabled = ['Used', 'Refurbished', 'Open Box'].includes(conditionLabel);
  const tabs = inspectionEnabled ? ['Overview', 'Specs', 'Inspection'] : ['Overview', 'Specs'];
  const [activeTab, setActiveTab] = useState('Overview');

  const getIconForSpec = (specName) => {
    switch (specName.toLowerCase()) {
      case 'display': return <Smartphone size={16} className="text-neutral-700" />;
      case 'processor': return <Cpu size={16} className="text-neutral-700" />;
      case 'camera': return <Camera size={16} className="text-neutral-700" />;
      case 'ram': return <Database size={16} className="text-neutral-700" />;
      case 'storage': return <Layers size={16} className="text-neutral-700" />;
      case 'battery': return <Battery size={16} className="text-neutral-700" />;
      case 'os': return <Settings size={16} className="text-neutral-700" />;
      case 'connectivity': return <Wifi size={16} className="text-neutral-700" />;
      case 'weight': return <Scale size={16} className="text-neutral-700" />;
      default: return <Smartphone size={16} className="text-neutral-700" />;
    }
  };

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-5">
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`flex-1 pb-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${isActive ? 'border-neutral-900 text-neutral-950 font-black' : 'border-transparent text-gray-400 hover:text-neutral-700'}`} aria-label={`Show ${tab} section`}>
              {tab}
            </button>
          );
        })}
      </div>

      <div className="min-h-[220px]">
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-4.5 animate-fade-in text-left">
            <h4 className="text-[12.5px] font-extrabold text-neutral-950 uppercase tracking-wider">Product Overview</h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">{product.description}</p>
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-100 flex items-start gap-3">
              <CheckCircle size={18} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2.4} />
              <div>
                <h5 className="text-[11.5px] font-extrabold text-neutral-950">Condition: {conditionLabel}</h5>
                <p className="text-[9.5px] sm:text-[10.5px] text-gray-400 font-bold leading-normal mt-0.5">
                  {inspectionEnabled
                    ? 'This item has been checked and documented before publishing so buyers can review its exact condition and specs.'
                    : 'This item is listed as new and ships with the configured specifications, inventory status, and current pricing.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Specs' && (
          <div className="flex flex-col gap-4 animate-fade-in text-left">
            <h4 className="text-[12.5px] font-extrabold text-neutral-950 uppercase tracking-wider">Key Specifications</h4>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAF9F6] p-3 rounded-2xl border border-neutral-100">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-150/40 flex items-center justify-center shrink-0 shadow-sm">
                      {getIconForSpec(spec.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{spec.name}</p>
                      <p className="text-[11px] sm:text-xs font-extrabold text-neutral-950 truncate leading-none">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-bold py-6">No detailed specs mapped.</p>
            )}
          </div>
        )}

        {activeTab === 'Inspection' && (
          <div className="flex flex-col gap-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-[12.5px] font-extrabold text-neutral-950 uppercase tracking-wider">Inspection Report</h4>
              <span className="px-2 py-0.5 bg-green-50 border border-green-150/30 text-[9.5px] font-black text-green-600 rounded">Verified</span>
            </div>

            {product.inspectionReport && product.inspectionReport.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.inspectionReport.map((report, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 border border-gray-150/30 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-amber-500 fill-amber-500/10 shrink-0" strokeWidth={2.4} />
                        <span className="text-[11px] sm:text-xs font-extrabold text-neutral-900">{report.name}</span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold">{report.desc}</span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => alert('View Full Inspection Certificate simulated!')} className="flex items-center justify-center gap-1.5 w-full py-2.5 text-[10.5px] font-bold text-neutral-800 bg-[#FAF9F6]/85 hover:bg-white border border-neutral-250 rounded-xl transition-all cursor-pointer shadow-sm mt-2.5">
                  <span>View Full Report</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-[#FAF9F6] rounded-2xl border border-neutral-100">
                <ShieldAlert className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-bold">Inspection data unavailable for this product.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecsTabs;
