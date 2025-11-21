import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import config from '../config/index.js';

/**
 * JsonRepository - Manages data persistence in a JSON file
 * Implements a file locking system to prevent race conditions
 * 
 * @class JsonRepository
 * @description Provides CRUD operations on JSON file storage with automatic locking mechanism
 */
class JsonRepository {
  constructor() {
    this.dataPath = path.resolve(config.dataPath);
    this.lockPath = `${this.dataPath}.lock`;
    this.maxLockWaitTime = 5000; // 5 secondes max d'attente
    this.lockCheckInterval = 50; // Vérifier toutes les 50ms
  }

  /**
   * Acquires a lock on the file to prevent concurrent writes
   * Waits if file is already locked (max 5 seconds)
   * 
   * @async
   * @throws {Error} If lock cannot be acquired within timeout
   */
  async acquireLock() {
    const startTime = Date.now();
    
    while (existsSync(this.lockPath)) {
      if (Date.now() - startTime > this.maxLockWaitTime) {
        throw new Error('Timeout: impossible d\'acquérir le verrou sur la base de données');
      }
      await new Promise(resolve => setTimeout(resolve, this.lockCheckInterval));
    }
    
    await fs.writeFile(this.lockPath, Date.now().toString());
  }

  /**
   * Releases the file lock
   * 
   * @async
   */
  async releaseLock() {
    if (existsSync(this.lockPath)) {
      await fs.unlink(this.lockPath);
    }
  }

  /**
   * Reads data from the JSON file
   * Initializes database if file doesn't exist
   * 
   * @async
   * @returns {Promise<Object>} Parsed JSON data
   * @throws {Error} If file cannot be read
   */
  async readData() {
    try {
      if (!existsSync(this.dataPath)) {
        await this.initializeDatabase();
      }
      
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier JSON:', error);
      throw new Error('Impossible de lire la base de données');
    }
  }

  /**
   * Writes data to the JSON file with pretty formatting
   * 
   * @async
   * @param {Object} data - Data to write
   * @throws {Error} If file cannot be written
   */
  async writeData(data) {
    try {
      await fs.writeFile(
        this.dataPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Erreur lors de l\'écriture du fichier JSON:', error);
      throw new Error('Impossible d\'écrire dans la base de données');
    }
  }

  /**
   * Initializes database with empty collections
   * 
   * @async
   */
  async initializeDatabase() {
    const initialData = {
      services: [],
      users: [],
      bookings: [],
    };
    await this.writeData(initialData);
  }

  /**
   * Reads a specific collection from the database
   * 
   * @async
   * @param {string} collection - Collection name (e.g., 'users', 'services', 'bookings')
   * @returns {Promise<Array>} Array of items in the collection
   */
  async read(collection) {
    await this.acquireLock();
    try {
      const data = await this.readData();
      return data[collection] || [];
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Writes items to a specific collection
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {Array} items - Items to write
   * @returns {Promise<Array>} Written items
   */
  async write(collection, items) {
    await this.acquireLock();
    try {
      const data = await this.readData();
      data[collection] = items;
      await this.writeData(data);
      return items;
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Finds an item by its ID
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {number|string} id - Item ID
   * @returns {Promise<Object|undefined>} Found item or undefined
   */
  async findById(collection, id) {
    const items = await this.read(collection);
    return items.find(item => item.id === parseInt(id));
  }

  /**
   * Finds a single item matching a predicate
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {Function} predicate - Filter function
   * @returns {Promise<Object|undefined>} First matching item or undefined
   */
  async findOne(collection, predicate) {
    const items = await this.read(collection);
    return items.find(predicate);
  }

  /**
   * Finds all items matching a predicate
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {Function} [predicate] - Optional filter function
   * @returns {Promise<Array>} Array of matching items
   */
  async findMany(collection, predicate) {
    const items = await this.read(collection);
    return predicate ? items.filter(predicate) : items;
  }

  /**
   * Creates a new item with auto-generated ID and timestamp
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {Object} newItem - Item data (without ID)
   * @returns {Promise<Object>} Created item with ID and createdAt
   */
  async create(collection, newItem) {
    await this.acquireLock();
    try {
      const data = await this.readData();
      const items = data[collection] || [];
      
      // Génère un nouvel ID
      const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
      const itemWithId = {
        ...newItem,
        id: maxId + 1,
        createdAt: new Date().toISOString(),
      };
      
      items.push(itemWithId);
      data[collection] = items;
      await this.writeData(data);
      
      return itemWithId;
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Updates an existing item by ID
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {number|string} id - Item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated item or null if not found
   */
  async update(collection, id, updates) {
    await this.acquireLock();
    try {
      const data = await this.readData();
      const items = data[collection] || [];
      const index = items.findIndex(item => item.id === parseInt(id));
      
      if (index === -1) {
        return null;
      }
      
      items[index] = {
        ...items[index],
        ...updates,
        id: items[index].id, // Préserve l'ID
        updatedAt: new Date().toISOString(),
      };
      
      data[collection] = items;
      await this.writeData(data);
      
      return items[index];
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Deletes an item by ID
   * 
   * @async
   * @param {string} collection - Collection name
   * @param {number|string} id - Item ID
   * @returns {Promise<boolean|null>} true if deleted, null if not found
   */
  async delete(collection, id) {
    await this.acquireLock();
    try {
      const data = await this.readData();
      const items = data[collection] || [];
      const filteredItems = items.filter(item => item.id !== parseInt(id));
      
      if (filteredItems.length === items.length) {
        return null; // Aucun élément supprimé
      }
      
      data[collection] = filteredItems;
      await this.writeData(data);
      
      return true;
    } finally {
      await this.releaseLock();
    }
  }
}

export default new JsonRepository();
