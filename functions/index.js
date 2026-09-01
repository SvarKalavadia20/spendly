import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import corsLib from "cors";
import { parseTransactionText } from "./transactionParser.js";

admin.initializeApp();
const db = admin.firestore();

export const quickAdd = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ error: "Missing required fields: 'text' or 'userId'." });
    }

    const parsedData = parseTransactionText(text);

    if (parsedData.amount <= 0) {
      return res.status(422).json({ error: "Could not detect a valid amount from input." });
    }

    const docRef = await db
      .collection("users")
      .doc(userId)
      .collection("transactions")
      .add(parsedData);

    return res.status(200).json({
      success: true,
      id: docRef.id,
      message: `Logged ₹${parsedData.amount} for ${parsedData.merchant} (${parsedData.categoryName})`
    });

  } catch (error) {
    console.error("Error processing transaction:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});