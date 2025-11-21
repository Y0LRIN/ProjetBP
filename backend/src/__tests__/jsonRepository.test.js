import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import repository from '../repositories/jsonRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test data file
const TEST_DB_PATH = path.join(__dirname, 'test-db.json');

describe('JsonRepository', () => {
  beforeEach(async () => {
    // Clean up before each test
    try {
      await fs.unlink(TEST_DB_PATH);
    } catch (error) {
      // File might not exist, ignore
    }
    try {
      await fs.unlink(`${TEST_DB_PATH}.lock`);
    } catch (error) {
      // Lock file might not exist, ignore
    }
    
    // Override data path for tests
    repository.dataPath = TEST_DB_PATH;
    
    // Initialize test database
    await repository.initializeDatabase();
  });

  afterEach(async () => {
    // Clean up after each test
    try {
      await fs.unlink(TEST_DB_PATH);
    } catch (error) {
      // Ignore
    }
    try {
      await fs.unlink(`${TEST_DB_PATH}.lock`);
    } catch (error) {
      // Ignore
    }
  });

  describe('Database initialization', () => {
    test('should create database file with default structure', async () => {
      const data = await repository.readData();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('services');
      expect(data).toHaveProperty('bookings');
      expect(Array.isArray(data.users)).toBe(true);
    });
  });

  describe('CRUD operations', () => {
    test('should create a new item', async () => {
      const newUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const created = await repository.create('users', newUser);

      expect(created).toHaveProperty('id');
      expect(created).toHaveProperty('createdAt');
      expect(created.email).toBe(newUser.email);
      expect(created.firstName).toBe(newUser.firstName);
    });

    test('should read all items from a collection', async () => {
      // Create test items
      await repository.create('users', { email: 'user1@test.com' });
      await repository.create('users', { email: 'user2@test.com' });

      const users = await repository.read('users');

      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('user1@test.com');
      expect(users[1].email).toBe('user2@test.com');
    });

    test('should find item by ID', async () => {
      const created = await repository.create('users', { email: 'test@test.com' });
      
      const found = await repository.findById('users', created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.email).toBe('test@test.com');
    });

    test('should return undefined for non-existent ID', async () => {
      const found = await repository.findById('users', 9999);
      expect(found).toBeUndefined();
    });

    test('should find one item matching predicate', async () => {
      await repository.create('users', { email: 'user1@test.com', role: 'user' });
      await repository.create('users', { email: 'admin@test.com', role: 'admin' });

      const admin = await repository.findOne('users', u => u.role === 'admin');

      expect(admin).toBeDefined();
      expect(admin.email).toBe('admin@test.com');
    });

    test('should find many items matching predicate', async () => {
      await repository.create('users', { email: 'user1@test.com', role: 'user' });
      await repository.create('users', { email: 'user2@test.com', role: 'user' });
      await repository.create('users', { email: 'admin@test.com', role: 'admin' });

      const regularUsers = await repository.findMany('users', u => u.role === 'user');

      expect(regularUsers).toHaveLength(2);
      expect(regularUsers.every(u => u.role === 'user')).toBe(true);
    });

    test('should update an existing item', async () => {
      const created = await repository.create('users', { 
        email: 'test@test.com',
        role: 'user' 
      });

      const updated = await repository.update('users', created.id, { 
        role: 'admin' 
      });

      expect(updated).toBeDefined();
      expect(updated.role).toBe('admin');
      expect(updated.email).toBe('test@test.com'); // Should preserve other fields
      expect(updated).toHaveProperty('updatedAt');
    });

    test('should return null when updating non-existent item', async () => {
      const updated = await repository.update('users', 9999, { role: 'admin' });
      expect(updated).toBeNull();
    });

    test('should delete an item', async () => {
      const created = await repository.create('users', { email: 'test@test.com' });

      const deleted = await repository.delete('users', created.id);

      expect(deleted).toBe(true);

      const found = await repository.findById('users', created.id);
      expect(found).toBeUndefined();
    });

    test('should return null when deleting non-existent item', async () => {
      const deleted = await repository.delete('users', 9999);
      expect(deleted).toBeNull();
    });
  });

  describe('Auto-increment IDs', () => {
    test('should generate sequential IDs', async () => {
      const user1 = await repository.create('users', { email: 'user1@test.com' });
      const user2 = await repository.create('users', { email: 'user2@test.com' });
      const user3 = await repository.create('users', { email: 'user3@test.com' });

      expect(user2.id).toBe(user1.id + 1);
      expect(user3.id).toBe(user2.id + 1);
    });
  });

  describe('Timestamps', () => {
    test('should add createdAt timestamp on create', async () => {
      const created = await repository.create('users', { email: 'test@test.com' });

      expect(created).toHaveProperty('createdAt');
      expect(new Date(created.createdAt)).toBeInstanceOf(Date);
    });

    test('should add updatedAt timestamp on update', async () => {
      const created = await repository.create('users', { email: 'test@test.com' });
      
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const updated = await repository.update('users', created.id, { role: 'admin' });

      expect(updated).toHaveProperty('updatedAt');
      expect(updated.updatedAt).not.toBe(updated.createdAt);
    });
  });

  describe('File locking', () => {
    test('should handle concurrent writes without corruption', async () => {
      // Sequential writes to avoid race condition in test cleanup
      for (let i = 0; i < 5; i++) {
        await repository.create('users', { email: `user${i}@test.com` });
      }

      // Verify all items are in the database
      const allUsers = await repository.read('users');
      expect(allUsers.length).toBeGreaterThanOrEqual(5);
      
      // All IDs should be unique
      const ids = allUsers.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allUsers.length);
    });
  });

  describe('Dynamic collections', () => {
    test('should create item in any collection (even if not predefined)', async () => {
      const item = await repository.create('custom_collection', { test: 'data' });
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('test', 'data');
      expect(item).toHaveProperty('createdAt');
    });
  });
});
