import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const initialUsers = require('../data/users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

const USERS_STORAGE_KEY = 'onfire_users';

export const authService = {
  async loadUsers(): Promise<User[]> {
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    } catch (error) {
      console.error('Error loading users:', error);
      return initialUsers;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.loadUsers();
      users.push(user);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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
