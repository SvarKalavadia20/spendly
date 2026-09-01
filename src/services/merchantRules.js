import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function saveMerchantRule(userId, merchantName, categoryId) {
  if (!userId || !merchantName || !categoryId) return;
  const normalizedMerchant = merchantName.trim().toLowerCase();
  const ruleRef = doc(db, `users/${userId}/merchantRules`, normalizedMerchant);
  await setDoc(ruleRef, { categoryId, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function fetchMerchantRules(userId) {
  if (!userId) return {};
  const rulesRef = collection(db, `users/${userId}/merchantRules`);
  const snapshot = await getDocs(rulesRef);
  const rules = {};
  snapshot.forEach((d) => {
    rules[d.id] = d.data().categoryId;
  });
  return rules;
}