import React from 'react';

const KullanimSartlari: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Kullanım Şartları</h1>
      <p className="mb-4">
        Bu web sitesini kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. Lütfen bu şartları dikkatlice okuyun.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Hizmetlerin Kullanımı</h2>
      <p className="mb-4">
        Bu site tarafından sunulan hizmetler, yalnızca yasal amaçlarla kullanılabilir. Sisteminize veya diğer kullanıcıların deneyimine zarar verecek herhangi bir faaliyette bulunmak kesinlikle yasaktır.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Hesap Güvenliği</h2>
      <p className="mb-4">
        Hesap bilgilerinizin (özellikle şifrenizin) güvenliğinden siz sorumlusunuz. Hesabınız üzerinden yapılan tüm aktiviteler sizin sorumluluğunuzdadır.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Fikri Mülkiyet</h2>
      <p>
        Bu sitede yer alan tüm içerikler (tasarım, metin, grafikler, logolar) bize aittir ve telif hakkı yasalarıyla korunmaktadır. İzinsiz kullanılamaz.
      </p>
       <h2 className="text-2xl font-semibold mb-2">Değişiklikler</h2>
      <p>
        Bu kullanım şartlarını zaman zaman güncelleme hakkımızı saklı tutarız. Değişiklikler bu sayfada yayınlandığı andan itibaren geçerli olur.
      </p>
    </>
  );
};

export default KullanimSartlari;
