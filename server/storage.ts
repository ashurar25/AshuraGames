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
    // HTML5 Games ที่ทำงานใน iframe ได้จริง
    const initialGames: Omit<Game, 'id' | 'createdAt'>[] = [
      // ACTION GAMES - เกมที่ทำงานได้จริงใน iframe
      {
        title: "Crossy Road",
        description: "ช่วยไก่ข้ามถนนและแม่น้ำในเกม arcade สุดฮิต",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/crossy-road/",
        category: "action",
        plays: 5200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Flappy Bird",
        description: "เกมบินที่ท้าทายที่สุด บินผ่านท่อได้ไกลแค่ไหน",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/flappy-bird/",
        category: "action",
        plays: 4800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Stack Ball",
        description: "ทำลายแท่งสีและลงไปให้ถึงจุดหมาย",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/stack-ball/",
        category: "action",
        plays: 3400000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Knife Hit",
        description: "ขว้างมีดโดนเป้าหมายให้ได้มากที่สุด",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/knife-hit/",
        category: "action",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Color Switch",
        description: "เปลี่ยนสีและผ่านกำแพงสีเดียวกันเท่านั้น",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/color-switch/",
        category: "action",
        plays: 1900000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Geometry Dash",
        description: "กระโดดผ่านอุปสรรคตามจังหวะดนตรี",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/geometry-dash/",
        category: "action",
        plays: 1700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },

      // PUZZLE GAMES - เกมปริศนา
      {
        title: "2048",
        description: "รวมตัวเลขให้ได้ 2048 ในเกมปริศนาสุดฮิต",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/2048/",
        category: "puzzle",
        plays: 6500000,
        rating: 50,
        isNew: false,
        isTrending: true
      },
      {
        title: "Sudoku",
        description: "เกมปริศนาตัวเลขคลาสสิกที่ท้าทายสมอง",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/sudoku/",
        category: "puzzle",
        plays: 4200000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Bubble Shooter",
        description: "ยิงลูกบอลสีเดียวกันให้หาย 3 ลูกขึ้นไป",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/bubble-shooter/",
        category: "puzzle",
        plays: 3800000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Tetris",
        description: "เกมต่อบล็อกคลาสสิกที่ทุกคนรัก",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/tetris/",
        category: "puzzle",
        plays: 5100000,
        rating: 49,
        isNew: false,
        isTrending: false
      },
      {
        title: "Block Puzzle",
        description: "วางชิ้นส่วนให้เต็มแถวหรือคอลัมน์",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/block-puzzle/",
        category: "puzzle",
        plays: 2900000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Match 3",
        description: "จับคู่ 3 อันเหมือนกันให้หายไป",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/match-3/",
        category: "puzzle",
        plays: 2300000,
        rating: 44,
        isNew: false,
        isTrending: false
      },

      // RACING GAMES - เกมแข่งรถ
      {
        title: "Highway Racer",
        description: "ขับรถบนทางหลวงและหลบรถคันอื่น",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/highway-racer/",
        category: "racing",
        plays: 4600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Bike Race",
        description: "แข่งรถมอเตอร์ไซค์บนเส้นทางที่ท้าทาย",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/bike-race/",
        category: "racing",
        plays: 3900000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Car Racing",
        description: "แข่งรถยนต์กับคู่แข่งที่แกร่ง",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/car-racing/",
        category: "racing",
        plays: 3200000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Hill Climb",
        description: "ขับรถขึ้นเขาและควบคุมความสมดุล",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/hill-climb/",
        category: "racing",
        plays: 2700000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Traffic Run",
        description: "ขับรถข้ามถนนที่มีรถมากมาย",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/traffic-run/",
        category: "racing",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // MULTIPLAYER GAMES - เกมผู้เล่นหลายคน
      {
        title: "Snake Battle",
        description: "เล่นเกมงูแบบออนไลน์กับผู้เล่นทั่วโลก",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/snake-battle/",
        category: "multiplayer",
        plays: 7200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Tank Battle",
        description: "รบกันด้วยรถถังในสนามรบออนไลน์",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/tank-battle/",
        category: "multiplayer",
        plays: 5800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Battle Royale",
        description: "สู้เพื่อความอยู่รอดในเกม Battle Royale",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/battle-royale/",
        category: "multiplayer",
        plays: 8900000,
        rating: 50,
        isNew: false,
        isTrending: false
      },
      {
        title: "Team Fight",
        description: "สู้เป็นทีมกับผู้เล่นอื่นๆ ออนไลน์",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/team-fight/",
        category: "multiplayer",
        plays: 4300000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Space War",
        description: "สงครามในอวกาศแบบผู้เล่นหลายคน",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/space-war/",
        category: "multiplayer",
        plays: 3700000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // .IO GAMES - เกม .IO
      {
        title: "Snake.io",
        description: "เกมงูคลาสสิกแบบออนไลน์",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/snake-io/",
        category: "io",
        plays: 9200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Circle.io",
        description: "กินเซลล์เล็กและหลีกเลี่ยงเซลล์ใหญ่",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/circle-io/",
        category: "io",
        plays: 8600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Territory.io",
        description: "ยึดดินแดนและหลีกเลี่ยงผู้เล่นอื่น",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/territory-io/",
        category: "io",
        plays: 6400000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Hole.io",
        description: "กลายเป็นหลุมดำและกินทุกอย่างในเส้นทาง",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/hole-io/",
        category: "io",
        plays: 5200000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Worms.io",
        description: "เกมหนอนแบบ multiplayer ที่สนุกสุดๆ",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/worms-io/",
        category: "io",
        plays: 3800000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Wings.io",
        description: "บินและต่อสู้กับเครื่องบินอื่นๆ ในอากาศ",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/wings-io/",
        category: "io",
        plays: 7100000,
        rating: 48,
        isNew: false,
        isTrending: false
      },

      // STRATEGY GAMES - เกมกลยุทธ์
      {
        title: "Tower Defense",
        description: "วางหอคอยเพื่อป้องกันศัตรู",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/tower-defense/",
        category: "strategy",
        plays: 4900000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Chess",
        description: "เล่นหมากรุกกับปัญญาประดิษฐ์หรือผู้เล่นอื่น",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/chess/",
        category: "strategy",
        plays: 6700000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Defense War",
        description: "ป้องกันฐานของคุณจากการโจมตีของศัตรู",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/defense-war/",
        category: "strategy",
        plays: 3600000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Army Battle",
        description: "สร้างกองทัพและพิชิตดินแดน",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/army-battle/",
        category: "strategy",
        plays: 2800000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Castle Defense",
        description: "ป้องกันปราสาทจากการรุกรานของศัตรู",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/castle-defense/",
        category: "strategy",
        plays: 5400000,
        rating: 48,
        isNew: false,
        isTrending: false
      },
      {
        title: "War Strategy",
        description: "วางแผนกลยุทธ์และนำทัพไปสู่ชัยชนะ",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/war-strategy/",
        category: "strategy",
        plays: 2100000,
        rating: 45,
        isNew: false,
        isTrending: false
      },

      // เพิ่มเกมอื่นๆ อีก
      {
        title: "Fruit Ninja",
        description: "หั่นผลไม้และหลีกเลี่ยงระเบิด",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/fruit-ninja/",
        category: "action",
        plays: 4100000,
        rating: 48,
        isNew: true,
        isTrending: false
      },
      {
        title: "Paper Plane",
        description: "บินเครื่องบินกระดาษให้ไปให้ไกลที่สุด",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/paper-plane/",
        category: "action",
        plays: 3300000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Word Game",
        description: "หาคำศัพท์ในเกมคำศัพท์ที่ท้าทาย",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/word-game/",
        category: "puzzle",
        plays: 4700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Jump Ball",
        description: "กระโดดบอลขึ้นไปให้สูงที่สุด",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.gameflare.com/embed/jump-ball/",
        category: "action",
        plays: 3900000,
        rating: 46,
        isNew: true,
        isTrending: false
      }
    ];

    initialGames.forEach(gameData => {
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
