import { connectToDatabase } from '../lib/mongodb';
import cors from '../lib/cors';

export default async function handler(req, res) {
  await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();

    const feelings = await db.collection('feelings')
      .find({})
      .toArray();

    res.status(200).json({ 
      feelings: feelings,
      count: feelings.length
    });
  } catch (error) {
    console.error('Feelings retrieval error:', error);

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
