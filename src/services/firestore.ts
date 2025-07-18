import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Team, Player, Match, Transfer, User, UserInvitation } from '../types';

// Collections
const TEAMS_COLLECTION = 'teams';
const PLAYERS_COLLECTION = 'players';
const MATCHES_COLLECTION = 'matches';
const TRANSFERS_COLLECTION = 'transfers';
const USERS_COLLECTION = 'users';
const INVITATIONS_COLLECTION = 'invitations';

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
  // Get all users (admin only)
  async getAll(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as User[];
  },

  // Get users by role
  async getByRole(role: string): Promise<User[]> {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as User[];
  },

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

  // Create user with specific ID (for auth integration)
  async createWithId(id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = Timestamp.now();
    const docRef = doc(db, USERS_COLLECTION, id);
    
    // Filter out undefined values to prevent Firestore errors
    const cleanUserData: any = {};
    Object.keys(user).forEach(key => {
      const value = (user as any)[key];
      if (value !== undefined) {
        cleanUserData[key] = value;
      }
    });
    
    await setDoc(docRef, {
      ...cleanUserData,
      createdAt: now,
      updatedAt: now
    });
  },

  // Update user
  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Update user role and permissions
  async updateRole(id: string, role: string, permissions: string[], assignedBy: string): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
      role,
      permissions,
      assignedBy,
      updatedAt: Timestamp.now()
    });
  },

  // Suspend/activate user
  async updateStatus(id: string, status: 'active' | 'suspended'): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  },

  // Subscribe to users changes
  subscribe(callback: (users: User[]) => void) {
    return onSnapshot(collection(db, USERS_COLLECTION), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      })) as User[];
      callback(users);
    });
  }
};

