import React, { useState } from 'react';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    subject: 'Sipariş Sorunu',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Real submission logic would go here
  };

  const faqs = [
    {
      q: 'Siparişimi nasıl iptal edebilirim?',
      a: 'Hazırlanma aşamasına kadar olan siparişlerinizi Siparişlerim sayfasından kolayca iptal edebilirsiniz.'
    },
    {
      q: 'İade sürecim ne zaman sonuçlanır?',
      a: 'İade edilen ürünler tarafımıza ulaştıktan sonra 3 iş günü içerisinde incelenir ve onaylandığında ücret iadeniz bankanıza yapılır.'
    },
    {
      q: 'Kargom nerede?',
      a: 'Sipariş detay sayfasındaki kargo takip numarası ile kargonuzun nerede olduğunu anlık olarak görebilirsiniz.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Size Nasıl Yardımcı Olabiliriz?</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Destek ekibimiz her türlü sorunuz için burada.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center lg:text-left">Destek Talebi Gönder</h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mesajınız Alındı!</h3>
                <p className="text-gray-600 dark:text-gray-400">En kısa sürede tarafınıza dönüş yapılacaktır.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary-600 dark:text-primary-400 font-bold hover:underline"
                >
                  Yeni bir mesaj gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ad Soyad</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                      type="text"
                      placeholder="Başak Şimşek"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">E-posta</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                      type="email"
                      placeholder="basak@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sipariş No (Opsiyonel)</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                    type="text"
                    placeholder="ORD-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Konu</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none">
                    <option>Sipariş Sorunu</option>
                    <option>İade Talebi</option>
                    <option>Kargo Bilgisi</option>
                    <option>Ürün Bilgisi</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mesajınız</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  ></textarea>
                </div>
                <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all scale-100 active:scale-95">
                  Mesajı Gönder
                </button>
              </form>
            )}
          </div>

          {/* Quick Info & FAQs */}
          <div className="space-y-8">
            {/* Doğrudan İletişim Bölümü - Siyah metinli hali */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Doğrudan İletişim</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Destek Hattı</p>
                    <p className="text-xl font-bold text-gray-900">+90 212 555 00 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">E-Posta</p>
                    <p className="text-xl font-bold text-gray-900">destek@brand.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 px-2">Sıkça Sorulan Sorular</h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;