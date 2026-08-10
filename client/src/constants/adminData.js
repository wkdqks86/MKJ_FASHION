export const ORDER_STATUS_LABELS = {
  pending: '입금대기',
  processing: '배송준비중',
  shipped: '배송중',
  delivered: '배송완료',
  cancelled: '취소/환불',
}

export const ORDER_STATUS_CLASS = {
  pending: 'admin-status--pending',
  processing: 'admin-status--processing',
  shipped: 'admin-status--shipped',
  delivered: 'admin-status--delivered',
  cancelled: 'admin-status--cancelled',
}

export const KPI_STATS = [
  { label: '오늘의 매출', value: '₩12,450,000', trend: '+12%', trendDir: 'up', icon: '📈' },
  { label: '신규 주문', value: '158', trend: '+8%', trendDir: 'up', icon: '🛒' },
  { label: '배송 대기', value: '47', trend: '-3%', trendDir: 'down', icon: '🚚' },
  { label: '품절 임박', value: '22', trend: 'items', trendDir: 'neutral', icon: '⚠️' },
]

export const REVENUE_CHART = [
  { month: '10월', value: 45 },
  { month: '11월', value: 52 },
  { month: '12월', value: 85 },
  { month: '1월', value: 68 },
]

export const ORDER_VOLUME_CHART = [
  { day: '월', value: 42 },
  { day: '화', value: 55 },
  { day: '수', value: 48 },
  { day: '목', value: 62 },
  { day: '금', value: 70 },
  { day: '토', value: 38 },
  { day: '일', value: 30 },
]

export const MOCK_ORDERS = [
  {
    _id: 'mock-1',
    orderNumber: 'MKJ-20260805-0012',
    orderer: {
      name: '홍길동',
      email: 'hong.gildong@example.com',
      phone: '010-1234-5678',
    },
    shipping: {
      recipientName: '홍길동',
      phone: '010-1234-5678',
      postalCode: '06234',
      addressLine1: '서울특별시 강남구 테헤란로 123',
      addressLine2: 'MKJ빌딩 5층',
      memo: '',
    },
    items: [
      {
        productName: '멋진 스니커즈',
        sku: 'MKJ-MSHO-000001',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
        size: '260',
        quantity: 1,
        unitPrice: 89000,
        lineTotal: 89000,
      },
    ],
    itemsSubtotal: 89000,
    shippingFee: 3000,
    discountAmount: 0,
    totalAmount: 92000,
    payment: { method: 'card', status: 'paid', paidAt: '2026-08-05T14:30:00.000Z' },
    status: 'shipped',
    shippingInfo: { carrier: 'CJ대한통운', trackingNumber: '123456789012' },
    createdAt: '2026-08-05T14:30:00.000Z',
  },
  {
    _id: 'mock-2',
    orderNumber: 'MKJ-20260804-0089',
    orderer: {
      name: '김민지',
      email: 'minji@example.com',
      phone: '010-9876-5432',
    },
    shipping: {
      recipientName: '김민지',
      phone: '010-9876-5432',
      postalCode: '13561',
      addressLine1: '경기도 성남시 분당구 정자동 45-2',
      addressLine2: '',
      memo: '부재 시 문 앞',
    },
    items: [
      {
        productName: '오버핏 코튼 셔츠',
        sku: 'MKJ-MTOP-000002',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200',
        size: 'M',
        quantity: 2,
        unitPrice: 89000,
        lineTotal: 178000,
      },
    ],
    itemsSubtotal: 178000,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 178000,
    payment: { method: 'card', status: 'paid', paidAt: '2026-08-04T09:15:00.000Z' },
    status: 'delivered',
    shippingInfo: { carrier: 'CJ대한통운', trackingNumber: '987654321098' },
    createdAt: '2026-08-04T09:15:00.000Z',
  },
  {
    _id: 'mock-3',
    orderNumber: 'MKJ-20260803-0045',
    orderer: { name: '이서준', email: null, phone: '010-2222-3333' },
    shipping: {
      recipientName: '이서준',
      phone: '010-2222-3333',
      postalCode: '48058',
      addressLine1: '부산광역시 해운대구 마린시티 101',
      addressLine2: '',
      memo: '',
    },
    items: [
      {
        productName: '울 블렌드 블레이저',
        sku: 'MKJ-MTOP-000003',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200',
        size: 'L',
        quantity: 1,
        unitPrice: 189000,
        lineTotal: 189000,
      },
    ],
    itemsSubtotal: 189000,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 189000,
    payment: { method: 'transfer', status: 'paid' },
    status: 'processing',
    shippingInfo: {},
    createdAt: '2026-08-03T16:45:00.000Z',
  },
  {
    _id: 'mock-4',
    orderNumber: 'MKJ-20260802-0031',
    orderer: { name: '박지우', email: null, phone: null },
    shipping: {
      recipientName: '박지우',
      phone: '010-4444-5555',
      postalCode: '42100',
      addressLine1: '대구광역시 수성구 범어동 78',
      addressLine2: '',
      memo: '',
    },
    items: [
      {
        productName: '캐시미어 니트',
        sku: 'MKJ-FTOP-000004',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200',
        size: 'M',
        quantity: 1,
        unitPrice: 129000,
        lineTotal: 129000,
      },
    ],
    itemsSubtotal: 129000,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 129000,
    payment: { method: 'card', status: 'paid' },
    status: 'delivered',
    shippingInfo: {},
    createdAt: '2026-08-02T11:20:00.000Z',
  },
  {
    _id: 'mock-5',
    orderNumber: 'MKJ-20260801-0018',
    orderer: { name: '최유나', email: 'yuna@example.com', phone: '010-6666-7777' },
    shipping: {
      recipientName: '최유나',
      phone: '010-6666-7777',
      postalCode: '22000',
      addressLine1: '인천광역시 연수구 송도동 55',
      addressLine2: '101동 1204호',
      memo: '',
    },
    items: [
      {
        productName: '트렌치 코트',
        sku: 'MKJ-FTOP-000005',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200',
        size: 'L',
        quantity: 1,
        unitPrice: 259000,
        lineTotal: 259000,
      },
    ],
    itemsSubtotal: 259000,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 259000,
    payment: { method: 'kakao', status: 'paid' },
    status: 'shipped',
    shippingInfo: { carrier: '한진택배', trackingNumber: '555566667777' },
    createdAt: '2026-08-01T08:00:00.000Z',
  },
]

