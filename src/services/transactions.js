import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export async function addTransaction(userId, transaction) {
  if (!userId) throw new Error('User ID is required');
  
  const txRef = collection(db, `users/${userId}/transactions`);
  const payload = {
    ...transaction,
    amount: Number(transaction.amount),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(txRef, payload);
  return { id: docRef.id, ...payload };
}

export async function updateTransaction(userId, transactionId, updates) {
  if (!userId || !transactionId) throw new Error('User and Transaction ID are required');
  
  const txRef = doc(db, `users/${userId}/transactions`, transactionId);
  const payload = {
    ...updates,
    amount: Number(updates.amount),
    updatedAt: serverTimestamp()
  };

  await updateDoc(txRef, payload);
  return { id: transactionId, ...payload };
}

export async function deleteTransaction(userId, transactionId) {
  if (!userId || !transactionId) throw new Error('User and Transaction ID are required');
  const txRef = doc(db, `users/${userId}/transactions`, transactionId);
  await deleteDoc(txRef);
  return transactionId;
}

export async function fetchTransactions(userId) {
  if (!userId) return [];
  const txRef = collection(db, `users/${userId}/transactions`);
  const q = query(txRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function batchImportTransactions(userId, transactions) {
  if (!userId) throw new Error('User ID is required');
  const batch = writeBatch(db);
  const txRef = collection(db, `users/${userId}/transactions`);

  transactions.forEach((tx) => {
    const newDoc = doc(txRef);
    batch.set(newDoc, {
      ...tx,
      amount: Number(tx.amount),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
}