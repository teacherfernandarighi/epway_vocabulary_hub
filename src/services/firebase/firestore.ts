import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { VocabularyWord, UserProfile } from '../../types';

const WORDS_COLLECTION = 'words';
const USERS_COLLECTION = 'users';

// User Profile Operations
export async function syncUserProfile(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: 'admin' | 'student';
}): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userSnap = await getDoc(userRef);

  const todayStr = new Date().toISOString().split('T')[0];

  if (userSnap.exists()) {
    const data = userSnap.data() as UserProfile;
    let newStreak = data.streak || 1;

    // Check streak continuation
    if (data.lastActiveDate) {
      const lastDate = new Date(data.lastActiveDate);
      const currDate = new Date(todayStr);
      const diffDays = Math.round(
        (currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      );

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const updatedProfile: UserProfile = {
      ...data,
      displayName: user.displayName || data.displayName || 'Estudante EPWAY',
      email: user.email || data.email,
      photoURL:
        user.photoURL ||
        data.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      role: user.role || data.role || 'student',
      streak: newStreak,
      lastActiveDate: todayStr,
    };

    await updateDoc(userRef, {
      displayName: updatedProfile.displayName,
      photoURL: updatedProfile.photoURL,
      role: updatedProfile.role,
      streak: updatedProfile.streak,
      lastActiveDate: updatedProfile.lastActiveDate,
    });

    return updatedProfile;
  } else {
    // New user profile
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Estudante EPWAY',
      email: user.email || '',
      photoURL:
        user.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      role: user.role || 'student',
      streak: 1,
      lastActiveDate: todayStr,
      theme: 'light',
      createdAt: new Date().toISOString(),
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, updates);
}

// Vocabulary Words Operations
export function subscribeToWords(
  userId: string,
  onUpdate: (words: VocabularyWord[]) => void,
  onError?: (error: Error) => void
) {
  const wordsRef = collection(db, WORDS_COLLECTION);
  const q = query(wordsRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const words: VocabularyWord[] = [];
      snapshot.forEach((docSnap) => {
        words.push({ id: docSnap.id, ...docSnap.data() } as VocabularyWord);
      });
      // Sort in memory by createdAt descending
      words.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onUpdate(words);
    },
    (err) => {
      console.error('Firestore words subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export async function addVocabularyWord(
  wordData: Omit<VocabularyWord, 'id'>
): Promise<string> {
  const wordsRef = collection(db, WORDS_COLLECTION);
  const docRef = await addDoc(wordsRef, {
    ...wordData,
    createdAt: wordData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateVocabularyWord(
  wordId: string,
  updates: Partial<VocabularyWord>
): Promise<void> {
  const wordRef = doc(db, WORDS_COLLECTION, wordId);
  await updateDoc(wordRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteVocabularyWord(wordId: string): Promise<void> {
  const wordRef = doc(db, WORDS_COLLECTION, wordId);
  await deleteDoc(wordRef);
}

export async function importBatchWords(
  userId: string,
  words: Omit<VocabularyWord, 'id' | 'userId'>[]
): Promise<number> {
  const batch = writeBatch(db);
  const wordsRef = collection(db, WORDS_COLLECTION);

  let count = 0;
  for (const word of words) {
    const newDocRef = doc(wordsRef);
    batch.set(newDocRef, {
      ...word,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    count++;
  }

  await batch.commit();
  return count;
}
