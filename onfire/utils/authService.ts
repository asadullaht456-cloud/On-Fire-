import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

// Use require to get the bundled initial data
const initialUsers = require('../data/users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

const USERS_FILE_URI = FileSystem.documentDirectory + 'users.json';

export const authService = {
  async loadUsers(): Promise<User[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(USERS_FILE_URI);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(USERS_FILE_URI);
        return JSON.parse(content);
      }
      
      // If file doesn't exist, seed it with initial data
      await FileSystem.writeAsStringAsync(USERS_FILE_URI, JSON.stringify(initialUsers));
      return initialUsers;
    } catch (error) {
      console.error('Error loading users:', error);
      return initialUsers; // Fallback to initial if FS fails
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.loadUsers();
      users.push(user);
      await FileSystem.writeAsStringAsync(USERS_FILE_URI, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async hashPassword(password: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
  }
};
