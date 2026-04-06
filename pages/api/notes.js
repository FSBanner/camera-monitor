import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  const { cameraId, noteId } = req.query;

  try {
    if (method === 'GET') {
      // Get all notes for a camera
      const notes = await prisma.cameraNote.findMany({
        where: {
          cameraId: parseInt(cameraId),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(notes);
    }

    if (method === 'POST') {
      // Create a new note
      const { text, timestamp } = req.body;

      const note = await prisma.cameraNote.create({
        data: {
          cameraId: parseInt(cameraId),
          text,
          timestamp,
        },
      });

      return res.status(201).json(note);
    }

    if (method === 'DELETE') {
      // Delete a note
      await prisma.cameraNote.delete({
        where: {
          id: parseInt(noteId),
        },
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
