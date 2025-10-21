import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}