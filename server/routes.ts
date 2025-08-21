import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from 'express';
import { storage as gameStorage } from './storage';
import { Game } from '../shared/schema';
import { GameImageGenerator } from './gameImageGenerator';


// สร้างโฟลเดอร์สำหรับเก็บไฟล์เกม
const gamesUploadDir = path.join(process.cwd(), 'public', 'games');
if (!fs.existsSync(gamesUploadDir)) {
  fs.mkdirSync(gamesUploadDir, { recursive: true });
}

// ตั้งค่า multer สำหรับอัพโหลดไฟล์
const upload = multer({
  dest: gamesUploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.zip', '.html', '.js'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('ประเภทไฟล์ไม่ถูกต้อง'), false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {

  // เสิร์ฟไฟล์สแตติกสำหรับเกม
  app.use('/games', express.static(path.join(process.cwd(), 'public', 'games')));

  // Get all games
  app.get("/api/games", async (_req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get games by category
  app.get("/api/games/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const games = await storage.getGamesByCategory(category);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games by category" });
    }
  });

  // Get trending games
  app.get("/api/games/trending", async (_req, res) => {
    try {
      const games = await storage.getTrendingGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending games" });
    }
  });

  // Get new games
  app.get("/api/games/new", async (_req, res) => {
    try {
      const games = await storage.getNewGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new games" });
    }
  });

  // Search games
  app.get('/api/games/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }

      const results = gameStorage.searchGames(query);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Generate game thumbnail
  app.get('/api/games/:id/thumbnail', async (req: Request, res: Response) => {
    try {
      const gameId = parseInt(req.params.id);
      const game = gameStorage.getGameById(gameId);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Check if generated image already exists
      const imagePath = path.join(process.cwd(), 'public', 'generated-thumbnails', `${gameId}.png`);

      if (fs.existsSync(imagePath)) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
        return res.sendFile(imagePath);
      }

      // Generate new image
      await GameImageGenerator.ensureDirectoryExists(path.dirname(imagePath));

      const imageBuffer = await GameImageGenerator.generateGameImage({
        title: game.title,
        category: game.category,
        width: 800,
        height: 450
      });

      // Save generated image
      fs.writeFileSync(imagePath, imageBuffer);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(imageBuffer);
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      res.status(500).json({ error: 'Failed to generate thumbnail' });
    }
  });

  // Get single game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const game = await storage.getGameById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Increment game play count
  app.post("/api/games/:id/play", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementPlays(id);
      res.json({ message: "Play count incremented" });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment play count" });
    }
  });

  // Create new game (admin)
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.status(201).json(game);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Upload game file (admin)
  app.post("/api/games/upload", upload.single('gameFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "ไม่มีไฟล์ที่อัพโหลด" });
      }

      const originalName = req.file.originalname;
      const fileExtension = path.extname(originalName);
      const newFileName = `${req.file.filename}${fileExtension}`;
      const newFilePath = path.join(gamesUploadDir, newFileName);

      // เปลี่ยนชื่อไฟล์ให้มี extension
      fs.renameSync(req.file.path, newFilePath);

      const gameData = {
        title: req.body.title,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        gameUrl: `/games/${newFileName}`, // URL สำหรับเข้าถึงไฟล์
        gameFile: newFileName,
        isEmbedded: false,
        category: req.body.category,
        rating: parseInt(req.body.rating) || 40,
        isNew: req.body.isNew === 'true',
        isTrending: req.body.isTrending === 'true',
      };

      const validatedData = insertGameSchema.parse(gameData);
      const game = await storage.createGame(validatedData);

      res.status(201).json(game);
    } catch (error) {
      // ลบไฟล์ที่อัพโหลดถ้าเกิดข้อผิดพลาด
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('ไม่สามารถลบไฟล์ได้:', unlinkError);
        }
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "ข้อมูลเกมไม่ถูกต้อง", errors: error.errors });
      }
      res.status(500).json({ message: "ไม่สามารถอัพโหลดเกมได้" });
    }
  });

  // Update game (admin)
  app.put("/api/games/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const game = await storage.updateGame(id, updates);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to update game" });
    }
  });

  // Delete game (admin)
  app.delete("/api/games/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGame(id);
      if (!deleted) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json({ message: "Game deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}