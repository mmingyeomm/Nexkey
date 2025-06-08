export interface AccessPass {
  id: string;
  name: string;
  description: string;
  issuingBody: string;
  authorizedLocations: AuthorizedLocation[];
  validityPeriod: {
    start: string;
    end: string;
  };
  transferable: boolean;
  tradable: boolean;
  createdAt: string;
  totalIssued: number;
  activeCount: number;
  passType: 'employee_badge' | 'student_id' | 'event_ticket' | 'retail_access' | 'custom';
}

export interface AuthorizedLocation {
  id: string;
  name: string;
  address: string;
  accessType: 'entry' | 'payment' | 'both';
  deviceIds: string[];
}

export interface PassHolder {
  id: string;
  passId: string;
  userName: string;
  email: string;
  mobileId: string;
  organization: string;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  issuedAt: string;
  lastUsed: string;
  accessHistory: AccessRecord[];
}

export interface AccessRecord {
  id: string;
  locationId: string;
  locationName: string;
  timestamp: string;
  accessType: 'entry' | 'payment';
  status: 'success' | 'denied';
  deviceId: string;
}

export interface PassTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  type: 'mint' | 'transfer' | 'revoke' | 'update' | 'access';
  from: string;
  to: string;
  passId: string;
  passName: string;
  gasUsed: number;
  gasPrice: string;
  status: 'success' | 'failed' | 'pending';
  details: string;
}

export interface Activity {
  id: string;
  type: 'issuance' | 'revocation' | 'update' | 'access' | 'batch_update' | 'location_added';
  passName: string;
  userName: string;
  timestamp: string;
  status: 'success' | 'failed';
  location: string;
  details: string;
  batchSize?: number;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  totalPasses: number;
  totalUsers: number;
  totalLocations: number;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  monthlyUsage: number;
  usageLimit: number;
}

export interface Analytics {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  topLocations: { name: string; count: number; }[];
  peakHours: { hour: number; count: number; }[];
  passTypeDistribution: { type: string; count: number; }[];
}

export type TabType = 'dashboard' | 'pass-management' | 'pass-detail'; 