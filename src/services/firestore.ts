import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Team, Player, Match, Transfer, User } from '../types';

// Collections
const TEAMS_COLLECTION = 'teams';
const PLAYERS_COLLECTION = 'players';
const MATCHES_COLLECTION = 'matches';
const TRANSFERS_COLLECTION = 'transfers';
const USERS_COLLECTION = 'users';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  return timestamp?.toDate() || new Date();
};

// Teams Service
export const teamsService = {
  // Get all teams
  async getAll(): Promise<Team[]> {
    const querySnapshot = await getDocs(collection(db, TEAMS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Team[];
  },

  // Get team by ID
  async getById(id: string): Promise<Team | null> {
    const docRef = doc(db, TEAMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data().createdAt),
        updatedAt: convertTimestamp(docSnap.data().updatedAt)
      } as Team;
    }
    return null;
  },

  // Add new team
  async add(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, TEAMS_COLLECTION), {
      ...team,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  // Update team
  async update(id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, TEAMS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete team
  async delete(id: string): Promise<void> {
    const docRef = doc(db, TEAMS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to teams changes
  subscribe(callback: (teams: Team[]) => void) {
    return onSnapshot(collection(db, TEAMS_COLLECTION), (snapshot) => {
      const teams = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      })) as Team[];
      callback(teams);
    });
  }
};

// Players Service
export const playersService = {
  // Get all players
  async getAll(): Promise<Player[]> {
    const querySnapshot = await getDocs(collection(db, PLAYERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Player[];
  },

  // Get player by ID
  async getById(id: string): Promise<Player | null> {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data().createdAt),
        updatedAt: convertTimestamp(docSnap.data().updatedAt)
      } as Player;
    }
    return null;
  },

  // Get players by team
  async getByTeam(teamId: string): Promise<Player[]> {
    const q = query(collection(db, PLAYERS_COLLECTION), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Player[];
  },

  // Add new player
  async add(player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
      ...player,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  // Update player
  async update(id: string, updates: Partial<Omit<Player, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Transfer player to new team
  async transfer(playerId: string, newTeamId: string): Promise<void> {
    const docRef = doc(db, PLAYERS_COLLECTION, playerId);
    await updateDoc(docRef, {
      teamId: newTeamId,
      updatedAt: Timestamp.now()
    });
  },

  // Delete player
  async delete(id: string): Promise<void> {
    const docRef = doc(db, PLAYERS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to players changes
  subscribe(callback: (players: Player[]) => void) {
    return onSnapshot(collection(db, PLAYERS_COLLECTION), (snapshot) => {
      const players = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      })) as Player[];
      callback(players);
    });
  }
};

// Matches Service
export const matchesService = {
  // Get all matches
  async getAll(): Promise<Match[]> {
    const q = query(collection(db, MATCHES_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Match[];
  },

  // Get match by ID
  async getById(id: string): Promise<Match | null> {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data().createdAt),
        updatedAt: convertTimestamp(docSnap.data().updatedAt)
      } as Match;
    }
    return null;
  },

  // Get matches by status
  async getByStatus(status: 'scheduled' | 'live' | 'finished'): Promise<Match[]> {
    const q = query(
      collection(db, MATCHES_COLLECTION),
      where('status', '==', status),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Match[];
  },

  // Add new match
  async add(match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, MATCHES_COLLECTION), {
      ...match,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  // Update match
  async update(id: string, updates: Partial<Omit<Match, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Update match score
  async updateScore(id: string, homeScore: number, awayScore: number, status: string): Promise<void> {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    await updateDoc(docRef, {
      homeScore,
      awayScore,
      status,
      updatedAt: Timestamp.now()
    });
  },

  // Delete match
  async delete(id: string): Promise<void> {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to matches changes
  subscribe(callback: (matches: Match[]) => void) {
    const q = query(collection(db, MATCHES_COLLECTION), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const matches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      })) as Match[];
      callback(matches);
    });
  }
};

// Transfers Service
export const transfersService = {
  // Get all transfers
  async getAll(): Promise<Transfer[]> {
    const q = query(collection(db, TRANSFERS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    })) as Transfer[];
  },

  // Add new transfer
  async add(transfer: Omit<Transfer, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, TRANSFERS_COLLECTION), {
      ...transfer,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Subscribe to transfers changes
  subscribe(callback: (transfers: Transfer[]) => void) {
    const q = query(collection(db, TRANSFERS_COLLECTION), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const transfers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Transfer[];
      callback(transfers);
    });
  }
};

// Users Service
export const usersService = {
  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data().createdAt),
        updatedAt: convertTimestamp(docSnap.data().updatedAt)
      } as User;
    }
    return null;
  },

  // Create new user
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      ...user,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  // Update user
  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }
};

// Initialize sample data
export const initializeSampleData = async (): Promise<void> => {
  const batch = writeBatch(db);

  // Sample teams
  const sampleTeams = [
    {
      name: 'Thunder Bolts',
      logo: '⚡',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      played: 8,
      won: 6,
      drawn: 1,
      lost: 1,
      goalsFor: 18,
      goalsAgainst: 8,
      points: 19
    },
    {
      name: 'Green Eagles',
      logo: '🦅',
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      played: 8,
      won: 5,
      drawn: 2,
      lost: 1,
      goalsFor: 16,
      goalsAgainst: 9,
      points: 17
    },
    {
      name: 'Purple Panthers',
      logo: '🐆',
      primaryColor: '#8B5CF6',
      secondaryColor: '#6D28D9',
      played: 8,
      won: 4,
      drawn: 2,
      lost: 2,
      goalsFor: 14,
      goalsAgainst: 11,
      points: 14
    },
    {
      name: 'Fire Dragons',
      logo: '🐉',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      played: 8,
      won: 3,
      drawn: 3,
      lost: 2,
      goalsFor: 12,
      goalsAgainst: 10,
      points: 12
    },
    {
      name: 'Golden Lions',
      logo: '🦁',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      played: 8,
      won: 3,
      drawn: 2,
      lost: 3,
      goalsFor: 11,
      goalsAgainst: 13,
      points: 11
    },
    {
      name: 'Silver Sharks',
      logo: '🦈',
      primaryColor: '#6B7280',
      secondaryColor: '#4B5563',
      played: 8,
      won: 2,
      drawn: 1,
      lost: 5,
      goalsFor: 8,
      goalsAgainst: 16,
      points: 7
    },
    {
      name: 'Blue Wolves',
      logo: '🐺',
      primaryColor: '#0EA5E9',
      secondaryColor: '#0284C7',
      played: 8,
      won: 1,
      drawn: 3,
      lost: 4,
      goalsFor: 7,
      goalsAgainst: 15,
      points: 6
    },
    {
      name: 'Black Tigers',
      logo: '🐅',
      primaryColor: '#1F2937',
      secondaryColor: '#111827',
      played: 8,
      won: 1,
      drawn: 2,
      lost: 5,
      goalsFor: 6,
      goalsAgainst: 18,
      points: 5
    }
  ];

  const now = Timestamp.now();

  // Add teams to batch
  sampleTeams.forEach((team, index) => {
    const teamRef = doc(collection(db, TEAMS_COLLECTION));
    batch.set(teamRef, {
      ...team,
      createdAt: now,
      updatedAt: now
    });
  });

  // Commit the batch
  await batch.commit();
  console.log('Sample data initialized successfully!');
};