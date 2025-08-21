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
    title: '3D Cube Runner',
    description: 'เกมวิ่งหลบสิ่งกีดขวางแบบ 3D ด้วย WebGL กราฟิกสุดล้ำ วิ่งไปข้างหน้าและหลบอุปสรรค',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/3d-cube-runner.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 18750,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Particle Explosion WebGL',
    description: 'เกมอนุภาคระเบิดสุดมันส์ด้วย WebGL เอฟเฟกต์สวยงาม คลิกเพื่อสร้างการระเบิดสีสัน',
    thumbnail: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/particle-explosion.html',
    gameFile: null,
    isEmbedded: false,
    category: 'arcade',
    rating: 49,
    plays: 12450,
    isNew: true,
    isTrending: true,
  },
  {
    title: '3D Racing WebGL',
    description: 'เกมแข่งรถ 3D สุดเร้าใจ ขับรถหลบคู่แข่ง ใช้บูสเตอร์ และแซงหน้าเพื่อคะแนนสูง',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/3d-racing-webgl.html',
    gameFile: null,
    isEmbedded: false,
    category: 'racing',
    rating: 50,
    plays: 21300,
    isNew: true,
    isTrending: true,
  },
  {
    title: '3D Space Invaders',
    description: 'เกมยิงอวกาศ 3D สุดมันส์ ยิงยานมนุษย์ต่างดาว เก็บพาวเวอร์อัพ และปกป้องโลก',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/space-invaders-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 16800,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Neon Maze 3D',
    description: 'เขาวงกต 3D สุดล้ำ เดินทางผ่านเขาวงกตนีออน เก็บของสะสม และหาทางออก',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/neon-maze-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 50,
    plays: 14200,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Neon Platformer WebGL',
    description: 'เกมกระโดดข้ามแพลตฟอร์ม WebGL สุดสวย นีออนเอฟเฟกต์ เก็บเพชร หลีกเลี่ยงศัตรู',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/neon-platformer-webgl.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 18900,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Cyber Runner 3D',
    description: 'วิ่งผ่านเมืองไซเบอร์ 3D หลีกเลี่ยงสิ่งกีดขวาง เปลี่ยนเลน และสะสมคะแนนสูง',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/cyber-runner-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 22400,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Quantum Shooter WebGL',
    description: 'เกมยิงควอนตัม WebGL ด้วยเอฟเฟกต์พิเศษ พาวเวอร์อัพ และศัตรูหลากหลาย',
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/quantum-shooter-webgl.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 19600,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Galactic Defender 3D',
    description: 'เกมปกป้องกาแล็กซี่ 3D สุดอลังการ อาวุธหลากหลาย ศัตรูมากมาย และเอฟเฟกต์สุดตระการตา',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/galactic-defender-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 25800,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Crystal Caverns 3D',
    description: 'สำรวจถ้ำคริสตัล 3D มหัศจรรย์ เก็บอัญมณี หลีกเลี่ยงอันตราย และเปิดเส้นทางลับ',
    thumbnail: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/crystal-caverns-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'adventure',
    rating: 50,
    plays: 18900,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Neural Network 3D',
    description: 'เกมเครือข่ายประสาทเทียม 3D เชื่อมต่อโหนด ประมวลผลข้อมูล และต่อสู้กับไวรัส',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/neural-network-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 50,
    plays: 21300,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Neon Maze 3D',
    description: 'เขาวงกตนีออน 3D แบบ First-Person ใช้เทคนิค Ray Casting หาเป้าหมายในเขาวงกต',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/neon-maze-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'adventure',
    rating: 50,
    plays: 16800,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Space Mining 3D',
    description: 'เกมขุดแร่ในอวกาศ 3D ใช้เครื่องมือเจาะ เก็บแร่ธาตุ หลีกเลี่ยงอุกกาบาต',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/space-mining-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 14200,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Cosmic Defender WebGL',
    description: 'เกมปกป้องจักรวาล WebGL มีระบบโล่พลังงาน อาวุธอัพเกรด และศัตรูหลากหลาย',
    thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/cosmic-defender-webgl.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 19700,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Snake Enhanced Pro',
    description: 'เกมงูสุดพิเศษ มีระบบเลเวล อาหารพิเศษ อนุภาคสวยงาม และเอฟเฟกต์ตัวเก่าด้วยกราฟิกแบบไล่สี',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/snake-enhanced.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 22150,
    isNew: true,
    isTrending: true,
  },
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
    title: 'Tetris Enhanced Pro',
    description: 'เกม Tetris สุดพิเศษ เอฟเฟกต์อนุภาค กราฟิกไล่สี ระบบเลเวลใหม่ และการแสดงผลที่สวยงาม',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/tetris-enhanced.html',
    gameFile: null,
    isEmbedded: false,
    category: 'puzzle',
    rating: 50,
    plays: 19650,
    isNew: true,
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
  {
    title: 'Tower Defense 3D',
    description: 'เกมป้องกันหอคอย 3D ที่มีศัตรูหลายประเภท อาวุธอัพเกรดได้ และกลยุทธ์สุดล้ำ',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/tower-defense-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'strategy',
    rating: 49,
    plays: 12400,
    isNew: true,
    isTrending: false,
  },
  {
    title: 'Portal Escape 3D',
    description: 'เกมหลบหนี 3D ผ่านพอร์ทัลมหัศจรรย์ เก็บอัญมณี หลีกเลี่ยงกับดัก และพิชิตด่าน',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/portal-escape-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'adventure',
    rating: 50,
    plays: 8900,
    isNew: true,
    isTrending: true,
  },
  {
    title: 'Dragon Flight 3D',
    description: 'เกมบินมังกร 3D สุดมันส์ พ่นไฟ เก็บอัญมณี บินผ่านภูเขาและเมฆ',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450',
    gameUrl: '/games/dragon-flight-3d.html',
    gameFile: null,
    isEmbedded: false,
    category: 'action',
    rating: 50,
    plays: 15600,
    isNew: true,
    isTrending: true,
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