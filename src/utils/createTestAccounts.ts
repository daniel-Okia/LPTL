import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { usersService } from '../services/firestore';
import { ROLES, getRolePermissions } from './permissions';

// Function to create test accounts programmatically
export const createTestAccounts = async () => {
  try {
    console.log('Creating test accounts...');

    // Create Super Admin Account
    const superAdminCredential = await createUserWithEmailAndPassword(
      auth, 
      'superadmin@lptl.com', 
      'admin123'
    );

    await usersService.createWithId(superAdminCredential.user.uid, {
      email: 'superadmin@lptl.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: ROLES.SUPER_ADMIN,
      permissions: getRolePermissions(ROLES.SUPER_ADMIN),
      status: 'active'
    });

    console.log('✅ Super Admin created: superadmin@lptl.com / admin123');

    // Create Regular Admin Account
    const adminCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@lptl.com', 
      'admin123'
    );

    await usersService.createWithId(adminCredential.user.uid, {
      email: 'admin@lptl.com',
      firstName: 'League',
      lastName: 'Admin',
      role: ROLES.ADMIN,
      permissions: getRolePermissions(ROLES.ADMIN),
      status: 'active'
    });

    console.log('✅ Admin created: admin@lptl.com / admin123');

    // Create Organizer Account
    const organizerCredential = await createUserWithEmailAndPassword(
      auth, 
      'organizer@lptl.com', 
      'admin123'
    );

    await usersService.createWithId(organizerCredential.user.uid, {
      email: 'organizer@lptl.com',
      firstName: 'League',
      lastName: 'Organizer',
      role: ROLES.ORGANIZER,
      permissions: getRolePermissions(ROLES.ORGANIZER),
      status: 'active'
    });

    console.log('✅ Organizer created: organizer@lptl.com / admin123');

    console.log('🎉 All test accounts created successfully!');
    
    return {
      superAdmin: { email: 'superadmin@lptl.com', password: 'admin123' },
      admin: { email: 'admin@lptl.com', password: 'admin123' },
      organizer: { email: 'organizer@lptl.com', password: 'admin123' }
    };

  } catch (error: any) {
    console.error('❌ Error creating test accounts:', error);
    
    // If accounts already exist, just return the credentials
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Test accounts already exist, returning credentials...');
      return {
        superAdmin: { email: 'superadmin@lptl.com', password: 'admin123' },
        admin: { email: 'admin@lptl.com', password: 'admin123' },
        organizer: { email: 'organizer@lptl.com', password: 'admin123' }
      };
    }
    
    throw error;
  }
};

// Quick function to create a single admin account
export const createQuickAdmin = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    await usersService.createWithId(credential.user.uid, {
      email,
      firstName,
      lastName,
      role: ROLES.ADMIN,
      permissions: getRolePermissions(ROLES.ADMIN),
      status: 'active'
    });

    console.log(`✅ Admin account created: ${email} / ${password}`);
    return { email, password };
  } catch (error: any) {
    console.error('❌ Error creating admin account:', error);
    throw error;
  }
};