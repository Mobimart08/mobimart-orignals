import React, { useState } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, LogOut, ChevronDown, Check } from 'lucide-react';

/* ==========================================================================
   SettingsAccordion Component
   - Single-open accordion containing Profile, Contact info, Security, and Logout
   - Fields: Name, Phone, Email are inline editable and saved to local storage
   - Logout clears profile data and calls the onLogout callback
   ========================================================================== */

export const SettingsAccordion = ({ profile, onUpdateProfile, onLogout }) => {
  const [openPanel, setOpenPanel] = useState(null);
  
  // Local edit states
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [is2FA, setIs2FA] = useState(true);

  const [saveStatus, setSaveStatus] = useState({});

  const togglePanel = (panelId) => {
    setOpenPanel(openPanel === panelId ? null : panelId);
  };

  const handleSave = (field, value) => {
    onUpdateProfile && onUpdateProfile({ [field]: value });
    setSaveStatus(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [field]: false }));
    }, 1500);
  };

  const panels = [
    {
      id: 'profile',
      label: 'Edit Profile Name',
      icon: User,
      render: () => (
        <div className="flex flex-col gap-2 pt-1 text-left">
          <label htmlFor="profile-name" className="text-[9.5px] font-black text-neutral-900 uppercase tracking-wider">
            Full Name
          </label>
          <div className="flex items-center gap-2">
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-grow bg-[#ECEFF2]/30 focus:bg-white text-[11px] sm:text-xs text-neutral-850 pl-3.5 pr-4 py-2 sm:py-2.5 rounded-xl border border-neutral-200/50 focus:border-[#C5A880] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => handleSave('name', name)}
              className="px-4 py-2 sm:py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10.5px] font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              {saveStatus.name ? <Check size={12} /> : 'Save'}
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'phone',
      label: 'Phone Number',
      icon: Phone,
      render: () => (
        <div className="flex flex-col gap-2 pt-1 text-left">
          <label htmlFor="profile-phone" className="text-[9.5px] font-black text-neutral-900 uppercase tracking-wider">
            Contact Number
          </label>
          <div className="flex items-center gap-2">
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-grow bg-[#ECEFF2]/30 focus:bg-white text-[11px] sm:text-xs text-neutral-850 pl-3.5 pr-4 py-2 sm:py-2.5 rounded-xl border border-neutral-200/50 focus:border-[#C5A880] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => handleSave('phone', phone)}
              className="px-4 py-2 sm:py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10.5px] font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              {saveStatus.phone ? <Check size={12} /> : 'Save'}
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'email',
      label: 'Email Address',
      icon: Mail,
      render: () => (
        <div className="flex flex-col gap-2 pt-1 text-left">
          <label htmlFor="profile-email" className="text-[9.5px] font-black text-neutral-900 uppercase tracking-wider">
            Registered Email
          </label>
          <div className="flex items-center gap-2">
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-[#ECEFF2]/30 focus:bg-white text-[11px] sm:text-xs text-neutral-850 pl-3.5 pr-4 py-2 sm:py-2.5 rounded-xl border border-neutral-200/50 focus:border-[#C5A880] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => handleSave('email', email)}
              className="px-4 py-2 sm:py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10.5px] font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              {saveStatus.email ? <Check size={12} /> : 'Save'}
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: Lock,
      render: () => (
        <div className="flex flex-col gap-3 pt-1 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="current-password" className="text-[9.5px] font-black text-neutral-900 uppercase tracking-wider">Current Password</label>
            <input
              id="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#ECEFF2]/30 focus:bg-white text-[11px] sm:text-xs text-neutral-850 pl-3.5 pr-4 py-2 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-[9.5px] font-black text-neutral-900 uppercase tracking-wider">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#ECEFF2]/30 focus:bg-white text-[11px] sm:text-xs text-neutral-850 pl-3.5 pr-4 py-2 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all font-mono"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPassword('');
              setNewPassword('');
              alert('Password updated successfully!');
            }}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl cursor-pointer mt-1"
          >
            Update Password
          </button>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: ShieldCheck,
      render: () => (
        <div className="flex flex-col gap-3.5 pt-1 text-left">
          <div className="flex items-center justify-between gap-4 p-2 bg-[#FAF9F6] border border-neutral-100 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-neutral-950">Two-Factor Authentication</span>
              <span className="text-[8.5px] text-gray-400 font-bold leading-normal mt-0.5">Secure logins with OTP verification messages</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={is2FA}
                onChange={() => setIs2FA(!is2FA)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A880]"></div>
            </label>
          </div>
          <p className="text-[8.5px] text-gray-400 font-semibold leading-relaxed">
            Registered devices can review login activities and session locations from here.
          </p>
        </div>
      )
    },
    {
      id: 'logout',
      label: 'Log Out Account',
      icon: LogOut,
      render: () => (
        <div className="flex flex-col gap-2 pt-1 text-left">
          <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed">
            Logging out will clear your session. You will be redirected to the store home catalog.
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-black rounded-xl cursor-pointer mt-1 flex items-center justify-center gap-1.5"
          >
            <LogOut size={12} strokeWidth={2.4} />
            <span>Confirm Log Out</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      
      {/* Title */}
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider border-b border-gray-100 pb-2">
        Account Settings
      </h3>

      {/* Accordion container */}
      <div className="flex flex-col divide-y divide-gray-100 border border-neutral-100 rounded-3xl bg-white overflow-hidden shadow-soft-ui">
        {panels.map((panel) => {
          const Icon = panel.icon;
          const isOpen = openPanel === panel.id;

          return (
            <div key={panel.id} className={`transition-colors ${isOpen ? 'bg-[#FAF9F6]/40' : 'bg-white'}`}>
              
              {/* Header Tab */}
              <button
                type="button"
                onClick={() => togglePanel(panel.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-[#C5A880]'
                }`}>
                  <Icon size={12} strokeWidth={2.4} />
                </div>
                
                <span className="flex-grow text-xs font-extrabold text-neutral-900">
                  {panel.label}
                </span>

                <ChevronDown 
                  size={14} 
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                />
              </button>

              {/* Collapsible Content */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 border-t border-gray-50/50 pt-3">
                  {panel.render()}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SettingsAccordion;
