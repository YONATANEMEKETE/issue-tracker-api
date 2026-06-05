import 'dotenv/config';
import { prisma } from '../db/prisma.js';
import { config } from '../configs/env.js';

const PASSWORD_HASH_PLACEHOLDER = 'DEV_PLACEHOLDER_REPLACE_IN_M5';

async function main(): Promise<void> {
  if (config.NODE_ENV === 'production') {
    throw new Error('Refusing to run seed script against production database');
  }

  console.log('Resetting tables...');
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMembership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding fixtures...');
  await prisma.$transaction(async (tx) => {
    const alice = await tx.user.create({
      data: {
        id: 'usr_alice',
        name: 'Alice Admin',
        email: 'alice@example.com',
        passwordHash: PASSWORD_HASH_PLACEHOLDER,
      },
    });

    const bob = await tx.user.create({
      data: {
        id: 'usr_bob',
        name: 'Bob Member',
        email: 'bob@example.com',
        passwordHash: PASSWORD_HASH_PLACEHOLDER,
      },
    });

    const carol = await tx.user.create({
      data: {
        id: 'usr_carol',
        name: 'Carol Viewer',
        email: 'carol@example.com',
        passwordHash: PASSWORD_HASH_PLACEHOLDER,
      },
    });

    const acme = await tx.workspace.create({
      data: {
        id: 'ws_acme',
        name: 'Acme Engineering',
        createdByUserId: alice.id,
      },
    });

    const personal = await tx.workspace.create({
      data: {
        id: 'ws_personal',
        name: 'Side Projects',
        createdByUserId: bob.id,
      },
    });

    await tx.workspaceMembership.createMany({
      data: [
        { id: 'mem_alice_acme', userId: alice.id, workspaceId: acme.id, role: 'admin' },
        { id: 'mem_bob_acme', userId: bob.id, workspaceId: acme.id, role: 'member' },
        { id: 'mem_carol_acme', userId: carol.id, workspaceId: acme.id, role: 'viewer' },
        { id: 'mem_bob_personal', userId: bob.id, workspaceId: personal.id, role: 'admin' },
        { id: 'mem_alice_personal', userId: alice.id, workspaceId: personal.id, role: 'member' },
      ],
    });

    const backend = await tx.project.create({
      data: {
        id: 'proj_backend',
        workspaceId: acme.id,
        name: 'Backend API',
        description: 'Core service for the issue tracker',
        status: 'active',
        createdByUserId: alice.id,
      },
    });

    const mobile = await tx.project.create({
      data: {
        id: 'proj_mobile',
        workspaceId: acme.id,
        name: 'Mobile App',
        description: 'Companion mobile client',
        status: 'active',
        createdByUserId: bob.id,
      },
    });

    const legacy = await tx.project.create({
      data: {
        id: 'proj_legacy',
        workspaceId: acme.id,
        name: 'Legacy Portal',
        description: 'Old admin portal, kept for reference',
        status: 'archived',
        createdByUserId: alice.id,
      },
    });

    const issueBe1 = await tx.issue.create({
      data: {
        id: 'iss_be_1',
        workspaceId: acme.id,
        projectId: backend.id,
        title: 'Add workspace scope middleware',
        description: 'Enforce membership on every workspace route before the handler runs.',
        status: 'in_progress',
        priority: 'high',
        assigneeUserId: bob.id,
        createdByUserId: alice.id,
      },
    });

    const issueBe2 = await tx.issue.create({
      data: {
        id: 'iss_be_2',
        workspaceId: acme.id,
        projectId: backend.id,
        title: 'Write integration tests for issue routes',
        description: 'Cover create, list, update, and assignment edge cases.',
        status: 'todo',
        priority: 'medium',
        assigneeUserId: null,
        createdByUserId: alice.id,
      },
    });

    const issueBe3 = await tx.issue.create({
      data: {
        id: 'iss_be_3',
        workspaceId: acme.id,
        projectId: backend.id,
        title: 'Document deployment process',
        description: null,
        status: 'done',
        priority: 'low',
        assigneeUserId: bob.id,
        createdByUserId: alice.id,
      },
    });

    const issueMa1 = await tx.issue.create({
      data: {
        id: 'iss_ma_1',
        workspaceId: acme.id,
        projectId: mobile.id,
        title: 'Fix login screen crash on Android 14',
        description: 'Reproducible on Pixel 7 with the latest build.',
        status: 'blocked',
        priority: 'urgent',
        assigneeUserId: carol.id,
        createdByUserId: bob.id,
      },
    });

    const issueMa2 = await tx.issue.create({
      data: {
        id: 'iss_ma_2',
        workspaceId: acme.id,
        projectId: mobile.id,
        title: 'Redesign issue list view',
        status: 'backlog',
        priority: 'low',
        assigneeUserId: null,
        createdByUserId: bob.id,
      },
    });

    const issueLe1 = await tx.issue.create({
      data: {
        id: 'iss_le_1',
        workspaceId: acme.id,
        projectId: legacy.id,
        title: 'Decommission old SSO bridge',
        status: 'archived',
        priority: 'medium',
        assigneeUserId: null,
        createdByUserId: alice.id,
      },
    });

    await tx.comment.createMany({
      data: [
        {
          workspaceId: acme.id,
          issueId: issueBe1.id,
          authorUserId: bob.id,
          body: 'Pulled the latest changes. Starting on the middleware chain today.',
        },
        {
          workspaceId: acme.id,
          issueId: issueBe1.id,
          authorUserId: alice.id,
          body: 'Make sure the check runs before validation, not after.',
        },
        {
          workspaceId: acme.id,
          issueId: issueMa1.id,
          authorUserId: bob.id,
          body: 'Vendor says the fix is in their next release, ETA next sprint.',
        },
      ],
    });
  });

  const counts = {
    users: await prisma.user.count(),
    workspaces: await prisma.workspace.count(),
    memberships: await prisma.workspaceMembership.count(),
    projects: await prisma.project.count(),
    issues: await prisma.issue.count(),
    comments: await prisma.comment.count(),
  };

  console.log('Seed complete:', counts);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
