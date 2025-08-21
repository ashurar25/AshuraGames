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
    // Seed with 20+ real games
    const initialGames: Omit<Game, 'id' | 'createdAt'>[] = [
      {
        title: "Super Platformer",
        description: "Jump and run through challenging levels in this classic platformer adventure",
        thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.construct.net/en/free-online-games/kiwi-story-9405/play",
        category: "action",
        plays: 2100000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Speed Racer 3D",
        description: "High-speed racing action with stunning 3D graphics and realistic physics",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/t/the-car-race/v470/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "racing",
        plays: 1800000,
        rating: 46,
        isNew: false,
        isTrending: true
      },
      {
        title: "Block Puzzle Master",
        description: "Addictive block-matching puzzle game that challenges your spatial thinking",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/1/10x10-plus/v100/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "puzzle",
        plays: 3200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Battle Arena IO",
        description: "Fight players worldwide in this intense multiplayer battle arena",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://slither.io",
        category: "multiplayer",
        plays: 1500000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Space Shooter",
        description: "Epic space battles with intense shooting action and power-ups",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/a/asteroid-crusher/v170/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "action",
        plays: 950000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Fantasy Quest",
        description: "Magical adventure RPG with quests, spells, and mythical creatures",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/d/diamond-rush/v130/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "action",
        plays: 720000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "City Builder",
        description: "Build your metropolis from scratch with advanced city planning",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/c/city-blocks/v100/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "strategy",
        plays: 890000,
        rating: 44,
        isNew: true,
        isTrending: false
      },
      {
        title: "Soccer Stars",
        description: "Football championship with realistic physics and tournament mode",
        thumbnail: "https://images.unsplash.com/photo-1559653329-1c5ad8ad3ade?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/s/soccer-physics-mobile/v130/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "multiplayer",
        plays: 650000,
        rating: 43,
        isNew: true,
        isTrending: false
      },
      {
        title: "Cyber Warrior",
        description: "Futuristic action game with cyberpunk aesthetics and intense combat",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/n/neon-blaster/v100/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "action",
        plays: 892000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Ninja Master",
        description: "Master the art of stealth and combat in this ninja adventure",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/n/ninja-run/v120/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "action",
        plays: 1200000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Gem Match 3",
        description: "Match colorful gems in this addictive puzzle adventure",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/j/jewel-christmas/v100/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "puzzle",
        plays: 2100000,
        rating: 48,
        isNew: false,
        isTrending: false
      },
      {
        title: "Brain Trainer",
        description: "Challenge your mind with various brain training exercises",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/m/math-whizz/v120/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "puzzle",
        plays: 756000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Drift King",
        description: "Master the art of drifting in this high-octane racing game",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/d/drift-race/v130/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "racing",
        plays: 1100000,
        rating: 44,
        isNew: false,
        isTrending: false
      },
      {
        title: "Moto Racer 3D",
        description: "High-speed motorcycle racing with realistic 3D graphics",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/m/moto-x3m/v470/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "racing",
        plays: 943000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Team Battle",
        description: "Join epic team battles in this multiplayer combat game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://agar.io",
        category: "multiplayer",
        plays: 1800000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Card Masters",
        description: "Strategic card battles with deck building mechanics",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/s/solitaire-classic/v140/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "multiplayer",
        plays: 654000,
        rating: 43,
        isNew: false,
        isTrending: false
      },
      {
        title: "Snake.io",
        description: "Grow your snake in this addictive multiplayer arena",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://slither.io",
        category: "io",
        plays: 3200000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "BattleRoyale.io",
        description: "Last player standing in this intense battle royale game",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://surviv.io",
        category: "io",
        plays: 2700000,
        rating: 48,
        isNew: false,
        isTrending: false
      },
      {
        title: "Tower Defense",
        description: "Defend your base with strategic tower placement",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/t/tower-defense/v130/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "strategy",
        plays: 1300000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Civilization",
        description: "Build and manage your own civilization through the ages",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://games.cdn.famobi.com/html5games/e/empire-island/v130/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=8f63b84c-2eb5-4967-9baa-7846b7b2ce7e&fg_pid=5438e3a4-1750-4e22-9270-76aa6b5d5138&fg_beat=525",
        category: "strategy",
        plays: 967000,
        rating: 47,
        isNew: false,
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
      ...insertGame,
      id,
      plays: 0,
      createdAt: new Date()
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
