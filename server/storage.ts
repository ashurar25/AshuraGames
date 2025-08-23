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
        console.log(`Loaded game ${index + 1}: ${gameTitle} (${file})`);
      });
      
      console.log(`Successfully loaded ${this.games.size} games from public/games directory`);
    } catch (error) {
      console.error('Error loading games from directory:', error);
    }
  }

  private formatGameTitle(filename: string): string {
    const titleMap: {[key: string]: string} = {
      '3d-cube-runner': '3D Cube Runner',
      '3d-racing-webgl': '3D Racing WebGL',
      'particle-explosion': 'Particle Explosion',
      'space-invaders-3d': '3D Space Invaders',
      'neon-maze-3d': 'Neon Maze 3D',
      'cyber-runner-3d': 'Cyber Runner 3D',
      'galactic-defender-3d': 'Galactic Defender 3D',
      'crystal-caverns-3d': 'Crystal Caverns 3D',
      'neural-network-3d': 'Neural Network 3D',
      'volleyball-championship': 'Volleyball Championship',
      'ashura-volleyball-advanced': 'ASHURA Volleyball Advanced',
      'flappy-bird': 'Flappy Bird',
      'snake-enhanced': 'Snake Enhanced',
      'tetris-enhanced': 'Tetris Enhanced',
      'breakout-enhanced': 'Breakout Enhanced',
      'bubble-shooter': 'Bubble Shooter',
      'racing-rush': 'Racing Rush',
      'space-shooter': 'Space Shooter',
      'asteroid-shooter': 'Asteroid Shooter',
      'memory-cards': 'Memory Cards',
      'puzzle-blocks': 'Puzzle Blocks',
      'gulper-snake': 'Gulper Snake',
      'หนอนน้อย': 'หนอนน้อย',
      'neon-platformer-webgl': 'Neon Platformer WebGL',
      'quantum-shooter-webgl': 'Quantum Shooter WebGL',
      'cosmic-defender-webgl': 'Cosmic Defender WebGL',
      'space-mining-3d': 'Space Mining 3D',
      'ninja-runner-3d': 'Ninja Runner 3D',
      'tower-defense-3d': 'Tower Defense 3D',
      'portal-escape-3d': 'Portal Escape 3D',
      'dragon-flight-3d': 'Dragon Flight 3D',
      'basketball-shots-3d': 'Basketball Shots 3D',
      'chess-master-3d': 'Chess Master 3D',
      'medieval-kingdom': 'Medieval Kingdom',
      'cooking-master-3d': 'Cooking Master 3D',
      'fashion-designer-studio': 'Fashion Designer Studio',
      'pixel-art-creator': 'Pixel Art Creator',
      'dancing-beat-challenge': 'Dancing Beat Challenge',
      'endless-runner-3d': 'Endless Runner 3D',
      'neon-pong': 'Neon Pong',
      'pacman-adventure': 'Pacman Adventure',
      'soccer-penalty': 'Soccer Penalty',
      'snake-classic': 'Snake Classic',
      'tetris-rush': 'Tetris Rush',
      '2048': '2048'
    };
    
    return titleMap[filename] || filename.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private detectGameCategory(filename: string): string {
    const categoryMap: {[key: string]: string} = {
      '3d': 'action',
      'racing': 'racing', 
      'volleyball': 'sports',
      'basketball': 'sports',
      'soccer': 'sports',
      'snake': 'arcade',
      'tetris': 'puzzle',
      'bubble': 'puzzle',
      'shooter': 'action',
      'puzzle': 'puzzle',
      'adventure': 'adventure',
      'strategy': 'strategy',
      'casual': 'casual',
      'chess': 'strategy',
      'tower-defense': 'strategy',
      'cooking': 'casual',
      'fashion': 'casual',
      'pixel': 'casual',
      'dancing': 'casual',
      'pong': 'arcade',
      'pacman': 'arcade',
      'memory': 'puzzle',
      '2048': 'puzzle'
    };
    
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (filename.toLowerCase().includes(keyword)) {
        return category;
      }
    }
    
    return 'arcade'; // default category
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

  async createGame(gameData: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      id,
      ...gameData,
      createdAt: new Date(),
      updatedAt: new Date()
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
      id, // ensure ID doesn't change
      updatedAt: new Date()
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