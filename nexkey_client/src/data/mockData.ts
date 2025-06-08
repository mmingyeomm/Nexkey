import { AccessPass, PassHolder, Activity, Organization, Analytics, PassTransaction } from '@/types/admin';

export const existingPasses: AccessPass[] = [
  {
    id: '1',
    name: '직원 출입증',
    description: '사무실 건물 및 시설 출입용',
    issuingBody: '인사부',
    passType: 'employee_badge',
    authorizedLocations: [
      { id: '1', name: '본사 사무실', address: '서울시 강남구', accessType: 'entry', deviceIds: ['scanner_001', 'scanner_002'] },
      { id: '2', name: '연구소', address: '서울시 서초구', accessType: 'entry', deviceIds: ['scanner_003'] },
      { id: '3', name: '주차장', address: '서울시 강남구', accessType: 'entry', deviceIds: ['gate_001'] }
    ],
    validityPeriod: {
      start: '2024-03-01',
      end: '2024-12-31'
    },
    transferable: false,
    tradable: false,
    createdAt: '2024-03-15',
    totalIssued: 45,
    activeCount: 42
  },
  {
    id: '2',
    name: '학생증',
    description: '캠퍼스 시설 이용 및 출입용',
    issuingBody: '학생처',
    passType: 'student_id',
    authorizedLocations: [
      { id: '4', name: '도서관', address: '대학교 캠퍼스', accessType: 'entry', deviceIds: ['lib_scanner_001'] },
      { id: '5', name: '기숙사', address: '대학교 캠퍼스', accessType: 'entry', deviceIds: ['dorm_scanner_001'] },
      { id: '6', name: '체육관', address: '대학교 캠퍼스', accessType: 'entry', deviceIds: ['gym_scanner_001'] }
    ],
    validityPeriod: {
      start: '2024-03-01',
      end: '2024-08-31'
    },
    transferable: false,
    tradable: false,
    createdAt: '2024-03-10',
    totalIssued: 28,
    activeCount: 26
  },
  {
    id: '3',
    name: '콘서트 티켓',
    description: '2024 봄 콘서트 입장권',
    issuingBody: '이벤트 기획팀',
    passType: 'event_ticket',
    authorizedLocations: [
      { id: '7', name: '올림픽공원 체조경기장', address: '서울시 송파구', accessType: 'entry', deviceIds: ['venue_scanner_001', 'venue_scanner_002'] }
    ],
    validityPeriod: {
      start: '2024-04-15',
      end: '2024-04-15'
    },
    transferable: true,
    tradable: true,
    createdAt: '2024-03-01',
    totalIssued: 1500,
    activeCount: 1450
  }
];

export const passHolders: PassHolder[] = [
  {
    id: '1',
    passId: '1',
    userName: '김철수',
    email: 'kim@example.com',
    mobileId: 'mobile_id_001',
    organization: '개발팀',
    status: 'active',
    issuedAt: '2024-03-20',
    lastUsed: '2024-03-21 14:30',
    accessHistory: [
      { id: '1', locationId: '1', locationName: '본사 사무실', timestamp: '2024-03-21 14:30', accessType: 'entry', status: 'success', deviceId: 'scanner_001' }
    ]
  },
  {
    id: '2',
    passId: '2',
    userName: '이영희',
    email: 'lee@example.com',
    mobileId: 'mobile_id_002',
    organization: '컴퓨터공학과',
    status: 'active',
    issuedAt: '2024-03-19',
    lastUsed: '2024-03-21 15:45',
    accessHistory: [
      { id: '2', locationId: '4', locationName: '도서관', timestamp: '2024-03-21 15:45', accessType: 'entry', status: 'success', deviceId: 'lib_scanner_001' }
    ]
  }
];

