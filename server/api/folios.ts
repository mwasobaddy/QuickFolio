import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import type { CreateFolioInput, UpdateFolioInput } from '../types/folio';

const createFolioSchema = z.object({
  item: z.string().min(1),
  runningNo: z.string().min(1),
  description: z.string().optional(),
  draftedBy: z.string().min(1),
  letterDate: z.string().datetime(), // ISO string
});

const updateFolioSchema = z.object({
  item: z.string().min(1).optional(),
  runningNo: z.string().min(1).optional(),
  description: z.string().optional(),
  draftedBy: z.string().min(1).optional(),
  letterDate: z.string().datetime().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    switch (req.method) {
      case 'GET':
        return await getFolios(req, res);
      case 'POST':
        return await createFolio(req, res);
      case 'PUT':
        return await updateFolio(req, res);
      case 'DELETE':
        return await deleteFolio(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getFolios(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (id && typeof id === 'string') {
    const folio = await prisma.folio.findUnique({
      where: { id },
    });

    if (!folio) {
      return res.status(404).json({ error: 'Folio not found' });
    }

    return res.status(200).json({ data: folio });
  }

  const folios = await prisma.folio.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ data: folios });
}

async function createFolio(req: VercelRequest, res: VercelResponse) {
  const validation = createFolioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors,
    });
  }
  
  // Build CreateFolioInput explicitly so TypeScript sees required fields
  const parsed = validation.data;
  const data: CreateFolioInput = {
    item: parsed.item,
    runningNo: parsed.runningNo,
    description: parsed.description,
    draftedBy: parsed.draftedBy,
    letterDate: new Date(parsed.letterDate),
  };

  const folio = await prisma.folio.create({
    data,
  });

  return res.status(201).json({ data: folio });
}

async function updateFolio(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Folio ID is required' });
  }

  const validation = updateFolioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors,
    });
  }

  const validatedData = validation.data;
  const data: UpdateFolioInput = {
    ...validatedData,
    letterDate: validatedData.letterDate ? new Date(validatedData.letterDate) : undefined,
  };

  try {
    const folio = await prisma.folio.update({
      where: { id },
      data,
    });

    return res.status(200).json({ data: folio });
  } catch (error) {
    return res.status(404).json({ error: 'Folio not found' });
  }
}

async function deleteFolio(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Folio ID is required' });
  }

  try {
    await prisma.folio.delete({
      where: { id },
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ error: 'Folio not found' });
  }
}