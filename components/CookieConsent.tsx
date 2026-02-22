import React, { useState, useEffect } from 'react';

type PolicyType = 'privacy' | 'cookie' | 'terms';

interface CookieConsentProps {
  onShowPolicy: (policy: PolicyType) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onShowPolicy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('qrpro_consent_accepted');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('qrpro_consent_accepted', 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-lg animate-in slide-in-from-bottom duration-500">
      <p className="text-sm mb-4 md:mb-0 md:mr-4">
        Sitemizi kullanarak,{' '}
        <button onClick={() => onShowPolicy('privacy')} className="underline hover:text-gray-300 font-medium">
          Gizlilik Sözleşmesi
        </button>,{' '}
        <button onClick={() => onShowPolicy('cookie')} className="underline hover:text-gray-300 font-medium">
          Çerez Politikamızı
        </button> ve{' '}
        <button onClick={() => onShowPolicy('terms')} className="underline hover:text-gray-300 font-medium">
          Kullanım Şartları
        </button>
        'nı kabul etmiş olursunuz.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Kabul Et
      </button>
    </div>
  );
};

export default CookieConsent;