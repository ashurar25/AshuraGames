
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

interface GameImageOptions {
  title: string;
  category: string;
  width?: number;
  height?: number;
}

export class GameImageGenerator {
  private static readonly CATEGORY_THEMES = {
    action: {
      gradient: ['#FF4444', '#AA0000'],
      icon: '⚡',
      bgPattern: 'diagonal-lines'
    },
    puzzle: {
      gradient: ['#8A2BE2', '#4B0082'],
      icon: '🧩',
      bgPattern: 'circles'
    },
    racing: {
      gradient: ['#FF8C00', '#FFD700'],
      icon: '🏎️',
      bgPattern: 'speed-lines'
    },
    arcade: {
      gradient: ['#00CED1', '#1E90FF'],
      icon: '🕹️',
      bgPattern: 'pixels'
    },
    adventure: {
      gradient: ['#32CD32', '#228B22'],
      icon: '🗺️',
      bgPattern: 'mountains'
    },
    casual: {
      gradient: ['#FF69B4', '#FF1493'],
      icon: '😊',
      bgPattern: 'dots'
    },
    sports: {
      gradient: ['#1E90FF', '#00BFFF'],
      icon: '⚽',
      bgPattern: 'grid'
    },
    strategy: {
      gradient: ['#4169E1', '#6A5ACD'],
      icon: '♟️',
      bgPattern: 'hexagon'
    }
  };

  static async generateGameImage(options: GameImageOptions): Promise<Buffer> {
    const { title, category, width = 800, height = 450 } = options;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const theme = this.CATEGORY_THEMES[category as keyof typeof this.CATEGORY_THEMES] || 
                  this.CATEGORY_THEMES.arcade;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.gradient[0]);
    gradient.addColorStop(1, theme.gradient[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add pattern overlay
    this.addPattern(ctx, theme.bgPattern, width, height);

    // Add dark overlay for text readability
    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, 'rgba(0,0,0,0.3)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);

    // Draw category icon
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(theme.icon, 40, 100);

    // Draw game title
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    
    // Word wrap for long titles
    const words = title.split(' ');
    let line = '';
    let y = 200;
    const maxWidth = width - 80;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 40, y);
        line = words[i] + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 40, y);

    // Draw category label
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(category.toUpperCase(), 40, y + 60);

    // Add ASHURA Games credit
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('ASHURA GAMES', width - 20, height - 20);

    // Add decorative elements
    this.addDecorations(ctx, width, height, theme);

    return canvas.toBuffer('image/png');
  }

  private static addPattern(ctx: CanvasRenderingContext2D, pattern: string, width: number, height: number) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    switch (pattern) {
      case 'diagonal-lines':
        for (let i = -height; i < width + height; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.stroke();
        }
        break;
      case 'circles':
        for (let x = 0; x < width; x += 80) {
          for (let y = 0; y < height; y += 80) {
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        break;
      case 'speed-lines':
        for (let y = 50; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width * 0.3, y);
          ctx.stroke();
        }
        break;
      case 'pixels':
        for (let x = 0; x < width; x += 20) {
          for (let y = 0; y < height; y += 20) {
            if (Math.random() > 0.7) {
              ctx.fillStyle = 'rgba(255,255,255,0.1)';
              ctx.fillRect(x, y, 10, 10);
            }
          }
        }
        break;
      case 'grid':
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        break;
    }
    ctx.restore();
  }

  private static addDecorations(ctx: CanvasRenderingContext2D, width: number, height: number, theme: any) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    
    // Add some sparkle effects
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  static async ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
