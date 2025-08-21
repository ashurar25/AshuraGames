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
    // Seed with 40+ real playable HTML5 games
    const initialGames: Omit<Game, 'id' | 'createdAt'>[] = [
      // ACTION GAMES
      {
        title: "Super Mario Bros",
        description: "The classic platform adventure game with Mario jumping and running through amazing worlds",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://mario-play.com/mario-games/super-mario-bros/",
        category: "action",
        plays: 5200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Pac-Man",
        description: "The iconic arcade game where you eat dots and avoid ghosts in this maze adventure",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://pacman.live/",
        category: "action",
        plays: 4800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Street Fighter 2",
        description: "Classic fighting game with legendary characters like Ryu, Ken, and Chun-Li",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://sf2.playretrogames.com/",
        category: "action",
        plays: 3400000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Mega Man X",
        description: "Futuristic action platformer with incredible weapons and boss battles",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://megamanx.playretrogames.com/",
        category: "action",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Contra",
        description: "Run and gun military-themed action game with co-op gameplay",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://contra.playretrogames.com/",
        category: "action",
        plays: 1900000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Metal Slug",
        description: "Side-scrolling run and gun game with amazing hand-drawn animation",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://metalslug.playretrogames.com/",
        category: "action",
        plays: 1700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },

      // PUZZLE GAMES
      {
        title: "Tetris",
        description: "The legendary block puzzle game that started it all - arrange falling blocks perfectly",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://tetris.com/play-tetris",
        category: "puzzle",
        plays: 6500000,
        rating: 50,
        isNew: false,
        isTrending: true
      },
      {
        title: "Sudoku Master",
        description: "Classic number puzzle game that challenges your logical thinking skills",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://sudoku.com/",
        category: "puzzle",
        plays: 4200000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "2048",
        description: "Slide numbered tiles to combine them and reach the magical 2048 tile",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://play2048.co/",
        category: "puzzle",
        plays: 3800000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Candy Crush",
        description: "Match 3 sweet candies in this colorful and addictive puzzle adventure",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/candy-crush",
        category: "puzzle",
        plays: 5100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Bejeweled",
        description: "Match sparkling gems in this classic match-3 puzzle game",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/bejeweled",
        category: "puzzle",
        plays: 2900000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Mahjong Solitaire",
        description: "Traditional Chinese tile-matching game with beautiful designs",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://mahjong-games.com/",
        category: "puzzle",
        plays: 2300000,
        rating: 44,
        isNew: false,
        isTrending: false
      },

      // RACING GAMES
      {
        title: "Need for Speed",
        description: "High-speed street racing with amazing cars and intense police chases",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/burnin-rubber-5-xs",
        category: "racing",
        plays: 4600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Mario Kart",
        description: "Fun kart racing with power-ups, crazy tracks, and Nintendo characters",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://supermariokart.playretrogames.com/",
        category: "racing",
        plays: 3900000,
        rating: 47,
        isNew: false,
        isTrending: true
      },
      {
        title: "Hill Climb Racing",
        description: "Physics-based driving game with unique vehicles and challenging terrains",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/hill-climb-racing",
        category: "racing",
        plays: 3200000,
        rating: 46,
        isNew: false,
        isTrending: false
      },
      {
        title: "Drift Hunters",
        description: "Master the art of drifting with customizable cars and realistic physics",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://drift-hunters.com/",
        category: "racing",
        plays: 2700000,
        rating: 45,
        isNew: true,
        isTrending: false
      },
      {
        title: "Moto X3M",
        description: "Extreme motorcycle racing with death-defying stunts and obstacles",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://motox3m.com/",
        category: "racing",
        plays: 2100000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // MULTIPLAYER GAMES
      {
        title: "Among Us Online",
        description: "Find the impostor among your crew in this social deduction game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/among-us-online",
        category: "multiplayer",
        plays: 7200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Fall Guys",
        description: "Hilarious multiplayer party game with obstacle courses and mini-games",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/stumble-guys",
        category: "multiplayer",
        plays: 5800000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Minecraft Classic",
        description: "Build and explore infinite worlds in this creative sandbox game",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://classic.minecraft.net/",
        category: "multiplayer",
        plays: 8900000,
        rating: 50,
        isNew: false,
        isTrending: false
      },
      {
        title: "Shell Shockers",
        description: "Fast-paced multiplayer FPS game where you play as an egg with guns",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://shellshock.io/",
        category: "multiplayer",
        plays: 4300000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Skribbl.io",
        description: "Multiplayer drawing and guessing game that tests your creativity",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://skribbl.io/",
        category: "multiplayer",
        plays: 3700000,
        rating: 46,
        isNew: false,
        isTrending: false
      },

      // .IO GAMES
      {
        title: "Slither.io",
        description: "Grow your snake by eating pellets and other players in this addictive arena",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://slither.io/",
        category: "io",
        plays: 9200000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Agar.io",
        description: "Control a cell and eat other players to grow bigger in this simple yet addictive game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://agar.io/",
        category: "io",
        plays: 8600000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Diep.io",
        description: "Control a tank and destroy other players in this competitive multiplayer shooter",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://diep.io/",
        category: "io",
        plays: 6400000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Paper.io 2",
        description: "Capture territory by drawing lines and avoid other players in this strategic game",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://paper-io.com/",
        category: "io",
        plays: 5200000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Wings.io",
        description: "Fly a plane and battle other pilots in fast-paced aerial combat",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://wings.io/",
        category: "io",
        plays: 3800000,
        rating: 45,
        isNew: false,
        isTrending: false
      },
      {
        title: "Surviv.io",
        description: "Battle royale game where you fight to be the last player standing",
        thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://surviv.io/",
        category: "io",
        plays: 7100000,
        rating: 48,
        isNew: false,
        isTrending: false
      },

      // STRATEGY GAMES
      {
        title: "Age of Empires",
        description: "Build civilizations and conquer enemies in this classic real-time strategy game",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/goodgame-empire",
        category: "strategy",
        plays: 4900000,
        rating: 48,
        isNew: false,
        isTrending: true
      },
      {
        title: "Chess.com",
        description: "Play the classic strategy board game against players worldwide",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.chess.com/play",
        category: "strategy",
        plays: 6700000,
        rating: 49,
        isNew: false,
        isTrending: true
      },
      {
        title: "Tower Defense Kingdom",
        description: "Defend your kingdom by building towers and upgrading your defenses",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/kingdom-rush",
        category: "strategy",
        plays: 3600000,
        rating: 47,
        isNew: false,
        isTrending: false
      },
      {
        title: "Civilization Online",
        description: "Build your empire from ancient times to the modern era in this epic strategy game",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/forge-of-empires",
        category: "strategy",
        plays: 2800000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Plants vs Zombies",
        description: "Defend your home from zombie invasion using an army of plants",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/plants-vs-zombies",
        category: "strategy",
        plays: 5400000,
        rating: 48,
        isNew: false,
        isTrending: false
      },
      {
        title: "Command & Conquer",
        description: "Military real-time strategy with intense battles and resource management",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/warzone-getaway-shooting-game",
        category: "strategy",
        plays: 2100000,
        rating: 45,
        isNew: false,
        isTrending: false
      },

      // เพิ่มเกมใหม่อีก 10 เกม
      {
        title: "Sonic the Hedgehog",
        description: "Run at supersonic speed and collect rings in this classic platform adventure",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://sonic.playretrogames.com/",
        category: "action",
        plays: 4100000,
        rating: 48,
        isNew: true,
        isTrending: false
      },
      {
        title: "Donkey Kong",
        description: "Help Mario rescue the princess from the giant gorilla in this arcade classic",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://donkeykong.playretrogames.com/",
        category: "action",
        plays: 3300000,
        rating: 46,
        isNew: true,
        isTrending: false
      },
      {
        title: "Bubble Shooter",
        description: "Match colored bubbles to clear the screen in this relaxing puzzle game",
        thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://bubble-shooter.co/",
        category: "puzzle",
        plays: 4700000,
        rating: 47,
        isNew: true,
        isTrending: false
      },
      {
        title: "Crossy Road",
        description: "Help the chicken cross busy roads and rivers in this endless arcade game",
        thumbnail: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        gameUrl: "https://www.crazygames.com/game/crossy-road",
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
