// Role definitions and permissions
export const ROLES = {
  MEMBER: 'member',
  ORGANIZER: 'organizer', 
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'users:view',
  MANAGE_USERS: 'users:manage',
  INVITE_USERS: 'users:invite',
  ASSIGN_ROLES: 'users:assign_roles',
  
  // Team Management
  VIEW_TEAMS: 'teams:view',
  CREATE_TEAMS: 'teams:create',
  EDIT_TEAMS: 'teams:edit',
  DELETE_TEAMS: 'teams:delete',
  
  // Player Management
  VIEW_PLAYERS: 'players:view',
  CREATE_PLAYERS: 'players:create',
  EDIT_PLAYERS: 'players:edit',
  DELETE_PLAYERS: 'players:delete',
  TRANSFER_PLAYERS: 'players:transfer',
  
  // Match Management
  VIEW_MATCHES: 'matches:view',
  CREATE_MATCHES: 'matches:create',
  EDIT_MATCHES: 'matches:edit',
  DELETE_MATCHES: 'matches:delete',
  MANAGE_LIVE_MATCHES: 'matches:manage_live',
  
  // League Management
  VIEW_STANDINGS: 'standings:view',
  MANAGE_LEAGUE_SETTINGS: 'league:manage_settings',
  
  // System Administration
  SYSTEM_ADMIN: 'system:admin',
  VIEW_ANALYTICS: 'analytics:view'
} as const;

export const ROLE_DEFINITIONS = {
  [ROLES.MEMBER]: {
    name: ROLES.MEMBER,
    displayName: 'Member',
    description: 'Regular league member with basic viewing access',
    permissions: [
      PERMISSIONS.VIEW_TEAMS,
      PERMISSIONS.VIEW_PLAYERS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.VIEW_STANDINGS
    ]
  },
  [ROLES.ORGANIZER]: {
    name: ROLES.ORGANIZER,
    displayName: 'Organizer',
    description: 'League organizer who can manage matches and basic league operations',
    permissions: [
      PERMISSIONS.VIEW_TEAMS,
      PERMISSIONS.VIEW_PLAYERS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.CREATE_MATCHES,
      PERMISSIONS.EDIT_MATCHES,
      PERMISSIONS.MANAGE_LIVE_MATCHES,
      PERMISSIONS.VIEW_STANDINGS,
      PERMISSIONS.TRANSFER_PLAYERS
    ]
  },
  [ROLES.ADMIN]: {
    name: ROLES.ADMIN,
    displayName: 'Administrator',
    description: 'League administrator with full management capabilities',
    permissions: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_TEAMS,
      PERMISSIONS.CREATE_TEAMS,
      PERMISSIONS.EDIT_TEAMS,
      PERMISSIONS.VIEW_PLAYERS,
      PERMISSIONS.CREATE_PLAYERS,
      PERMISSIONS.EDIT_PLAYERS,
      PERMISSIONS.TRANSFER_PLAYERS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.CREATE_MATCHES,
      PERMISSIONS.EDIT_MATCHES,
      PERMISSIONS.DELETE_MATCHES,
      PERMISSIONS.MANAGE_LIVE_MATCHES,
      PERMISSIONS.VIEW_STANDINGS,
      PERMISSIONS.MANAGE_LEAGUE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS
    ]
  },
  [ROLES.SUPER_ADMIN]: {
    name: ROLES.SUPER_ADMIN,
    displayName: 'Super Administrator',
    description: 'System super administrator with full system access',
    permissions: [
      PERMISSIONS.SYSTEM_ADMIN,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.INVITE_USERS,
      PERMISSIONS.ASSIGN_ROLES,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_TEAMS,
      PERMISSIONS.CREATE_TEAMS,
      PERMISSIONS.EDIT_TEAMS,
      PERMISSIONS.DELETE_TEAMS,
      PERMISSIONS.VIEW_PLAYERS,
      PERMISSIONS.CREATE_PLAYERS,
      PERMISSIONS.EDIT_PLAYERS,
      PERMISSIONS.DELETE_PLAYERS,
      PERMISSIONS.TRANSFER_PLAYERS,
      PERMISSIONS.VIEW_MATCHES,
      PERMISSIONS.CREATE_MATCHES,
      PERMISSIONS.EDIT_MATCHES,
      PERMISSIONS.DELETE_MATCHES,
      PERMISSIONS.MANAGE_LIVE_MATCHES,
      PERMISSIONS.VIEW_STANDINGS,
      PERMISSIONS.MANAGE_LEAGUE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS
    ],
    canAssignRoles: [ROLES.ADMIN, ROLES.ORGANIZER]
  }
} as const;

// Permission checking utilities
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes(PERMISSIONS.SYSTEM_ADMIN);
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
};

export const canAssignRole = (userRole: string, targetRole: string): boolean => {
  const roleDefinition = ROLE_DEFINITIONS[userRole as keyof typeof ROLE_DEFINITIONS];
  return roleDefinition?.canAssignRoles?.includes(targetRole) || userRole === ROLES.SUPER_ADMIN;
};

export const getRolePermissions = (role: string): string[] => {
  const roleDefinition = ROLE_DEFINITIONS[role as keyof typeof ROLE_DEFINITIONS];
  return roleDefinition?.permissions || [];
};

export const getRoleDisplayName = (role: string): string => {
  const roleDefinition = ROLE_DEFINITIONS[role as keyof typeof ROLE_DEFINITIONS];
  return roleDefinition?.displayName || role;
};

export const getRoleDescription = (role: string): string => {
  const roleDefinition = ROLE_DEFINITIONS[role as keyof typeof ROLE_DEFINITIONS];
  return roleDefinition?.description || '';
};