import { getCouple, createCouple } from './db.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Missing parameter 'id'" });
      }
      const couple = await getCouple(id);
      if (!couple) {
        return res.status(404).json({ error: "Couple room not found" });
      }
      return res.status(200).json(couple);
    } 
    
    if (req.method === 'POST') {
      const { nameA, nameB } = req.body || {};
      if (!nameA || !nameB) {
        return res.status(400).json({ error: "Please provide 'nameA' and 'nameB'" });
      }
      
      const coupleId = crypto.randomUUID();
      const couple = await createCouple(coupleId, nameA.trim(), nameB.trim());
      
      return res.status(200).json({
        coupleId,
        nameA: couple.nameA,
        nameB: couple.nameB,
        createdAt: couple.createdAt
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error in api/couple.js:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
