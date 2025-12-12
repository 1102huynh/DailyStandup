import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { StandupEntry } from '../types';

const COLLECTION_NAME = 'standups';

export class StorageService {
  // Save to localStorage
  saveToLocal(entry: Omit<StandupEntry, 'id' | 'createdAt'>): void {
    try {
      const history = this.getLocalHistory();
      const newEntry: StandupEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      history.unshift(newEntry);
      // Keep only last 20 entries
      const trimmedHistory = history.slice(0, 20);
      localStorage.setItem('standup-history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getLocalHistory(): StandupEntry[] {
    try {
      const data = localStorage.getItem('standup-history');
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      }));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  getLastEntry(): StandupEntry | null {
    const history = this.getLocalHistory();
    return history.length > 0 ? history[0] : null;
  }

  // Save to Firestore (requires authentication)
  async saveToCloud(entry: Omit<StandupEntry, 'id' | 'createdAt'>, userId: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...entry,
        userId,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      throw error;
    }
  }

  // Get history from Firestore
  async getCloudHistory(userId: string, maxItems: number = 20): Promise<StandupEntry[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(maxItems)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as StandupEntry[];
    } catch (error) {
      console.error('Error fetching from Firestore:', error);
      throw error;
    }
  }

  // Export history as JSON
  exportHistory(entries: StandupEntry[]): void {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `standup-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();

