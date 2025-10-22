import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import type { CreateFileInput, UpdateFileInput } from '../types/file';

const createFileSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.string().min(1),
});

const updateFileSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  createdBy: z.string().min(1).optional(),
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
        return await getFiles(req, res);
      case 'POST':
        return await createFile(req, res);
      case 'PUT':
        return await updateFile(req, res);
      case 'DELETE':
        return await deleteFile(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getFiles(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (id && typeof id === 'string') {
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        folios: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(200).json({ data: file });
  }

  const files = await prisma.file.findMany({
    include: {
      folios: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ data: files });
}

async function createFile(req: VercelRequest, res: VercelResponse) {
  const validation = createFileSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors,
    });
  }

  const parsed = validation.data;

  const data = {
    name: parsed.name,
    description: parsed.description,
    createdBy: parsed.createdBy,
  };

  const file = await prisma.file.create({
    data,
    include: {
      folios: {
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  return res.status(201).json({ data: file });
}

async function updateFile(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'File ID is required' });
  }

  const validation = updateFileSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors,
    });
  }

  const validatedData = validation.data;

  try {
    const file = await prisma.file.update({
      where: { id },
      data: validatedData,
      include: {
        folios: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    return res.status(200).json({ data: file });
  } catch (error) {
    return res.status(404).json({ error: 'File not found' });
  }
}

async function deleteFile(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    await prisma.file.delete({
      where: { id },
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({ error: 'File not found' });
  }
}