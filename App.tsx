
import React, { useState, useEffect } from 'react';
import { QRCodeData, User, AppView } from './types';
import Layout from './components/Layout';
import QRPreview from './components/QRPreview';
import { calculateDynamicPrice, fileToBase64, formatDate } from './utils';
import { apiService, API_URL } from './services/api';
import {
  QrCode, Search, Filter, ExternalLink,
  Trash2, Eye, TrendingUp, TrendingDown, Clock, Info,
  Globe, Package, Building2, ChevronRight, ArrowLeft,
  Camera, Lock, Mail, User as UserIcon, PlusCircle,
  AlertCircle, Loader2, Image as ImageIcon
} from 'lucide-react';
import PolicyModal from './components/PolicyModal';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import KullanimSartlari from './components/KullanimSartlari';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('LOGIN');
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [currentQR, setCurrentQR] = useState<QRCodeData | null>(null);
  const [publicViewData, setPublicViewData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'cookie' | 'terms' | null>(null);


  const initialFormData: Partial<QRCodeData> = {
    name: '',
    website: '',
    redirectToExternal: false,
    price: 0,
    changeRate: 0,
    activeTimeStart: '09:00',
    activeTimeEnd: '18:00',
    productInfo: '',
    productImage: '',
    publisherLogo: '',
    publisherName: '',
    publisherWebsite: '',
    priceDisplayType: 'price',
    priceNote: '',
  };
  const [formData, setFormData] = useState<Partial<QRCodeData>>(initialFormData);
  const [authData, setAuthData] = useState({ name: '', email: '', pass: '' });
  const [allLogos, setAllLogos] = useState<string[]>([]);

  const handleShowPolicy = (policy: 'privacy' | 'cookie' | 'terms') => {
    setModalPolicy(policy);
  };
  const handleCloseModal = () => {
      setModalPolicy(null);
  };

  useEffect(() => {
    // Fetch all logos for the login page
    const fetchAllLogos = async () => {
      try {
        const response = await fetch(`${API_URL}/logos`);
        if (response.ok) {
          const logos = await response.json();
          setAllLogos(logos.slice(0, 5)); // Show max 5 logos
        }
      } catch (e) {
        console.error('Failed to fetch logos', e);
      }
    };
    fetchAllLogos();

    // Oturumu kontrol et
    const savedSession = localStorage.getItem('qrpro_current_session');
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession);
      setUser(parsedUser);
      loadQRCodes(parsedUser.id);
      setView('DASHBOARD');
    }

    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/q/')) {
        const id = hash.replace('#/q/', '');

        try {
          const found = await apiService.getPublicQR(id);
          if (found) {
            setPublicViewData(found);
            setView('PUBLIC');
            apiService.incrementScan(id).catch(console.error);
          }
        } catch (e) {
          console.error("QR load failed", e);
        }
      } else if (hash.startsWith('#/display/')) {
        const id = hash.replace('#/display/', '');

        try {
          const found = await apiService.getPublicQR(id);
          if (found) {
            setPublicViewData(found);
            setView('SHOW_QR');
          }
        } catch (e) {
          console.error("QR load failed", e);
        }
      } else if (hash === '' || hash === '#/') {
        const session = localStorage.getItem('qrpro_current_session');
        if (!session) setView('LOGIN');
        else setView('DASHBOARD');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadQRCodes = async (userId: string) => {
    const codes = await apiService.getQRCodes(userId);
    setQrCodes(codes);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await apiService.login(authData.email, authData.pass);
      setUser(loggedInUser);
      await loadQRCodes(loggedInUser.id);
      setView('DASHBOARD');
      window.location.hash = '#/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await apiService.register(authData.name, authData.email, authData.pass);
      setUser(newUser);
      await loadQRCodes(newUser.id);
      setView('DASHBOARD');
      window.location.hash = '#/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('qrpro_current_session');
    setView('LOGIN');
    window.location.hash = '#/';
  };

  const handleCreateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const newQR: QRCodeData = {
        ...(formData as Omit<QRCodeData, 'id' | 'createdAt' | 'scans'>),
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        scans: 0,
        ownerId: user.id,
      };
      await apiService.createQRCode(user.id, newQR);
      await loadQRCodes(user.id);
      setFormData(initialFormData);
      setView('DASHBOARD');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentQR) return;
    setIsLoading(true);
    try {
      const updatedQR: QRCodeData = {
        ...currentQR,
        ...formData,
        ownerId: user.id,
      };
      await apiService.updateQRCode(user.id, updatedQR);
      await loadQRCodes(user.id);
      setFormData(initialFormData);
      setCurrentQR(null);
      setView('DASHBOARD');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm('Bu QR kodu silmek istediğinize emin misiniz?')) {
      await apiService.deleteQRCode(user.id, id);
      await loadQRCodes(user.id);
    }
  };

  // --- RENDERING ---

  if (view === 'PUBLIC' && publicViewData) {
    if (publicViewData.redirectToExternal) {
      window.location.href = publicViewData.website.startsWith('http')
        ? publicViewData.website
        : `https://${publicViewData.website}`;
      return null;
    }

    const currentPrice = calculateDynamicPrice(
      publicViewData.price,
      publicViewData.changeRate,
      publicViewData.activeTimeStart,
      publicViewData.activeTimeEnd
    );

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          {publicViewData.productImage ? (
            <div className="h-72 overflow-hidden relative">
              <img src={publicViewData.productImage} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg font-black text-indigo-600">
                {publicViewData.priceDisplayType === 'note'
                  ? publicViewData.priceNote
                  : new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(currentPrice)
                }
              </div>
            </div>
          ) : (
            <div className="h-24 bg-indigo-600 flex items-center justify-center">
              <QrCode className="text-white/20 w-16 h-16" />
            </div>
          )}

          <div className="p-10">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{publicViewData.name}</h1>
              {publicViewData.priceDisplayType !== 'note' && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif Teklif</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line break-words max-w-full">
                "{publicViewData.productInfo || 'Açıklama mevcut değil.'}"
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={publicViewData.website.startsWith('http') ? publicViewData.website : `https://${publicViewData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 group"
              >
                Sitede Görün <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="pt-8 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  {publicViewData.publisherLogo && (
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-200 p-2 flex items-center justify-center">
                      <img src={publicViewData.publisherLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Marka</p>
                    <a
                      href={publicViewData.publisherWebsite.startsWith('http') ? publicViewData.publisherWebsite : `https://${publicViewData.publisherWebsite}`}
                      target="_blank"
                      className="font-bold text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      {publicViewData.publisherName} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {modalPolicy && (
          <PolicyModal onClose={handleCloseModal}>
            {modalPolicy === 'privacy' && <PrivacyPolicy />}
            {modalPolicy === 'cookie' && <CookiePolicy />}
            {modalPolicy === 'terms' && <KullanimSartlari />}
          </PolicyModal>
      )}
      <CookieConsent onShowPolicy={handleShowPolicy} />
      <Layout user={user} onLogout={handleLogout} onNavigate={setView} currentView={view}>
        {(view === 'LOGIN' || view === 'REGISTER') ? (

          <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-slate-50">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-6xl w-full min-h-[600px] border border-slate-100">
              {/* Sol Taraf - Görsel Alanı */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 relative flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 text-white space-y-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/30">
                    <QrCode size={40} className="text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    İşletmeniz İçin <br />
                    <span className="text-indigo-200">Akıllı QR Çözümleri</span>
                  </h2>
                  <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-sm">
                    Dinamik fiyatlandırma, anlık kampanya yönetimi ve detaylı analitikler ile satışlarınızı artırın.
                  </p>
                  {allLogos.length > 0 && (
                    <div className="pt-8 flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {allLogos.map((logo, idx) => (
                          <div key={idx} className="w-12 h-12 rounded-full bg-white border-2 border-indigo-600 shadow-lg overflow-hidden flex items-center justify-center p-1">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sağ Taraf - Form Alanı */}
              <div className="w-full md:w-1/2 p-8 md:p-14 md:overflow-y-auto flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                  <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                      {view === 'LOGIN' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                      {view === 'LOGIN' ? 'Hesabınıza giriş yaparak devam edin.' : 'Hemen ücretsiz kaydolun ve başlayın.'}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600 text-sm animate-in fade-in zoom-in duration-300">
                      <AlertCircle size={20} className="mt-0.5 shrink-0" />
                      <span className="font-medium leading-relaxed">{error}</span>
                    </div>
                  )}

                  <form onSubmit={view === 'LOGIN' ? handleLogin : handleRegister} className="space-y-6">
                    {view === 'REGISTER' && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Ad Soyad</label>
                        <div className="relative group">
                          <UserIcon className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                          <input
                            required
                            value={authData.name}
                            onChange={e => setAuthData({ ...authData, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            placeholder="Adınız"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">E-posta</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          type="email"
                          required
                          value={authData.email}
                          onChange={e => setAuthData({ ...authData, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                          placeholder="ornek@sirket.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Şifre</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          type="password"
                          required
                          value={authData.pass}
                          onChange={e => setAuthData({ ...authData, pass: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2">
                      <input type="checkbox" required id="terms" className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed">
                        <button type="button" onClick={() => handleShowPolicy('privacy')} className="text-indigo-600 hover:underline">Gizlilik Politikası</button>, <button type="button" onClick={() => handleShowPolicy('cookie')} className="text-indigo-600 hover:underline">Çerez Politikası</button> ve <button type="button" onClick={() => handleShowPolicy('terms')} className="text-indigo-600 hover:underline">Kullanım Şartları</button>'nı okudum ve kabul ediyorum.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 text-lg"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : (view === 'LOGIN' ? 'Giriş Yap' : 'Hesap Oluştur')}
                    </button>
                  </form>

                  <p className="mt-10 text-center text-sm font-medium text-slate-500">
                    {view === 'LOGIN' ? (
                      <>Hesabınız yok mu? <button onClick={() => { setView('REGISTER'); setError(null); }} className="text-indigo-600 font-bold hover:underline ml-1">Kayıt Ol</button></>
                    ) : (
                      <>Zaten hesabınız var mı? <button onClick={() => { setView('LOGIN'); setError(null); }} className="text-indigo-600 font-bold hover:underline ml-1">Giriş Yap</button></>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : view === 'DASHBOARD' ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Yönetim</h1>
                <p className="text-slate-500 mt-2 font-medium">Hoş geldin, <span className="text-indigo-600 font-bold">{user?.name}</span>.</p>
              </div>
              <button
                onClick={() => setView('CREATE')}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100"
              >
                <PlusCircle size={22} />
                YENİ OLUŞTUR
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><QrCode size={30} /></div>
                <div><p className="text-slate-400 text-sm font-black uppercase tracking-widest">TOPLAM</p><p className="text-3xl font-black text-slate-900">{qrCodes.length}</p></div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Eye size={30} /></div>
                <div><p className="text-slate-400 text-sm font-black uppercase tracking-widest">OKUNMA</p><p className="text-3xl font-black text-slate-900">{qrCodes.reduce((acc, q) => acc + (q.scans || 0), 0)}</p></div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><TrendingUp size={30} /></div>
                <div><p className="text-slate-400 text-sm font-black uppercase tracking-widest">DİNAMİK</p><p className="text-3xl font-black text-slate-900">{qrCodes.filter(q => q.changeRate !== 0).length}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <tr>
                      <th className="px-8 py-5">QR Adı</th>
                      <th className="px-8 py-5">Fiyatlandırma</th>
                      <th className="px-8 py-5">Tür</th>
                      <th className="px-8 py-5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {qrCodes.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">Henüz kayıt yok.</td></tr>
                    ) : (
                      qrCodes.map((qr) => (
                        <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                              {qr.productImage ? <img src={qr.productImage} className="w-full h-full object-cover" /> : <QrCode size={20} />}
                            </div>
                            <div><p className="font-black text-slate-800">{qr.name}</p><p className="text-xs text-slate-400">{qr.website}</p></div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-black text-slate-700">₺{qr.price}</p>
                            <span className={`text-[10px] font-black uppercase ${qr.changeRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              %{qr.changeRate} Değişken
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${qr.redirectToExternal ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                              {qr.redirectToExternal ? 'Dış Site' : 'İç Sayfa'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                            <button onClick={() => { setCurrentQR(qr); setFormData(qr); setView('EDIT'); }} className="p-2 text-slate-400 hover:text-blue-600" title="Düzenle">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>
                            <button onClick={() => { setCurrentQR(qr); setView('VIEW'); }} className="p-2 text-slate-400 hover:text-indigo-600" title="Görüntüle"><Eye size={20} /></button>
                            <button onClick={() => handleDelete(qr.id)} className="p-2 text-slate-400 hover:text-red-600" title="Sil"><Trash2 size={20} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : view === 'EDIT' ? (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom duration-700">
            <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-8 font-black text-xs uppercase">
              <ArrowLeft size={18} /> Geri
            </button>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <form onSubmit={handleUpdateQR} className="p-10 space-y-12">
                {error && (
                  <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600 text-sm animate-in fade-in zoom-in duration-300">
                    <AlertCircle size={20} className="shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">QR DÜZENLE</h2>
                  <span className="text-xs font-bold text-slate-400">ID: {currentQR?.id}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <Info size={16} /> 1. BİLGİLER
                      </div>
                      <div className="space-y-6">
                        <input
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                          placeholder="Kampanya Adı"
                          value={formData.name || ''}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                          placeholder="Hedef Link"
                          value={formData.website || ''}
                          onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                        <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="edit-ext"
                            checked={formData.redirectToExternal || false}
                            onChange={e => setFormData({ ...formData, redirectToExternal: e.target.checked })}
                          />
                          <label htmlFor="edit-ext" className="text-xs font-black text-indigo-900">DOĞRUDAN DIŞ SİTEYE GÖNDER</label>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <TrendingUp size={16} /> 2. FİYATLANDIRMA
                      </div>

                      <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Fiyat Etiketinde Ne Gösterilsin?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="edit-priceDisplayType"
                              value="price"
                              checked={formData.priceDisplayType === 'price'}
                              onChange={() => setFormData({ ...formData, priceDisplayType: 'price' })}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm font-medium text-slate-700">Ürün Fiyatı</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="edit-priceDisplayType"
                              value="note"
                              checked={formData.priceDisplayType === 'note'}
                              onChange={() => setFormData({ ...formData, priceDisplayType: 'note' })}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm font-medium text-slate-700">Özel Not</span>
                          </label>
                        </div>
                      </div>

                      {formData.priceDisplayType === 'price' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Fiyat (₺)"
                            value={formData.price || ''}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                          <input
                            type="number"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Oran (%)"
                            value={formData.changeRate || ''}
                            onChange={e => setFormData({ ...formData, changeRate: Number(e.target.value) })}
                          />
                          <input
                            type="time"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            value={formData.activeTimeStart || '09:00'}
                            onChange={e => setFormData({ ...formData, activeTimeStart: e.target.value })}
                          />
                          <input
                            type="time"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            value={formData.activeTimeEnd || '18:00'}
                            onChange={e => setFormData({ ...formData, activeTimeEnd: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Fiyat yerine gösterilecek not"
                            value={formData.priceNote || ''}
                            onChange={e => setFormData({ ...formData, priceNote: e.target.value })}
                          />
                        </div>
                      )}
                    </section>
                  </div>
                  <div className="space-y-10">
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <ImageIcon size={16} /> 3. GÖRSEL
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer overflow-hidden">
                        {formData.productImage ? <img src={formData.productImage} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" size={32} />}
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, productImage: await fileToBase64(file) });
                        }} />
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Açıklama..."
                        className="w-full px-5 py-4 mt-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                        value={formData.productInfo || ''}
                        onChange={e => setFormData({ ...formData, productInfo: e.target.value })}
                      />
                    </section>
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <Building2 size={16} /> 4. MARKA
                      </div>

                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer overflow-hidden mb-4">
                        {formData.publisherLogo ? (
                          <img src={formData.publisherLogo} className="max-h-full max-w-full object-contain p-2" alt="Logo" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Camera className="text-slate-300" size={28} />
                            <span className="text-xs text-slate-400 font-medium">Marka Logosu</span>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, publisherLogo: await fileToBase64(file) });
                        }} />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          placeholder="Marka Adı"
                          value={formData.publisherName || ''}
                          onChange={e => setFormData({ ...formData, publisherName: e.target.value })}
                        />
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          placeholder="Marka Site"
                          value={formData.publisherWebsite || ''}
                          onChange={e => setFormData({ ...formData, publisherWebsite: e.target.value })}
                        />
                      </div>
                    </section>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'DEĞİŞİKLİKLERİ KAYDET'}
                </button>
              </form>
            </div>
          </div>
        ) : view === 'CREATE' ? (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom duration-700">
            <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-8 font-black text-xs uppercase">
              <ArrowLeft size={18} /> Geri
            </button>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <form onSubmit={handleCreateQR} className="p-10 space-y-12">
                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600 text-sm animate-in fade-in zoom-in duration-300">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <span className="font-medium leading-relaxed">{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <Info size={16} /> 1. BİLGİLER
                      </div>
                      <div className="space-y-6">
                        <input
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                          placeholder="Kampanya Adı"
                          value={formData.name || ''}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                          placeholder="Hedef Link"
                          value={formData.website || ''}
                          onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                        <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="ext"
                            checked={formData.redirectToExternal || false}
                            onChange={e => setFormData({ ...formData, redirectToExternal: e.target.checked })}
                          />
                          <label htmlFor="ext" className="text-xs font-black text-indigo-900">DOĞRUDAN DIŞ SİTEYE GÖNDER</label>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <TrendingUp size={16} /> 2. FİYATLANDIRMA
                      </div>

                      <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Fiyat Etiketinde Ne Gösterilsin?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priceDisplayType"
                              value="price"
                              checked={formData.priceDisplayType === 'price'}
                              onChange={() => setFormData({ ...formData, priceDisplayType: 'price' })}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm font-medium text-slate-700">Ürün Fiyatı</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priceDisplayType"
                              value="note"
                              checked={formData.priceDisplayType === 'note'}
                              onChange={() => setFormData({ ...formData, priceDisplayType: 'note' })}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm font-medium text-slate-700">Özel Not</span>
                          </label>
                        </div>
                      </div>

                      {formData.priceDisplayType === 'price' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            required
                            step="0.01"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Fiyat (₺)"
                            value={formData.price || ''}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                          <input
                            type="number"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Oran (%)"
                            value={formData.changeRate || ''}
                            onChange={e => setFormData({ ...formData, changeRate: Number(e.target.value) })}
                          />
                          <input
                            type="time"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            value={formData.activeTimeStart || '09:00'}
                            onChange={e => setFormData({ ...formData, activeTimeStart: e.target.value })}
                          />
                          <input
                            type="time"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            value={formData.activeTimeEnd || '18:00'}
                            onChange={e => setFormData({ ...formData, activeTimeEnd: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
                            placeholder="Fiyat yerine gösterilecek not"
                            value={formData.priceNote || ''}
                            onChange={e => setFormData({ ...formData, priceNote: e.target.value })}
                          />
                        </div>
                      )}
                    </section>
                  </div>
                  <div className="space-y-10">
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <ImageIcon size={16} /> 3. GÖRSEL
                      </div>
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer overflow-hidden">
                        {formData.productImage ? <img src={formData.productImage} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" size={32} />}
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, productImage: await fileToBase64(file) });
                        }} />
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Açıklama..."
                        className="w-full px-5 py-4 mt-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                        value={formData.productInfo || ''}
                        onChange={e => setFormData({ ...formData, productInfo: e.target.value })}
                      />
                    </section>
                    <section>
                      <div className="flex items-center gap-3 mb-8 text-indigo-600 font-black uppercase text-xs">
                        <Building2 size={16} /> 4. MARKA
                      </div>

                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer overflow-hidden mb-4">
                        {formData.publisherLogo ? (
                          <img src={formData.publisherLogo} className="max-h-full max-w-full object-contain p-2" alt="Logo" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Camera className="text-slate-300" size={28} />
                            <span className="text-xs text-slate-400 font-medium">Marka Logosu</span>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, publisherLogo: await fileToBase64(file) });
                        }} />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          placeholder="Marka Adı"
                          value={formData.publisherName || ''}
                          onChange={e => setFormData({ ...formData, publisherName: e.target.value })}
                        />
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                          placeholder="Marka Site"
                          value={formData.publisherWebsite || ''}
                          onChange={e => setFormData({ ...formData, publisherWebsite: e.target.value })}
                        />
                      </div>
                    </section>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'SİSTEMİ KAYDET VE YAYINLA'}
                </button>
              </form>
            </div>
          </div>
        ) : view === 'VIEW' && currentQR ? (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
            <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-10 font-black text-xs uppercase">
              <ArrowLeft size={18} /> Geri
            </button>
            <QRPreview data={currentQR} />
            <div className="mt-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center justify-center gap-2">
                <Globe size={24} className="text-indigo-600" />
                PAYLAŞILABİLİR LİNK
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                Aşağıdaki bağlantıyı müşterilerinizle paylaşarak onları doğrudan ürün sayfanıza yönlendirebilirsiniz.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-slate-600 truncate text-left">
                  {`${import.meta.env.VITE_QR_BASE_URL || window.location.origin}${window.location.pathname}#/q/${currentQR.id}`}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${import.meta.env.VITE_QR_BASE_URL || window.location.origin}${window.location.pathname}#/q/${currentQR.id}`);
                    alert("Link kopyalandı!");
                  }}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ExternalLink size={20} />
                  KOPYALA
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <a
                  href={`${import.meta.env.VITE_QR_BASE_URL || window.location.origin}${window.location.pathname}#/q/${currentQR.id}`}
                  target="_blank"
                  className="block bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  SAYFAYI TEST ET
                </a>
                <button
                  onClick={() => window.open(`${import.meta.env.VITE_QR_BASE_URL || window.location.origin}${window.location.pathname}#/display/${currentQR.id}`, '_blank')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <QrCode size={18} />
                  MÜŞTERİ EKRANI (FULL)
                </button>
              </div>
            </div>
          </div>
        ) : view === 'SHOW_QR' && (currentQR || publicViewData) ? (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300">
            {!window.location.hash.includes('#/display/') && (
              <button onClick={() => setView('VIEW')} className="absolute top-8 left-8 p-4 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={24} />
              </button>
            )}

            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center aspect-square relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRPreview data={currentQR || publicViewData!} />
              </div>

              <div className="space-y-8 text-center lg:text-left">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4">{(currentQR || publicViewData!).name}</h1>
                  {(currentQR || publicViewData!)?.priceDisplayType !== 'note' && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      CANLI FİYATLANDIRMA AKTİF
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line break-words max-w-full">
                    "{(currentQR || publicViewData!).productInfo || 'Bu ürün hakkında detaylı bilgi almak için QR kodu taratın.'}"
                  </p>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-slate-400 font-medium">
                  <QrCode size={24} className="animate-bounce" />
                  <span>Kameranızı açın ve kodu taratın</span>
                </div>
              </div>
            </div>
          </div>
        ) : null
        }
      </Layout >
    </>
  );
};

export default App;
