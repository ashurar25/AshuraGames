import { type Game, type InsertGame, GAME_CATEGORIES } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGameById(id: string): Promise<Game | undefined>;
  getGamesByCategory(category: string): Promise<Game[]>;
  getTrendingGames(): Promise<Game[]>;
  getNewGames(): Promise<Game[]>;
  searchGames(query: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;
  incrementPlays(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map();
    this.seedInitialData();
  }

  private seedInitialData() {
    // เริ่มต้นด้วยเกมเปล่า - แอดมินจะเพิ่มเกมได้เอง
    const defaultGames: Omit<Game, 'id' | 'createdAt'>[] = [
  {
    title: 'ยิงเอเลี่ยนในอวกาศ',
    description: 'เกมยิงเอเลี่ยนในอวกาศสุดมันส์ กราฟิกสวยและเล่นลื่น',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
    gameUrl: '/games/space-shooter.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 45,
    plays: 1250,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'จิ๊กซอว์บล็อก',
    description: 'เกมปริศนาแบบคลาสสิกที่จะท้าทายสมองคุณ',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    gameUrl: '/games/puzzle-blocks.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 42,
    plays: 980,
    isNew: false,
    isTrending: true,
  },
  {
    title: 'แข่งรถซิ่ง',
    description: 'เกมแข่งรถความเร็วสูงพร้อมสนามหลายแห่ง',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    gameUrl: '/games/racing-rush.html',
    gameFile: null,
    isEmbedded: false,
    category: 'racing',
    rating: 48,
    plays: 1420,
    isNew: true,
    isTrending: false,
  },
  {
    title: 'ยิงลูกบอลสี',
    description: 'เกมยิงลูกบอลสีที่เล่นติดใจ กราฟิกสีสันสวยงาม',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    gameUrl: '/games/bubble-shooter.html',
    gameFile: null,
    isEmbedded: false,
    category: 'casual',
    rating: 40,
    plays: 750,
    isNew: false,
    isTrending: false,
  },
  {
    title: 'งูกินผลไม้ คลาสสิก',
    description: 'เกมงูกินผลไม้แบบคลาสสิกที่ทุกคนรู้จัก เล่นง่าย สนุกได้ทุกวัย',
    thumbnail: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=400&h=300&fit=crop',
    gameUrl: '/games/snake-classic.html',
    gameFile: null,
    isEmbedded: false,
    category: 'arcade',
    rating: 44,
    plays: 1850,
    isNew: false,
    isTrending: true,
  },
  {
    title: 'Tetris Rush',
    description: 'เกม Tetris แบบมันส์ๆ ท้าทายความเร็วและไหวพริบ',
    thumbnail: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&h=300&fit=crop',
    gameUrl: '/games/tetris-rush.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 47,
    plays: 2100,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'จับคู่การ์ด',
    description: 'เกมจับคู่การ์ดที่ฝึกความจำ เล่นง่าย เหมาะสำหรับทุกเพศทุกวัย',
    thumbnail: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop',
    gameUrl: '/games/memory-cards.html',
    gameFile: null,
    isEmbedded: false,
    category: 'casual',
    rating: 41,
    plays: 890,
    isNew: true,
    isTrending: false,
  },
];

    defaultGames.forEach(gameData => {
      const id = randomUUID();
      const game: Game = {
        ...gameData,
        id,
        createdAt: new Date()
      };
      this.games.set(id, game);
    });
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => b.plays - a.plays);
  }

  async getGameById(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.category === category)
      .sort((a, b) => b.plays - a.plays);
  }

  async getTrendingGames(): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.isTrending)
      .sort((a, b) => b.plays - a.plays);
  }

  async getNewGames(): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.isNew)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchGames(query: string): Promise<Game[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.games.values())
      .filter(game => 
        game.title.toLowerCase().includes(lowercaseQuery) ||
        game.description.toLowerCase().includes(lowercaseQuery) ||
        game.category.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => b.plays - a.plays);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      id,
      plays: 0,
      createdAt: new Date(),
      ...insertGame,
      rating: insertGame.rating || 40,
      isNew: insertGame.isNew || false,
      isTrending: insertGame.isTrending || false
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const existing = this.games.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.games.set(id, updated);
    return updated;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async incrementPlays(id: string): Promise<void> {
    const game = this.games.get(id);
    if (game) {
      game.plays += 1;
      this.games.set(id, game);
    }
  }
}

export const storage = new MemStorage();