export const MOCK_PRODUCTS = [
  { id: '1012001', code: '1012001', name: '오버핏 코튼 셔츠', category: 'MKJ STUDIO', listPrice: 99000, salePrice: 89000, stock: 80, displayed: true, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop' },
  { id: '1012002', code: '1012002', name: '울 블렌드 블레이저', category: 'MKJ STUDIO', listPrice: 219000, salePrice: 189000, stock: 45, displayed: true, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' },
  { id: '1012003', code: '1012003', name: '플리츠 미디 스커트', category: 'MKJ ATELIER', listPrice: 89000, salePrice: 79000, stock: 10, displayed: true, image: 'https://images.unsplash.com/photo-1583496661160-fb2456c1ed73?w=100&h=100&fit=crop' },
  { id: '1012004', code: '1012004', name: '캐시미어 니트', category: 'MKJ ATELIER', listPrice: 149000, salePrice: 129000, stock: 0, displayed: false, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop' },
  { id: '1012005', code: '1012005', name: '트렌치 코트', category: 'MKJ EDITION', listPrice: 299000, salePrice: 259000, stock: 22, displayed: true, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop' },
  { id: '1012006', code: '1012006', name: '슬림핏 슬랙스', category: 'MKJ EDITION', listPrice: 119000, salePrice: 99000, stock: 100, displayed: true, image: 'https://images.unsplash.com/photo-1593030761757-71caebc98897?w=100&h=100&fit=crop' },
]

export const PRODUCT_CATEGORIES = ['전체 카테고리', 'MKJ STUDIO', 'MKJ ATELIER', 'MKJ EDITION']

export const USER_TYPE_LABELS = {
  customer: '일반회원',
  admin: '관리자',
}

export const USER_TYPE_CLASS = {
  customer: 'admin-status--processing',
  admin: 'admin-status--active',
}

export const MEMBER_FILTER_TYPES = [
  { key: 'customer', label: '일반회원' },
  { key: 'admin', label: '관리자' },
]

export const MEMBER_FILTER_STATUSES = [
  { key: 'active', label: '활성' },
  { key: 'inactive', label: '비활성' },
]

export const MOCK_MEMBERS = [
  {
    _id: 'mock-m1',
    name: '홍길동',
    email: 'hong.gildong@example.com',
    phone: '010-1234-5678',
    user_type: 'customer',
    isActive: true,
    address: '서울특별시 강남구 테헤란로 123',
    createdAt: '2026-07-01T10:00:00.000Z',
    lastLoginAt: '2026-08-09T18:30:00.000Z',
  },
  {
    _id: 'mock-m2',
    name: '김민지',
    email: 'minji@example.com',
    phone: '010-9876-5432',
    user_type: 'customer',
    isActive: true,
    address: '경기도 성남시 분당구 정자동 45-2',
    createdAt: '2026-07-15T09:20:00.000Z',
    lastLoginAt: '2026-08-08T14:10:00.000Z',
  },
  {
    _id: 'mock-m3',
    name: '관리자',
    email: 'admin@mkj.com',
    phone: '010-0000-0000',
    user_type: 'admin',
    isActive: true,
    address: null,
    createdAt: '2026-06-01T08:00:00.000Z',
    lastLoginAt: '2026-08-10T09:00:00.000Z',
  },
]

export const ORDER_FILTER_STATUSES = [
  { key: 'pending', label: '입금대기' },
  { key: 'processing', label: '배송준비중' },
  { key: 'shipped', label: '배송중' },
  { key: 'delivered', label: '배송완료' },
  { key: 'cancelled', label: '취소/환불' },
]

export const DATE_PRESETS = ['오늘', '1주일', '1개월', '3개월', '전체']

export function formatPrice(amount) {
  return `₩${Number(amount).toLocaleString('ko-KR')}`
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function summarizeOrderItems(items = []) {
  if (!items.length) return '-'
  const first = items[0].productName
  const extra = items.length > 1 ? ` 외 ${items.length - 1}건` : ''
  const qty = items.reduce((sum, i) => sum + i.quantity, 0)
  return `${first} (x${qty})${extra}`
}
