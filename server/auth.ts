
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'ashura-games-secret-key';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  level: number;
  experience: number;
  coins: number;
  achievements: string[];
  createdAt: Date;
  lastLogin: Date;
  isAdmin: boolean;
}

export interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  playTime: number;
  completedAt: Date;
}

class AuthStorage {
  private users: Map<string, User> = new Map();
  private scores: Map<string, GameScore> = new Map();
  private sessions: Map<string, string> = new Map(); // token -> userId

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // สร้างแอดมินเริ่มต้น
    const adminId = 'admin-001';
    const admin: User = {
      id: adminId,
      username: 'admin',
      email: 'admin@ashura.games',
      password: bcrypt.hashSync('admin123', 10),
      level: 99,
      experience: 999999,
      coins: 999999,
      achievements: ['admin_access', 'first_login', 'game_master'],
      createdAt: new Date(),
      lastLogin: new Date(),
      isAdmin: true
    };
    this.users.set(adminId, admin);
  }

  async register(username: string, email: string, password: string): Promise<User | null> {
    // ตรวจสอบว่ามีผู้ใช้นี้แล้วหรือยัง
    const existing = Array.from(this.users.values()).find(
      u => u.username === username || u.email === email
    );
    if (existing) return null;

    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser: User = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      level: 1,
      experience: 0,
      coins: 100, // เริ่มต้นด้วย 100 เหรียญ
      achievements: ['first_login'],
      createdAt: new Date(),
      lastLogin: new Date(),
      isAdmin: false
    };

    this.users.set(userId, newUser);
    return newUser;
  }

  async login(username: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = Array.from(this.users.values()).find(
      u => u.username === username || u.email === username
    );
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }

    // อัพเดตเวลาล็อกอินล่าสุด
    user.lastLogin = new Date();
    this.users.set(user.id, user);

    // สร้าง JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    this.sessions.set(token, user.id);

    // ส่งข้อมูลผู้ใช้โดยไม่รวมรหัสผ่าน
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = this.users.get(decoded.userId);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch {
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async addScore(userId: string, gameId: string, score: number, playTime: number): Promise<GameScore> {
    const scoreId = 'score_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const gameScore: GameScore = {
      id: scoreId,
      userId,
      gameId,
      score,
      playTime,
      completedAt: new Date()
    };

    this.scores.set(scoreId, gameScore);

    // เพิ่ม experience และ coins
    const user = this.users.get(userId);
    if (user) {
      user.experience += Math.floor(score / 10);
      user.coins += Math.floor(score / 100);
      
      // คำนวณเลเวล
      const newLevel = Math.floor(user.experience / 1000) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        user.coins += newLevel * 50; // โบนัสเลเวลอัพ
      }

      this.users.set(userId, user);
    }

    return gameScore;
  }

  async getUserScores(userId: string): Promise<GameScore[]> {
    return Array.from(this.scores.values()).filter(score => score.userId === userId);
  }

  async getLeaderboard(gameId?: string): Promise<Array<{ user: User; bestScore: number }>> {
    const userScores = new Map<string, number>();
    
    Array.from(this.scores.values()).forEach(score => {
      if (!gameId || score.gameId === gameId) {
        const currentBest = userScores.get(score.userId) || 0;
        if (score.score > currentBest) {
          userScores.set(score.userId, score.score);
        }
      }
    });

    const leaderboard = Array.from(userScores.entries())
      .map(([userId, bestScore]) => {
        const user = this.users.get(userId);
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword as User, bestScore };
      })
      .filter(entry => entry !== null)
      .sort((a, b) => b!.bestScore - a!.bestScore)
      .slice(0, 10);

    return leaderboard as Array<{ user: User; bestScore: number }>;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }
}

export const authStorage = new AuthStorage();

// Middleware สำหรับตรวจสอบการลงชื่อเข้าใช้
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'กรุณาลงชื่อเข้าใช้' });
  }

  const user = await authStorage.verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
  }

  (req as any).user = user;
  next();
};

// Middleware สำหรับตรวจสอบสิทธิ์แอดมิน
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'ต้องมีสิทธิ์แอดมิน' });
  }
  next();
};
