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
    // เกมที่สร้างขึ้นเองใน ASHURA Games - เล่นได้จริงทุกเกม
    const defaultGames: Omit<Game, 'id' | 'createdAt'>[] = [
  {
    title: 'Snake Game Classic',
    description: 'เกมงูคลาสสิกที่ทุกคนเคยเล่น กินจุดเติบโต หลีกเลี่ยงตัวเอง',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/snake.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 48,
    plays: 15250,
    isNew: false,
    isTrending: true,
  },
  {
    title: 'Tetris Rush',
    description: 'เกม Tetris คลาสสิกที่ไม่มีวันล้าสมัย จัดบล็อกให้เต็มแถว',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/tetris.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 50,
    plays: 12800,
    isNew: false,
    isTrending: true,
  },
  {
    title: 'Space Shooter',
    description: 'เกมยิงเอเลี่ยนในอวกาศสุดมันส์ กราฟิกสวยและเล่นลื่น',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
    gameUrl: '/games/space-shooter.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 47,
    plays: 8920,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Flappy Bird',
    description: 'เกมบินผ่านท่อที่ยากแต่เสพติด เกมที่ทำให้โลกกลับมาฮิตอีกครั้ง',
    thumbnail: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/flappy-bird.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 49,
    plays: 11350,
    isNew: true,
    isTrending: true,
  },
  {
    title: '2048',
    description: 'เกมปริศนาตัวเลขที่ทำให้ติดไม่หยุด รวมตัวเลขให้ได้ 2048',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/2048.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 46,
    plays: 9780,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Bubble Shooter',
    description: 'เกมยิงบอลสีเพื่อจับคู่สีเดียวกัน เล่นง่าย สนุก ผ่อนคลาย',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    gameUrl: '/games/bubble-shooter.html',
    gameFile: null,
    isEmbedded: false,
    category: 'casual',
    rating: 43,
    plays: 6540,
    isNew: false,
    isTrending: false,
  },
  {
    title: 'Racing Rush',
    description: 'เกมขับรถแข่งสุดเร้าใจ หลบหลีกการจราจร พุ่งไปให้ไกลที่สุด',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    gameUrl: '/games/racing-rush.html',
    gameFile: null,
    isEmbedded: false,
    category: 'racing',
    rating: 45,
    plays: 7210,
    isNew: false,
    isTrending: false,
  },
  {
    title: 'Memory Cards',
    description: 'เกมจับคู่การ์ดที่ฝึกความจำ เล่นง่าย เหมาะสำหรับทุกเพศทุกวัย',
    thumbnail: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop',
    gameUrl: '/games/memory-cards.html',
    gameFile: null,
    isEmbedded: false,
    category: 'casual',
    rating: 41,
    plays: 4890,
    isNew: false,
    isTrending: false,
  },
  {
    title: 'Puzzle Blocks',
    description: 'เกมปริศนาจิ๊กซอว์บล็อก วางชิ้นส่วนให้เข้าที่ ฝึกสมอง',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/puzzle-blocks.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 42,
    plays: 3650,
    isNew: false,
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
      gameFile: insertGame.gameFile || null,
      isEmbedded: insertGame.isEmbedded || false,
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