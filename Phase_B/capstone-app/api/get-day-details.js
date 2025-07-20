import { connectToDatabase } from '../lib/mongodb';
import cors from '../lib/cors';

export default async function handler(req, res) {
  await new Promise((resolve, reject) =>
    cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve()))
  );

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const dateParam = req.query.date;
  if (!dateParam) {
    return res.status(400).json({ message: 'Missing date parameter' });
  }

  try {
    const db = await connectToDatabase();

    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('🔵 Requested date:', dateParam);
    console.log('🔵 startOfDay:', startOfDay.toISOString());
    console.log('🔵 endOfDay:', endOfDay.toISOString());

    const fetchCollection = async (collectionName) => {
      try {
        console.log(`🔍 Fetching from collection: ${collectionName}`);
        const results = await db.collection(collectionName).find({
          date: { $gte: startOfDay, $lte: endOfDay }
        }).toArray();
        console.log(`Found ${results.length} documents in ${collectionName}`);
        return results;
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error.message);
        return [];
      }
    };

    // שליפה מקבילה
    const [feelings, activities, nutritions, medicines, sleepwakes] = await Promise.all([
      fetchCollection('feelings'),
      fetchCollection('activities'),
      fetchCollection('nutritions'),
      fetchCollection('medicines'),
      fetchCollection('sleepwakes')
    ]);

    console.log('🎯 feelings:', JSON.stringify(feelings, null, 2));
    console.log('🎯 activities:', JSON.stringify(activities, null, 2));
    console.log('🎯 nutritions:', JSON.stringify(nutritions, null, 2));
    console.log('🎯 medicines:', JSON.stringify(medicines, null, 2));
    console.log('🎯 sleepwakes:', JSON.stringify(sleepwakes, null, 2));

    res.status(200).json({
      feelings,
      activities,
      nutritions,
      medicines,
      sleepwakes
    });

  } catch (error) {
    console.error('🚨 General Error in get-day-details:', error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      details: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
