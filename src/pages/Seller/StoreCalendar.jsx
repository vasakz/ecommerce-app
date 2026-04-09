import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Trash2, Plus, CalendarDays, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const StoreCalendar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [cargoCutoff, setCargoCutoff] = useState('15:00');
  
  const [holidays, setHolidays] = useState([
    { id: 1, name: 'Kurban Bayramı', startDate: '2026-05-27', endDate: '2026-05-30' },
    { id: 2, name: 'Yaz Tatili Önlemi', startDate: '2026-07-01', endDate: '2026-07-05' },
  ]);

  const toggleStoreStatus = () => {
    setIsOpen(!isOpen);
    toast.success(`Mağaza durumu ${!isOpen ? 'Açık' : 'Kapalı'} olarak güncellendi.`);
  };

  const removeHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
    toast.info('Tatil günü silindi.');
  };

  const addHoliday = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newHoliday = {
      id: Date.now(),
      name: formData.get('name'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || formData.get('startDate'),
    };
    setHolidays([...holidays, newHoliday]);
    toast.success('Yeni tatil günü eklendi.');
    e.target.reset();
  };

  const saveCutoff = () => {
    toast.success(`Kargo kesim saati ${cargoCutoff} olarak kaydedildi.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-600" />
            Mağaza Takvimi & Çalışma Saatleri
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Mağazanızın açık/kapalı durumu, kargo saatleri ve tatil günlerini buradan yönetin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Status Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {isOpen ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Mağaza Durumu</h3>
                <p className="text-sm text-stone-500">Şu anda müşterileriniz mağazanızı nasıl görüyor?</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-stone-800/50 rounded-2xl border border-gray-100 dark:border-stone-800">
              <div>
                <p className="font-bold text-stone-900 dark:text-white text-lg">{isOpen ? 'Mağaza Açık' : 'Mağaza Kapalı (Tatilde)'}</p>
                <p className="text-sm text-stone-500 mt-1">
                  {isOpen ? 'Müşteriler sipariş verebilir.' : 'Yeni sipariş alımı geçici olarak durduruldu.'}
                </p>
              </div>
              <button 
                onClick={toggleStoreStatus}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
                  isOpen 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40'
                }`}
              >
                {isOpen ? 'Kapat' : 'Aç'}
              </button>
            </div>
          </div>

          {/* Cargo Cutoff Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Kargo Kesim Saati</h3>
                <p className="text-sm text-stone-500">Aynı gün kargo için son sipariş saati.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-stone-800/50 rounded-2xl border border-gray-100 dark:border-stone-800 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input 
                  type="time" 
                  value={cargoCutoff}
                  onChange={(e) => setCargoCutoff(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium w-full text-stone-900 dark:text-white"
                />
                <button 
                  onClick={saveCutoff}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all whitespace-nowrap"
                >
                  Kaydet
                </button>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Örn: Müşteriye "{cargoCutoff}'a kadar sipariş verirseniz bugün kargoda!" mesajı gösterilir.
              </p>
            </div>
          </div>
        </div>

        {/* Holiday Settings */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Tatil / Özel Günler</h3>
                <p className="text-sm text-stone-500">Bu tarihlerde kargolama yapılmayacağını sistem bildirir.</p>
              </div>
            </div>
          </div>

          <form onSubmit={addHoliday} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-gray-100 dark:border-stone-800">
            <input 
              type="text" 
              name="name" 
              placeholder="Tatil Adı (Örn: Bayram)" 
              required
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input 
              type="date" 
              name="startDate" 
              required
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-blue-500 text-sm [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
            />
            <input 
              type="date" 
              name="endDate" 
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-2 focus:ring-blue-500 text-sm [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
            />
            <button type="submit" className="flex items-center justify-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-stone-800 dark:hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5" />
              Ekle
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-stone-800 text-stone-400 text-xs uppercase tracking-widest">
                  <th className="pb-4 font-bold">Tatil Adı</th>
                  <th className="pb-4 font-bold">Başlangıç</th>
                  <th className="pb-4 font-bold">Bitiş</th>
                  <th className="pb-4 font-bold text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800">
                {holidays.map(holiday => (
                  <tr key={holiday.id} className="text-sm group">
                    <td className="py-4 font-bold text-stone-900 dark:text-white">{holiday.name}</td>
                    <td className="py-4 text-stone-600 dark:text-stone-300">{holiday.startDate}</td>
                    <td className="py-4 text-stone-600 dark:text-stone-300">{holiday.endDate}</td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => removeHoliday(holiday.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-stone-500">Kayıtlı tatil günü bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoreCalendar;