export const activities: Activity[] = [
  {
    id: '1',
    type: 'issuance',
    passName: '직원 출입증',
    userName: '김철수',
    timestamp: '2024-03-20 14:30:45',
    status: 'success',
    location: '본사 사무실',
    details: '김철수에게 새 출입증 발급'
  },
  {
    id: '2',
    type: 'access',
    passName: '학생증',
    userName: '이영희',
    timestamp: '2024-03-20 13:15:22',
    status: 'success',
    location: '도서관',
    details: '도서관 출입 승인'
  },
  {
    id: '3',
    type: 'batch_update',
    passName: '직원 출입증',
    userName: '시스템',
    timestamp: '2024-03-19 10:00:00',
    status: 'success',
    location: '시스템',
    details: '45개 패스 유효기간 일괄 연장',
    batchSize: 45
  }
];

export const organization: Organization = {
  id: '1',
  name: 'NexKey 액세스 관리',
  logo: '/images/NexKey_logo.png',
  role: '시스템 관리자',
  lastLogin: '2024-03-20 15:30:00',
  status: 'active',
  totalPasses: 156,
  totalUsers: 2345,
  totalLocations: 25,
  subscriptionTier: 'enterprise',
  monthlyUsage: 15420,
  usageLimit: 50000
};

export const analytics: Analytics = {
  totalScans: 15420,
  successfulScans: 14890,
  failedScans: 530,
  topLocations: [
    { name: '본사 사무실', count: 5420 },
    { name: '도서관', count: 3210 },
    { name: '주차장', count: 2890 }
  ],
  peakHours: [
    { hour: 9, count: 1200 },
    { hour: 18, count: 1100 },
    { hour: 12, count: 800 }
  ],
  passTypeDistribution: [
    { type: '직원 출입증', count: 45 },
    { type: '학생증', count: 28 },
    { type: '이벤트 티켓', count: 83 }
  ]
};

export const passTransactions: PassTransaction[] = [
  {
    id: '1',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 18450123,
    timestamp: '2024-03-21 14:30:45',
    type: 'mint',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1',
    passId: '1',
    passName: '직원 출입증',
    gasUsed: 85000,
    gasPrice: '20.5',
    status: 'success',
    details: '김철수에게 직원 출입증 발급'
  },
  {
    id: '2',
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 18450124,
    timestamp: '2024-03-21 14:35:22',
    type: 'access',
    from: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1',
    to: '0x0000000000000000000000000000000000000000',
    passId: '1',
    passName: '직원 출입증',
    gasUsed: 21000,
    gasPrice: '18.2',
    status: 'success',
    details: '본사 사무실 출입 기록'
  },
  {
    id: '3',
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    blockNumber: 18450089,
    timestamp: '2024-03-20 15:45:12',
    type: 'mint',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x8f9e8d7c6b5a4938271605f4e3d2c1b0a9988776',
    passId: '2',
    passName: '학생증',
    gasUsed: 85000,
    gasPrice: '22.1',
    status: 'success',
    details: '이영희에게 학생증 발급'
  },
  {
    id: '4',
    txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 18450090,
    timestamp: '2024-03-20 16:12:33',
    type: 'access',
    from: '0x8f9e8d7c6b5a4938271605f4e3d2c1b0a9988776',
    to: '0x0000000000000000000000000000000000000000',
    passId: '2',
    passName: '학생증',
    gasUsed: 21000,
    gasPrice: '19.8',
    status: 'success',
    details: '도서관 출입 기록'
  },
  {
    id: '5',
    txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    blockNumber: 18449950,
    timestamp: '2024-03-19 10:00:00',
    type: 'update',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x0000000000000000000000000000000000000000',
    passId: '1',
    passName: '직원 출입증',
    gasUsed: 45000,
    gasPrice: '25.0',
    status: 'success',
    details: '45개 패스 유효기간 일괄 연장'
  },
  {
    id: '6',
    txHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    blockNumber: 18450125,
    timestamp: '2024-03-21 15:20:10',
    type: 'transfer',
    from: '0x9876543210fedcba9876543210fedcba98765432',
    to: '0x1111222233334444555566667777888899990000',
    passId: '3',
    passName: '콘서트 티켓',
    gasUsed: 65000,
    gasPrice: '30.5',
    status: 'success',
    details: '콘서트 티켓 양도'
  }
]; 