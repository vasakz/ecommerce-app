export const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-15T14:30:00Z',
    status: 'Teslim Edildi',
    total: 750.00,
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Atatürk Mah. İstiklal Cad. No:123 D:4 Ümraniye/İstanbul',
    trackingNumber: 'TR1234567890',
    carrier: 'Aras Kargo',
    deliveryDetails: {
      type: 'Standart',
      option: 'Adrese Teslim',
      history: [
        { status: 'Sipariş Alındı', date: '2024-03-15T14:30:00Z', detail: 'Siparişiniz başarıyla oluşturuldu.' },
        { status: 'Hazırlanıyor', date: '2024-03-16T10:00:00Z', detail: 'Ürünleriniz paketleniyor.' },
        { status: 'Kargoya Verildi', date: '2024-03-16T16:20:00Z', detail: 'Kargonuz Aras Kargo\'ya teslim edildi.' },
        { status: 'Yolda', date: '2024-03-17T09:00:00Z', detail: 'Kargonuz transfer merkezinde.' },
        { status: 'Teslim Edildi', date: '2024-03-18T11:45:00Z', detail: 'Kargonuz teslim edildi.' }
      ]
    },
    items: [
      {
        id: 1,
        name: 'El Örmesi Kadın Hırka',
        price: 750.00,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        color: 'Bej',
        size: 'M'
      },

    ],
    timeline: [
      { status: 'Onaylandı', date: '2024-03-15T14:35:00Z', completed: true },
      { status: 'Hazırlandı', date: '2024-03-16T10:00:00Z', completed: true },
      { status: 'Kargoya Verildi', date: '2024-03-16T16:20:00Z', completed: true },
      { status: 'Teslim Edildi', date: '2024-03-18T11:45:00Z', completed: true }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-04-05T09:15:00Z',
    status: 'Kargoda',
    total: 450.00,
    paymentMethod: 'Bank Transfer',
    deliveryAddress: 'Bahçelievler Mah. 7. Sokak No:5 Çankaya/Ankara',
    trackingNumber: 'TR9876543210',
    carrier: 'Yurtiçi Kargo',
    deliveryDetails: {
      type: 'Hızlı',
      option: 'Komşuya Bırak',
      neighborName: 'Ahmet Bey (Daire 5)',
      history: [
        { status: 'Sipariş Alındı', date: '2024-04-05T09:15:00Z', detail: 'Siparişiniz alındı.' },
        { status: 'Kargoya Verildi', date: '2024-04-06T17:30:00Z', detail: 'Kargonuz yola çıktı.' },
        { status: 'Yolda', date: '2024-04-07T08:30:00Z', detail: 'Kargonuz Ankara şubesinde.' }
      ]
    },
    items: [
      {
        id: 3,
        name: 'Keten Masa Örtüsü',
        price: 450.00,
        image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        color: 'Beyaz'
      }
    ],
    timeline: [
      { status: 'Onaylandı', date: '2024-04-05T09:20:00Z', completed: true },
      { status: 'Hazırlandı', date: '2024-04-06T14:00:00Z', completed: true },
      { status: 'Kargoya Verildi', date: '2024-04-06T17:30:00Z', completed: true },
      { status: 'Teslim Edildi', date: null, completed: false }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-04-07T18:45:00Z',
    status: 'Hazırlanıyor',
    total: 890.00,
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Moda Cad. No:45 Kadıköy/İstanbul',
    trackingNumber: null,
    carrier: null,
    deliveryDetails: {
      type: 'Aynı Gün',
      option: 'Belirli Saatte Teslimat (18:00 - 21:00)',
      history: []
    },
    items: [
      {
        id: 4,
        name: 'Deri Cüzdan',
        price: 890.00,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        color: 'Kahverengi'
      }
    ],
    timeline: [
      { status: 'Onaylandı', date: '2024-04-07T18:50:00Z', completed: true },
      { status: 'Hazırlandı', date: '2024-04-08T09:00:00Z', completed: true },
      { status: 'Kargoya Verildi', date: null, completed: false },
      { status: 'Teslim Edildi', date: null, completed: false }
    ]
  },
  {
    id: 'ORD-2024-004',
    date: '2024-02-10T11:00:00Z',
    status: 'İptal Edildi',
    total: 320.00,
    paymentMethod: 'Kredi Kartı',
    deliveryAddress: 'Güzelyurt Mah. Şehitler Sok. No:2 Manisa',
    trackingNumber: null,
    carrier: null,
    deliveryDetails: {
      type: 'Standart',
      option: 'Mağazadan Teslim',
      history: [
        { status: 'İptal Edildi', date: '2024-02-11T14:00:00Z', detail: 'Müşteri talebi üzerine iptal edildi.' }
      ]
    },
    items: [
      {
        id: 5,
        name: 'Dekoratif Mum Seti',
        price: 320.00,
        image: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    timeline: [
      { status: 'Onaylandı', date: '2024-02-10T11:05:00Z', completed: true },
      { status: 'İptal Edildi', date: '2024-02-11T14:00:00Z', completed: true }
    ]
  }
];

export const ORDER_STATUSES = {
  PAYMENT_PENDING: 'Ödeme Bekleniyor',
  PENDING_APPROVAL: 'Onay Bekliyor',
  PREPARING: 'Hazırlanıyor',
  SHIPPED: 'Kargoya Verildi',
  OUT_FOR_DELIVERY: 'Dağıtımda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi',
  RETURN_PROCESS: 'İade Sürecinde',
  COULD_NOT_DELIVER: 'Teslim Edilemedi'
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Teslim Edildi':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Kargoya Verildi':
    case 'Kargoda':
    case 'Dağıtımda':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Hazırlanıyor':
    case 'Onay Bekliyor':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'İptal Edildi':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'Ödeme Bekleniyor':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Teslim Edilemedi':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

