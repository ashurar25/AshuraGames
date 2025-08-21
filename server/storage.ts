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
    // Seed with HTML5 games that support iframe embedding
    const initialGames: Omit<Game, 'id' | 'createdAt'>[] = [
      // ACTION GAMES - Using games that work in iframes
      {
        title: "Rocket League",
        description: "Soccer meets racing in this high-octane multiplayer game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/soccer-skills-euro-cup",
        category: "action",
        plays: 5200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Subway Surfers",
        description: "Run through subway tunnels and avoid the grumpy inspector in this endless runner",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/subway-surfers",
        category: "action",
        plays: 4800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Temple Run 2",
        description: "Navigate perilous cliffs, zip lines, mines in this endless running adventure",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/temple-run-2",
        category: "action",
        plays: 3400000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Stickman Fighter",
        description: "Epic stickman combat with incredible fighting moves and combos",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/stickman-fighter-epic-battle",
        category: "action",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Ninja Warrior",
        description: "Become a legendary ninja with stealth skills and combat mastery",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/ninja-hands",
        category: "action",
        plays: 1900000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Zombie Shooter",
        description: "Survive the zombie apocalypse with powerful weapons and strategy",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/zombs-royale-io",
        category: "action",
        plays: 1700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },

      // PUZZLE GAMES
      {
        title: "Block Puzzle Jewel",
        description: "Fit colorful blocks into the grid to clear lines in this addictive puzzle",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/block-puzzle-jewel",
        category: "puzzle",
        plays: 6500000,
        rating: 50,
        isNew: false,
        isTrending: true
      },
      {
        title: "Match 3 Forest",
        description: "Match magical forest creatures in this enchanting puzzle adventure",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/forest-match",
        category: "puzzle",
        plays: 4200000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Bubble Shooter Classic",
        description: "Pop colorful bubbles by matching three or more of the same color",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/bubble-shooter",
        category: "puzzle",
        plays: 3800000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Word Search",
        description: "Find hidden words in this relaxing and brain-training puzzle game",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/word-search",
        category: "puzzle",
        plays: 5100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Jigsaw Puzzles",
        description: "Complete beautiful jigsaw puzzles with various difficulty levels",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/jigsaw-puzzles",
        category: "puzzle",
        plays: 2900000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Solitaire Classic",
        description: "The timeless card game that everyone loves to play",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/solitaire",
        category: "puzzle",
        plays: 2300000,
        rating: 44,
        isNew: false,
        isTrending: false
      },

      // RACING GAMES
      {
        title: "Drift Boss",
        description: "Master the art of drifting on challenging cliff-side roads",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/drift-boss",
        category: "racing",
        plays: 4600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Moto X3M Spooky Land",
        description: "Extreme motorcycle stunts through spooky Halloween-themed levels",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/moto-x3m-spooky-land",
        category: "racing",
        plays: 3900000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Traffic Racer",
        description: "Drive through endless highway traffic and avoid crashes",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/traffic-racer",
        category: "racing",
        plays: 3200000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Hill Racing Challenge",
        description: "Conquer steep hills and mountains with various vehicles",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/hill-racing-challenge",
        category: "racing",
        plays: 2700000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Speed Racing Pro",
        description: "High-speed racing with amazing supercars on professional tracks",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/speed-racing-pro-2",
        category: "racing",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // MULTIPLAYER GAMES
      {
        title: "Shell Shockers",
        description: "Multiplayer first-person shooter where you fight as an armed egg",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/shell-shockers",
        category: "multiplayer",
        plays: 7200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Stumble Guys",
        description: "Massively multiplayer party knockout game with obstacle courses",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/stumble-guys",
        category: "multiplayer",
        plays: 5800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Krunker.io",
        description: "Fast-paced pixelated first-person shooter with multiple game modes",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/krunker-io",
        category: "multiplayer",
        plays: 8900000,
        rating: 50,
        isNew: false,
        isTrending: false
      },
      {
        title: "Buildz.io",
        description: "Build and battle in this multiplayer building and shooting game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/1v1-lol",
        category: "multiplayer",
        plays: 4300000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Skribbl.io",
        description: "Online drawing and guessing game with friends and players worldwide",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/skribbl-io",
        category: "multiplayer",
        plays: 3700000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // .IO GAMES
      {
        title: "Slither.io",
        description: "Grow your snake by eating pellets while avoiding other players",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/slither-io",
        category: "io",
        plays: 9200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Agar.io",
        description: "Eat smaller cells and avoid bigger ones in this simple but addictive game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/agar-io",
        category: "io",
        plays: 8600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Paper.io 2",
        description: "Capture territory and avoid other players in this strategic io game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/paper-io-2",
        category: "io",
        plays: 6400000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Hole.io",
        description: "Swallow everything in your path as a black hole competing with others",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/hole-io",
        category: "io",
        plays: 5200000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Wormax.io",
        description: "Snake-like multiplayer game with power-ups and special abilities",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/wormax-io",
        category: "io",
        plays: 3800000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Wings.io",
        description: "Fly and battle other planes in this aerial combat io game",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/wings-io",
        category: "io",
        plays: 7100000,
        rating: 48,
        isNew: false,
        isTrending: false
      },

      // STRATEGY GAMES
      {
        title: "Tower Defense Kingdom",
        description: "Build towers and defend your kingdom from waves of enemies",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/kingdom-rush",
        category: "strategy",
        plays: 4900000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Chess Master",
        description: "Play chess against AI or challenge other players online",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/chess",
        category: "strategy",
        plays: 6700000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Age of War",
        description: "Evolve your civilization through different ages while defending your base",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/age-of-war",
        category: "strategy",
        plays: 3600000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Bloons TD 6",
        description: "Pop balloons with strategic monkey tower placement",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/bloons-tower-defense",
        category: "strategy",
        plays: 2800000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Stick War Legacy",
        description: "Command your army of stick figures in epic strategy battles",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/stick-war-legacy",
        category: "strategy",
        plays: 5400000,
        rating: 48,
        isNew: false,
        isTrending: false
      },
      {
        title: "Empire Builder",
        description: "Build your empire and conquer neighboring territories",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/goodgame-empire",
        category: "strategy",
        plays: 2100000,
        rating: 45,
        isNew: false,
        isTrending: false
      },

      // เพิ่มเกมใหม่อีกหลายเกม
      {
        title: "Run 3",
        description: "Run through space tunnels in this addictive endless running game",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/run-3",
        category: "action",
        plays: 4100000,
        rating: 48,
        isNew: true,
        isTrending: false
      },
      {
        title: "Happy Wheels",
        description: "Navigate obstacle courses with ragdoll physics in this crazy game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/happy-wheels",
        category: "action",
        plays: 3300000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Cookie Clicker",
        description: "Click to make cookies and build a cookie empire in this idle game",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/cookie-clicker",
        category: "puzzle",
        plays: 4700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Getting Over It",
        description: "Climb a mountain with a hammer in this frustratingly difficult game",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/embed/getting-over-it",
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
