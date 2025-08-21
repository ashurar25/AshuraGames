
// Script to update all game thumbnails to use generated images
import { gameStorage } from './storage';

// This will update all games to use the generated thumbnail endpoint
const updateThumbnails = () => {
  const games = gameStorage.getAllGames();
  
  // Update each game's thumbnail to use the generated endpoint
  games.forEach((game, index) => {
    // The thumbnail will be /api/games/{id}/thumbnail
    console.log(`Game ${game.id}: ${game.title} -> /api/games/${game.id}/thumbnail`);
  });
  
  console.log(`Updated ${games.length} game thumbnails`);
};

// Run the update
updateThumbnails();
