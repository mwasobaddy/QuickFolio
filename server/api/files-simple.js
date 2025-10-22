const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());

async function getFiles(req, res) {
  try {
    const { id, folioId } = req.query;

    if (id) {
      const file = await prisma.file.findUnique({
        where: { id },
        include: { folio: true },
      });

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      return res.json({ data: file });
    }

    let where = {};
    if (folioId) {
      where.folioId = folioId;
    }

    const files = await prisma.file.findMany({
      where,
      include: { folio: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createFile(req, res) {
  try {
    const { name, description, createdBy, folioNumber } = req.body;

    if (!name || !createdBy || !folioNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the folio by item (folioNumber)
    const folio = await prisma.folio.findFirst({
      where: { item: folioNumber },
    });

    if (!folio) {
      return res.status(404).json({ error: 'Folio not found' });
    }

    const file = await prisma.file.create({
      data: {
        name,
        description,
        createdBy,
        folioId: folio.id,
      },
      include: { folio: true },
    });

    res.status(201).json({ data: file });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateFile(req, res) {
  try {
    const { id } = req.query;
    const { name, description, createdBy } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    const file = await prisma.file.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(createdBy && { createdBy }),
      },
      include: { folio: true },
    });

    res.json({ data: file });
  } catch (error) {
    console.error('Error updating file:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function deleteFile(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    await prisma.file.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting file:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return getFiles(req, res);
    case 'POST':
      return createFile(req, res);
    case 'PUT':
      if (!id) {
        return res.status(400).json({ error: 'File ID is required for updates' });
      }
      return updateFile(req, res);
    case 'DELETE':
      if (!id) {
        return res.status(400).json({ error: 'File ID is required for deletion' });
      }
      return deleteFile(req, res);
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

module.exports = handler;