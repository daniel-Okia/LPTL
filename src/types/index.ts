export interface Team {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  teamId: string;
  age: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  avatar: string;
  value: number;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  venue: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transfer {
  id: string;
  playerId: string;
  playerName: string;
  fromTeamId: string;
  fromTeamName: string;
  toTeamId: string;
  toTeamName: string;
  value: number;
  date: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  favoriteTeamId?: string;
  role: 'member' | 'organizer' | 'admin' | 'super_admin';
  permissions: UserPermission[];
  status: 'active' | 'suspended' | 'pending';
  assignedBy?: string; // ID of user who assigned this role
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPermission {
  resource: string;
  actions: string[];
}

export interface RoleDefinition {
  name: string;
  displayName: string;
  description: string;
  permissions: UserPermission[];
  canAssignRoles?: string[];
}

export interface UserInvitation {
  id: string;
  email: string;
  role: 'organizer' | 'admin';
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}