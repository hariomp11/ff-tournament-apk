
export enum UserRole {
  PLAYER = 'player',
  ADMIN = 'admin'
}

export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MatchType {
  SOLO = 'Solo',
  DUO = 'Duo',
  SQUAD = 'Squad'
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  JOIN_FEE = 'join_fee',
  WINNING = 'winning'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  isBlocked: boolean;
  createdAt: number;
}

export interface Match {
  id: string;
  title: string;
  type: MatchType;
  entryFee: number;
  prizePool: number;
  startTime: number;
  status: MatchStatus;
  joinedCount: number;
  totalSlots: number;
  roomId?: string;
  roomPass?: string;
  results?: MatchResult[];
}

export interface MatchResult {
  userId: string;
  userName: string;
  rank: number;
  kills: number;
  winnings: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: number;
  screenshotUrl?: string;
  upiId?: string;
  note?: string;
}

export interface JoinedMatch {
  matchId: string;
  userId: string;
  joinedAt: number;
}
