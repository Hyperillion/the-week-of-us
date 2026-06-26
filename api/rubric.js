import { getRubrics, saveRubric } from './db.js';

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
      const { coupleId, week, partner } = req.query;
      if (!coupleId || !week) {
        return res.status(400).json({ error: "Missing required parameters: 'coupleId' and 'week'" });
      }

      const rubrics = await getRubrics(coupleId, week);
      const hasA = !!rubrics.A;
      const hasB = !!rubrics.B;
      const isUnlocked = hasA && hasB;

      const progress = { A: hasA, B: hasB };

      if (isUnlocked) {
        return res.status(200).json({
          unlocked: true,
          progress,
          A: rubrics.A,
          B: rubrics.B
        });
      } else {
        // Safe sanitization: Hide details of the other partner's submission
        const responseData = {
          unlocked: false,
          progress
        };

        // If the requestor asks for their own data, allow them to see it (e.g. for reloading state)
        if (partner === 'A' && hasA) {
          responseData.A = rubrics.A;
        } else if (partner === 'B' && hasB) {
          responseData.B = rubrics.B;
        }

        return res.status(200).json(responseData);
      }
    }

    if (req.method === 'POST') {
      const { coupleId, week, partner, data } = req.body || {};
      if (!coupleId || !week || !partner || !data) {
        return res.status(400).json({ error: "Missing required payload: 'coupleId', 'week', 'partner', and 'data'" });
      }

      if (partner !== 'A' && partner !== 'B') {
        return res.status(400).json({ error: "Invalid partner. Must be 'A' or 'B'" });
      }

      // Save rubric in database
      await saveRubric(coupleId, week, partner, data);

      // Check if this submit unlocked the report
      const rubrics = await getRubrics(coupleId, week);
      const isUnlocked = !!(rubrics.A && rubrics.B);

      return res.status(200).json({
        success: true,
        unlocked: isUnlocked,
        progress: { A: !!rubrics.A, B: !!rubrics.B }
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error in api/rubric.js:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
