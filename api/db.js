import fs from 'fs/promises';
import path from 'path';

// Local dev database path in the temporary directory
const LOCAL_DB_PATH = path.join('/tmp', 'the_week_of_us_dev.json');

// Check if Vercel KV / Upstash Redis credentials are set
const isProdDb = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

/**
 * Executes a Redis command via HTTP REST API
 */
async function runRedis(command) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`KV REST API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.result;
}

/**
 * Local file database helpers
 */
async function readLocalDb() {
  try {
    const content = await fs.readFile(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // If file doesn't exist, return empty database structure
    return { couples: {}, rubrics: {} };
  }
}

async function writeLocalDb(db) {
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * DB Exports
 */
export async function getCouple(coupleId) {
  if (isProdDb) {
    const result = await runRedis(["GET", `couple:${coupleId}`]);
    return result ? JSON.parse(result) : null;
  } else {
    const db = await readLocalDb();
    return db.couples[coupleId] || null;
  }
}

export async function createCouple(coupleId, nameA, nameB) {
  const coupleData = { nameA, nameB, createdAt: new Date().toISOString() };
  if (isProdDb) {
    await runRedis(["SET", `couple:${coupleId}`, JSON.stringify(coupleData)]);
  } else {
    const db = await readLocalDb();
    db.couples[coupleId] = coupleData;
    await writeLocalDb(db);
  }
  return coupleData;
}

export async function getRubrics(coupleId, week) {
  if (isProdDb) {
    const result = await runRedis(["HGETALL", `rubric:${coupleId}:${week}`]);
    if (!result || result.length === 0) return {};
    
    // Upstash HGETALL returns a flat array of key/value pairs: ["A", "JSONString", "B", "JSONString"]
    const rubrics = {};
    for (let i = 0; i < result.length; i += 2) {
      const field = result[i];
      const value = result[i+1];
      rubrics[field] = JSON.parse(value);
    }
    return rubrics;
  } else {
    const db = await readLocalDb();
    const key = `${coupleId}:${week}`;
    return db.rubrics[key] || {};
  }
}

export async function saveRubric(coupleId, week, partner, data) {
  if (isProdDb) {
    await runRedis(["HSET", `rubric:${coupleId}:${week}`, partner, JSON.stringify(data)]);
    await runRedis(["SADD", `history:${coupleId}`, week]);
  } else {
    const db = await readLocalDb();
    const key = `${coupleId}:${week}`;
    if (!db.rubrics[key]) {
      db.rubrics[key] = {};
    }
    db.rubrics[key][partner] = data;
    await writeLocalDb(db);
  }
}

export async function getHistory(coupleId) {
  if (isProdDb) {
    const result = await runRedis(["SMEMBERS", `history:${coupleId}`]);
    return result || [];
  } else {
    const db = await readLocalDb();
    const prefix = `${coupleId}:`;
    const weeks = [];
    Object.keys(db.rubrics).forEach(key => {
      if (key.startsWith(prefix)) {
        const week = key.replace(prefix, "");
        weeks.push(week);
      }
    });
    return weeks;
  }
}

