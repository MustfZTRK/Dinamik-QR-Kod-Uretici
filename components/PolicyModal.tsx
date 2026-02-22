import React from 'react';
import { X } from 'lucide-react';

interface PolicyModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full h-[80vh] flex flex-col relative overflow-hidden border border-slate-200">
        <div className="flex-grow p-8 md:p-12 overflow-y-auto">
          {children}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
            <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-150 ease-in-out"
            >
                Anladım
            </button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PolicyModal;
