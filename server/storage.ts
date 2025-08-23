import { type Game, type InsertGame, GAME_CATEGORIES } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

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
    this.loadGamesFromDirectory();
  }

  private loadGamesFromDirectory() {
    const gamesDir = path.join(process.cwd(), 'public', 'games');
    
    try {
      if (!fs.existsSync(gamesDir)) {
        console.log('Games directory does not exist, creating it...');
        fs.mkdirSync(gamesDir, { recursive: true });
        return;
      }

      const gameFiles = fs.readdirSync(gamesDir).filter((file: string) => {
        return file.endsWith('.html') || file.endsWith('.htm');
      });
      
      console.log(`Found ${gameFiles.length} game files in ${gamesDir}`);
      
      gameFiles.forEach((file: string, index: number) => {
        const gameName = file.replace(/\.(html|htm)$/, '');
        const gameTitle = this.formatGameTitle(gameName);
        const category = this.detectGameCategory(gameName);
        
        const id = randomUUID();
        const game: Game = {
          id,
          title: gameTitle,
          description: `เล่นเกม ${gameTitle} - เกมสุดมันส์บนเว็บไซต์ ASHURA Games`,
          thumbnail: `/api/games/${id}/thumbnail`,
          gameUrl: `/games/${file}`,
          gameFile: null,
          isEmbedded: false,
          category,
          rating: Math.floor(Math.random() * 10) + 40, // 40-50
          plays: Math.floor(Math.random() * 20000) + 1000, // 1000-21000
          isNew: Math.random() > 0.7,
          isTrending: Math.random() > 0.6,
          createdAt: new Date()
        };
        
        this.games.set(id, game);
        console.log(`Loaded game ${index + 1}: ${gameTitle} (${file}) - Category: ${category}`);
      });
      
      // แสดงสถิติหมวดหมู่
      const categoryStats: {[key: string]: number} = {};
      this.games.forEach(game => {
        categoryStats[game.category] = (categoryStats[game.category] || 0) + 1;
      });
      
      console.log('Category distribution:');
      Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} games`);
      });
      
      console.log(`Successfully loaded ${this.games.size} games from public/games directory`);
    } catch (error) {
      console.error('Error loading games from directory:', error);
    }
  }

  private formatGameTitle(filename: string): string {
    const titleMap: {[key: string]: string} = {
      '3d-cube-runner': 'นักวิ่งก้อนลูกบาศก์ 3D',
      '3d-racing-webgl': 'แข่งรถสุดเร็ว 3D',
      'particle-explosion': 'ระเบิดอนุภาค',
      'space-invaders-3d': 'ผู้รุกรานจากอวกาศ 3D',
      'neon-maze-3d': 'เขาวงกตนีออน 3D',
      'cyber-runner-3d': 'นักวิ่งไซเบอร์ 3D',
      'galactic-defender-3d': 'ผู้พิทักษ์กาแล็กซี่ 3D',
      'crystal-caverns-3d': 'ถ้ำคริสตัล 3D',
      'neural-network-3d': 'โครงข่ายประสาท 3D',
      'volleyball-championship': 'แชมป์วอลเลย์บอล',
      'ashura-volleyball-advanced': 'อาสุรวอลเลย์บอลขั้นสูง',
      'flappy-bird': 'นกบินได้',
      'snake-enhanced': 'งูกินหางพิเศษ',
      'tetris-enhanced': 'เททริสสุดพิเศษ',
      'breakout-enhanced': 'ทำลายบล็อคสุดมันส์',
      'bubble-shooter': 'ยิงฟองสบู่',
      'racing-rush': 'วิ่งแข่งรถเร็ว',
      'space-shooter': 'ยิงปืนอวกาศ',
      'asteroid-shooter': 'ยิงดาวเคราะห์น้อย',
      'memory-cards': 'เกมจำคารด์',
      'puzzle-blocks': 'จิ๊กซอว์บล็อค',
      'gulper-snake': 'งูกลืนของ',
      'หนอนน้อย': 'หนอนน้อย',
      'neon-platformer-webgl': 'กระโดดนีออน WebGL',
      'quantum-shooter-webgl': 'ยิงปืนควอนตัม WebGL',
      'cosmic-defender-webgl': 'ผู้พิทักษ์จักรวาล WebGL',
      'space-mining-3d': 'ขุดแร่อวกาศ 3D',
      'ninja-runner-3d': 'นินจาวิ่ง 3D',
      'tower-defense-3d': 'ป้องกันหอคอย 3D',
      'portal-escape-3d': 'หนีประตูมิติ 3D',
      'dragon-flight-3d': 'มังกรบิน 3D',
      'basketball-shots-3d': 'ยิงบาสเก็ตบอล 3D',
      'chess-master-3d': 'ปรมาจารย์หมากรุก 3D',
      'medieval-kingdom': 'อาณาจักรยุคกลาง',
      'cooking-master-3d': 'เชฟปรมาจารย์ 3D',
      'fashion-designer-studio': 'สตูดิโอนักออกแบบแฟชั่น',
      'pixel-art-creator': 'สร้างพิกเซลอาร์ต',
      'dancing-beat-challenge': 'ท้าทายเต้นรำ',
      'endless-runner-3d': 'วิ่งไม่รู้จบ 3D',
      'neon-pong': 'ปองนีออน',
      'pacman-adventure': 'ผจญภัยแพคแมน',
      'soccer-penalty': 'เตะจุดโทษฟุตบอล',
      'snake-classic': 'งูคลาสสิค',
      'tetris-rush': 'เททริสเร่งด่วน',
      '2048': '2048'
    };
    
    return titleMap[filename] || filename.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private detectGameCategory(filename: string): string {
    const categoryMap: {[key: string]: string} = {
      // Action games
      '3d': 'action',
      'shooter': 'action',
      'defender': 'action',
      'runner': 'action',
      'cube': 'action',
      'space': 'action',
      'galactic': 'action',
      'cyber': 'action',
      'ninja': 'action',
      'crystal': 'action',
      'neural': 'action',
      'quantum': 'action',
      'cosmic': 'action',
      'asteroid': 'action',
      'particle': 'action',
      'dragon': 'action',
      
      // Racing games
      'racing': 'racing',
      'rush': 'racing',
      
      // Sports games
      'volleyball': 'sports',
      'basketball': 'sports',
      'soccer': 'sports',
      'penalty': 'sports',
      'shots': 'sports',
      
      // Arcade games
      'snake': 'arcade',
      'pong': 'arcade',
      'pacman': 'arcade',
      'flappy': 'arcade',
      'breakout': 'arcade',
      'neon': 'arcade',
      'endless': 'arcade',
      'gulper': 'arcade',
      'หนอน': 'arcade',
      
      // Puzzle games
      'tetris': 'puzzle',
      'bubble': 'puzzle',
      'puzzle': 'puzzle',
      'memory': 'puzzle',
      '2048': 'puzzle',
      'blocks': 'puzzle',
      
      // Strategy games
      'chess': 'strategy',
      'tower-defense': 'strategy',
      'kingdom': 'strategy',
      'medieval': 'strategy',
      
      // Casual games
      'cooking': 'casual',
      'fashion': 'casual',
      'pixel': 'casual',
      'dancing': 'casual',
      'designer': 'casual',
      'creator': 'casual',
      'beat': 'casual',
      
      // Adventure games
      'adventure': 'adventure',
      'escape': 'adventure',
      'portal': 'adventure',
      'maze': 'adventure',
      'caverns': 'adventure',
      'mining': 'adventure',
      'flight': 'adventure'
    };
    
    const lowerFilename = filename.toLowerCase();
    
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowerFilename.includes(keyword)) {
        return category;
      }
    }
    
    return 'arcade'; // default category
  }

  async getAllGames(): Promise<Game[]> {
    const games = Array.from(this.games.values()).sort((a, b) => b.plays - a.plays);
    console.log(`getAllGames() returning ${games.length} games`);
    return games;
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

  async createGame(gameData: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      id,
      ...gameData,
      createdAt: new Date()
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const existingGame = this.games.get(id);
    if (!existingGame) return undefined;

    const updatedGame: Game = {
      ...existingGame,
      ...updates,
      id // ensure ID doesn't change
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async incrementPlays(id: string): Promise<void> {
    const game = this.games.get(id);
    if (game) {
      game.plays = (game.plays || 0) + 1;
      this.games.set(id, game);
    }
  }
}

export const storage = new MemStorage();