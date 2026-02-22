import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Çerez Politikası</h1>
      <p className="mb-4">
        Bu çerez politikası, web sitemizi ziyaret ettiğinizde cihazınıza yerleştirilen çerezlerin ne olduğunu ve bunları nasıl kullandığımızı açıklamaktadır.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Çerezler Nedir?</h2>
      <p className="mb-4">
        Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza indirilen küçük metin dosyalarıdır. Web sitesinin tercihlerinizi (dil veya konum gibi) hatırlamasına yardımcı olurlar, böylece siteye her döndüğünüzde bunları yeniden girmeniz gerekmez.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Kullandığımız Çerezler</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Oturum Çerezleri:</strong> Sitemizde gezindiğiniz süre boyunca aktif olan ve tarayıcınızı kapattığınızda silinen geçici çerezlerdir.
        </li>
        <li>
          <strong>Kalıcı Çerezler:</strong> Cihazınızda belirli bir süre kalan ve sitemizi tekrar ziyaret ettiğinizde sizi hatırlamamızı sağlayan çerezlerdir. Kimlik doğrulama ve tercihlerinizi saklamak için kullanılırlar.
        </li>
        <li>
          <strong>Analitik Çerezler:</strong> Ziyaretçilerin sitemizi nasıl kullandığı hakkında anonim bilgi toplayan çerezlerdir. Bu, sitemizi geliştirmemize yardımcı olur.
        </li>
      </ul>
       <h2 className="text-2xl font-semibold mb-2">Çerezleri Kontrol Etme</h2>
      <p>
        Tarayıcı ayarlarınızı değiştirerek çerezleri kabul etmeyi veya reddetmeyi seçebilirsiniz. Ancak, çerezleri devre dışı bırakırsanız, sitemizin bazı işlevlerinin düzgün çalışmayabileceğini lütfen unutmayın.
      </p>
    </div>
  );
};

export default CookiePolicy;