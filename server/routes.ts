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
import { authStorage, authenticateToken, requireAdmin } from './auth';
import cookieParser from 'cookie-parser';


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
      cb(new Error('ประเภทไฟล์ไม่ถูกต้อง'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // เพิ่ม cookie parser
  app.use(cookieParser());

  // Auth Routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
      }

      const user = await authStorage.register(username, email, password);
      if (!user) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว' });
      }

      res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user });
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
      }

      const result = await authStorage.login(username, password);
      if (!result) {
        return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      }

      // ตั้งค่า cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 วัน
      });

      res.json({ message: 'เข้าสู่ระบบสำเร็จ', user: result.user, token: result.token });
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'ออกจากระบบสำเร็จ' });
  });

  app.get('/api/auth/profile', authenticateToken, async (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json(user);
  });

  app.put('/api/auth/profile', authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { username, email, avatar } = req.body;

      const updatedUser = await authStorage.updateUser(user.id, { username, email, avatar });
      if (!updatedUser) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดตข้อมูล' });
    }
  });

  // Score Routes
  app.post('/api/scores', authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { gameId, score, playTime } = req.body;

      const gameScore = await authStorage.addScore(user.id, gameId, score, playTime);
      res.status(201).json(gameScore);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกคะแนน' });
    }
  });

  app.get('/api/scores/my', authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const scores = await authStorage.getUserScores(user.id);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดคะแนน' });
    }
  });

  app.get('/api/leaderboard/:gameId?', async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const leaderboard = await authStorage.getLeaderboard(gameId);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดอันดับ' });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const users = await authStorage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดผู้ใช้' });
    }
  });

  // เสิร์ฟไฟล์สแตติกสำหรับเกม
  app.use('/games', express.static(path.join(process.cwd(), 'public', 'games'), {
    setHeaders: (res, filePath) => {
      // Cache game files for 1 hour
      res.setHeader('Cache-Control', 'public, max-age=3600');
      // Allow cross-origin requests for game assets
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      // Allow all iframe embedding
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', 'frame-ancestors *;');
    }
  }));

  // Enhanced game serving with optimization injection
  app.get('/games/:filename', (req: Request, res: Response) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), 'public', 'games', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Game not found' });
      }

      // If it's an HTML file, inject optimization script
      if (filename.endsWith('.html')) {
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        
        // Check if enhancements are already included
        if (!htmlContent.includes('game-optimization.js') && !htmlContent.includes('GameOptimization')) {
          // Inject enhancement CSS and scripts before closing head tag
          const enhancementInjection = `
    <!-- ASHURA Games Enhancement System -->
    <link rel="stylesheet" href="/games/game-enhancement.css">
    <script src="/games/game-optimization.js"></script>
    <script>
    // ASHURA Games Auto-Enhancement
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎮 ASHURA Games Auto-Enhancement Loading...');
        
        // Auto-focus canvas for better input handling
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.focus();
            canvas.addEventListener('click', () => canvas.focus());
            canvas.addEventListener('touchstart', () => canvas.focus(), { passive: true });
            
            // Enhanced mobile optimizations
            if (window.innerWidth < 768) {
                canvas.style.touchAction = 'manipulation';
                document.body.style.touchAction = 'manipulation';
                document.body.style.overflow = 'hidden';
                
                // Add viewport meta if missing
                if (!document.querySelector('meta[name="viewport"]')) {
                    const viewport = document.createElement('meta');
                    viewport.name = 'viewport';
                    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    document.head.appendChild(viewport);
                }
            }
        }
        
        // Add ASHURA branding if not present
        if (!document.querySelector('.credit') && !document.querySelector('[class*="ashura"]')) {
            const credit = document.createElement('div');
            credit.className = 'credit';
            credit.innerHTML = '© ASHURA Games';
            credit.style.position = 'fixed';
            credit.style.bottom = '10px';
            credit.style.right = '10px';
            credit.style.zIndex = '1000';
            document.body.appendChild(credit);
        }
        
        // Auto-enhance game titles
        const titles = document.querySelectorAll('h1, .title, .game-title');
        titles.forEach(title => {
            if (!title.textContent.includes('ASHURA')) {
                title.style.background = 'linear-gradient(135deg, #fff, #10b981)';
                title.style.webkitBackgroundClip = 'text';
                title.style.backgroundClip = 'text';
                title.style.webkitTextFillColor = 'transparent';
            }
        });
        
        console.log('✨ ASHURA Games Enhancement Complete!');
    });
    </script>
</head>`;
          
          htmlContent = htmlContent.replace('</head>', enhancementInjection);
        }
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', 'frame-ancestors *;');
        res.send(htmlContent);
      } else {
        // Serve other files normally
        res.sendFile(filePath);
      }
    } catch (error) {
      console.error('Error serving game:', error);
      res.status(500).json({ message: 'Failed to serve game' });
    }
  });

  // Get all games
  app.get("/api/games", async (_req, res) => {
    try {
      const games = await storage.getAllGames();
      console.log(`API /api/games returning ${games.length} games`);
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
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

      const results = await gameStorage.searchGames(query);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Generate game thumbnail
  app.get('/api/games/:id/thumbnail', async (req: Request, res: Response) => {
    try {
      const gameId = req.params.id;
      const game = await gameStorage.getGameById(gameId);

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