// Invitations Service
export const invitationsService = {
  // Get all invitations
  async getAll(): Promise<UserInvitation[]> {
    const q = query(collection(db, INVITATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      expiresAt: convertTimestamp(doc.data().expiresAt),
      createdAt: convertTimestamp(doc.data().createdAt)
    })) as UserInvitation[];
  },

  // Get invitation by email
  async getByEmail(email: string): Promise<UserInvitation | null> {
    const q = query(
      collection(db, INVITATIONS_COLLECTION), 
      where('email', '==', email),
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        expiresAt: convertTimestamp(doc.data().expiresAt),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as UserInvitation;
    }
    return null;
  },

  // Create invitation
  async create(invitation: Omit<UserInvitation, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), {
      ...invitation,
      expiresAt: Timestamp.fromDate(invitation.expiresAt),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update invitation status
  async updateStatus(id: string, status: 'accepted' | 'expired'): Promise<void> {
    const docRef = doc(db, INVITATIONS_COLLECTION, id);
    await updateDoc(docRef, { status });
  },

  // Delete invitation
  async delete(id: string): Promise<void> {
    const docRef = doc(db, INVITATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Subscribe to invitations changes
  subscribe(callback: (invitations: UserInvitation[]) => void) {
    const q = query(collection(db, INVITATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const invitations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiresAt: convertTimestamp(doc.data().expiresAt),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as UserInvitation[];
      callback(invitations);
    });
  }
};

// Initialize sample data
export const initializeSampleData = async (): Promise<void> => {
  const batch = writeBatch(db);
  const now = Timestamp.now();

  // Real teams from public/Teams folder
  const realTeams = [
    {
      name: 'BSS FC',
      logo: '/Teams/BSS FC.jpg',
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      played: 10,
      won: 7,
      drawn: 2,
      lost: 1,
      goalsFor: 22,
      goalsAgainst: 8,
      points: 23
    },
    {
      name: 'Omit FC',
      logo: '/Teams/Omit FC.jpg',
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      played: 10,
      won: 6,
      drawn: 3,
      lost: 1,
      goalsFor: 19,
      goalsAgainst: 10,
      points: 21
    },
    {
      name: 'Komafo FC',
      logo: '/Teams/Komafo FC.jpg',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      played: 10,
      won: 6,
      drawn: 2,
      lost: 2,
      goalsFor: 18,
      goalsAgainst: 12,
      points: 20
    },
    {
      name: 'Friends FC',
      logo: '/Teams/Friends FC.jpg',
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
      played: 10,
      won: 5,
      drawn: 4,
      lost: 1,
      goalsFor: 17,
      goalsAgainst: 11,
      points: 19
    },
    {
      name: 'Time Out FC',
      logo: '/Teams/Time Out FC.jpg',
      primaryColor: '#EA580C',
      secondaryColor: '#F97316',
      played: 10,
      won: 5,
      drawn: 3,
      lost: 2,
      goalsFor: 16,
      goalsAgainst: 13,
      points: 18
    },
    {
      name: 'Amigos United',
      logo: '/Teams/Amigos United.jpg',
      primaryColor: '#0891B2',
      secondaryColor: '#0EA5E9',
      played: 10,
      won: 4,
      drawn: 5,
      lost: 1,
      goalsFor: 15,
      goalsAgainst: 12,
      points: 17
    },
    {
      name: 'Olympiakos FC',
      logo: '/Teams/Olympiakos FC.jpg',
      primaryColor: '#BE123C',
      secondaryColor: '#E11D48',
      played: 10,
      won: 4,
      drawn: 4,
      lost: 2,
      goalsFor: 14,
      goalsAgainst: 13,
      points: 16
    },
    {
      name: 'Sports Fire FC',
      logo: '/Teams/Sports Fire FC.jpg',
      primaryColor: '#C2410C',
      secondaryColor: '#EA580C',
      played: 10,
      won: 4,
      drawn: 3,
      lost: 3,
      goalsFor: 13,
      goalsAgainst: 14,
      points: 15
    },
    {
      name: 'Bweyos Katuba FC',
      logo: '/Teams/Bweyos Katuba FC.jpg',
      primaryColor: '#166534',
      secondaryColor: '#16A34A',
      played: 10,
      won: 3,
      drawn: 5,
      lost: 2,
      goalsFor: 12,
      goalsAgainst: 13,
      points: 14
    },
    {
      name: 'Sunday Special FC',
      logo: '/Teams/Sunday Special FC.jpg',
      primaryColor: '#7C2D12',
      secondaryColor: '#DC2626',
      played: 10,
      won: 3,
      drawn: 4,
      lost: 3,
      goalsFor: 11,
      goalsAgainst: 15,
      points: 13
    },
    {
      name: 'Maracana Select FC',
      logo: '/Teams/Maracana Select FC.jpg',
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      played: 10,
      won: 3,
      drawn: 3,
      lost: 4,
      goalsFor: 10,
      goalsAgainst: 16,
      points: 12
    },
    {
      name: 'Korvema Soccer Academy',
      logo: '/Teams/Korvema Soccer Academy.jpg',
      primaryColor: '#581C87',
      secondaryColor: '#7C3AED',
      played: 10,
      won: 2,
      drawn: 4,
      lost: 4,
      goalsFor: 9,
      goalsAgainst: 17,
      points: 10
    }
  ];

  // Sample players data - distributed across the real teams
  const samplePlayers = [
    // BSS FC players
    {
      name: 'Emmanuel Banda',
      position: 'Forward',
      teamId: '', // Will be set after teams are created
      age: 24,
      goals: 12,
      assists: 3,
      yellowCards: 1,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 35000,
      nationality: 'Zambia'
    },
    {
      name: 'Joseph Mwanza',
      position: 'Midfielder',
      teamId: '',
      age: 26,
      goals: 6,
      assists: 8,
      yellowCards: 2,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 28000,
      nationality: 'Zambia'
    },
    // Omit FC players
    {
      name: 'Patrick Chanda',
      position: 'Forward',
      teamId: '',
      age: 23,
      goals: 10,
      assists: 4,
      yellowCards: 0,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 32000,
      nationality: 'Zambia'
    },
    {
      name: 'Moses Phiri',
      position: 'Defender',
      teamId: '',
      age: 29,
      goals: 2,
      assists: 5,
      yellowCards: 3,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 22000,
      nationality: 'Zambia'
    },
    // Komafo FC players
    {
      name: 'Kennedy Musonda',
      position: 'Midfielder',
      teamId: '',
      age: 25,
      goals: 8,
      assists: 6,
      yellowCards: 1,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 30000,
      nationality: 'Zambia'
    },
    {
      name: 'Francis Tembo',
      position: 'Goalkeeper',
      teamId: '',
      age: 27,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 20000,
      nationality: 'Zambia'
    },
    // Friends FC players
    {
      name: 'Given Lubinda',
      position: 'Forward',
      teamId: '',
      age: 22,
      goals: 9,
      assists: 3,
      yellowCards: 1,
      redCards: 0,
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 26000,
      nationality: 'Zambia'
    },
    {
      name: 'Brian Sakala',
      position: 'Defender',
      teamId: '',
      age: 28,
      goals: 1,
      assists: 2,
      yellowCards: 4,
      redCards: 1,
      avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
      value: 18000,
      nationality: 'Zambia'
    }
  ];

  // Sample matches
  const sampleMatches = [
    {
      homeTeam: '', // Will be set after teams are created
      awayTeam: '',
      homeScore: 2,
      awayScore: 1,
      date: '2024-01-15',
      time: '15:00',
      status: 'finished' as const,
      venue: 'Leisure Park Main Field'
    },
    {
      homeTeam: '',
      awayTeam: '',
      homeScore: 0,
      awayScore: 0,
      date: '2024-01-22',
      time: '16:00',
      status: 'scheduled' as const,
      venue: 'Leisure Park Main Field'
    }
  ];

  // Add teams to batch
  const teamRefs: any[] = [];
  realTeams.forEach((team, index) => {
    const teamRef = doc(collection(db, TEAMS_COLLECTION));
    teamRefs.push(teamRef);
    batch.set(teamRef, {
      ...team,
      createdAt: now,
      updatedAt: now
    });
  });

  // Add players to batch (assign to first few teams)
  samplePlayers.forEach((player, index) => {
    const playerRef = doc(collection(db, PLAYERS_COLLECTION));
    const teamIndex = index % realTeams.length; // Distribute players across all teams
    batch.set(playerRef, {
      ...player,
      teamId: teamRefs[teamIndex]?.id || teamRefs[0].id,
      createdAt: now,
      updatedAt: now
    });
  });

  // Add sample matches
  sampleMatches.forEach((match, index) => {
    const matchRef = doc(collection(db, MATCHES_COLLECTION));
    batch.set(matchRef, {
      ...match,
      homeTeam: teamRefs[index * 2]?.id || teamRefs[0].id,
      awayTeam: teamRefs[index * 2 + 1]?.id || teamRefs[1].id,
      createdAt: now,
      updatedAt: now
    });
  });

  // Commit the batch
  await batch.commit();
  console.log('Sample data initialized successfully!');
};