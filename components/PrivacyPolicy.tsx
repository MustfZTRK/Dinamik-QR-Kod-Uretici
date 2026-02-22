import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Sözleşmesi</h1>
      <p className="mb-4">
        Bu web sitesi, kullanıcı deneyimini geliştirmek ve hizmet kalitesini artırmak amacıyla çerezler kullanmaktadır. Gizliliğiniz bizim için önemlidir ve bu metin, hangi verileri neden topladığımızı açıklamaktadır.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Toplanan Veriler</h2>
      <p className="mb-4">
        Sitemizi ziyaret ettiğinizde, IP adresiniz, tarayıcı türünüz, ziyaret süreniz gibi anonim veriler otomatik olarak kaydedilebilir. Kayıt veya giriş yaptığınızda, sağladığınız e-posta adresi ve isim gibi kişisel bilgiler veritabanımızda saklanır.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Verilerin Kullanımı</h2>
      <p className="mb-4">
        Toplanan veriler, hizmetlerimizi sunmak, kullanıcı desteği sağlamak ve sitemizin performansını analiz etmek için kullanılır. Kişisel bilgileriniz hiçbir şekilde üçüncü partilerle paylaşılmaz veya satılmaz.
      </p>
      <h2 className="text-2xl font-semibold mb-2">İletişim</h2>
      <p>
        Gizlilik politikamız hakkında daha fazla bilgi için bizimle iletişime geçebilirsiniz.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
