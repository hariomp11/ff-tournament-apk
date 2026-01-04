
import { User, Match, Transaction, JoinedMatch, UserRole, MatchStatus, MatchType } from './types';

const STORAGE_KEYS = {
  USERS: 'nova_arena_users',
  MATCHES: 'nova_arena_matches',
  TRANSACTIONS: 'nova_arena_transactions',
  JOINED_MATCHES: 'nova_arena_joined_matches',
  CURRENT_USER: 'nova_arena_current_user'
};

const initialMatches: Match[] = [
  {
    id: 'm1',
    title: 'Sunday Night Blitz',
    type: MatchType.SOLO,
    entryFee: 10,
    prizePool: 500,
    startTime: Date.now() + 3600000,
    status: MatchStatus.UPCOMING,
    joinedCount: 42,
    totalSlots: 48
  },
  {
    id: 'm2',
    title: 'Squad Warriors Championship',
    type: MatchType.SQUAD,
    entryFee: 40,
    prizePool: 2000,
    startTime: Date.now() + 7200000,
    status: MatchStatus.UPCOMING,
    joinedCount: 10,
    totalSlots: 12
  }
];

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getMatches: (): Match[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(initialMatches));
      return initialMatches;
    }
    return JSON.parse(data);
  },
  setMatches: (matches: Match[]) => localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches)),
  
  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]'),
  setTransactions: (txs: Transaction[]) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs)),
  
  getJoinedMatches: (): JoinedMatch[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINED_MATCHES) || '[]'),
  setJoinedMatches: (joined: JoinedMatch[]) => localStorage.setItem(STORAGE_KEYS.JOINED_MATCHES, JSON.stringify(joined)),

  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
};
