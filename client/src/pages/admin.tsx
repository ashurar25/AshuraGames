
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Game, GAME_CATEGORIES, InsertGame } from '@shared/schema';
import { Plus, Trash2, Edit, BarChart3, Users, Star, Gamepad2, Upload, Link2 } from 'lucide-react';
import { Link } from 'wouter';

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newGame, setNewGame] = useState<InsertGame>({
    title: '',
    description: '',
    thumbnail: '',
    gameUrl: '',
    gameFile: null,
    isEmbedded: true,
    category: 'action',
    rating: 40,
    isNew: false,
    isTrending: false,
  });

  const categoryMap: Record<string, string> = {
    'action': 'แอคชั่น',
    'puzzle': 'ปริศนา',
    'racing': 'รถแข่ง',
    'multiplayer': 'ผู้เล่นหลายคน',
    'io': '.IO',
    'strategy': 'กลยุทธ์'
  };

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const createGameMutation = useMutation({
    mutationFn: async (gameData: any) => {
      if (uploadType === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('gameFile', selectedFile);
        Object.keys(gameData).forEach(key => {
          if (key !== 'gameFile') {
            formData.append(key, gameData[key]);
          }
        });
        
        const response = await fetch('/api/games/upload', {
          method: 'POST',
          body: formData,
        });
        return response.json();
      } else {
        return apiRequest('POST', '/api/games', gameData).then(res => res.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      toast({
        title: "สำเร็จ",
        description: "เพิ่มเกมสำเร็จแล้ว",
      });
      setNewGame({
        title: '',
        description: '',
        thumbnail: '',
        gameUrl: '',
        gameFile: null,
        isEmbedded: true,
        category: 'action',
        rating: 40,
        isNew: false,
        isTrending: false,
      });
      setSelectedFile(null);
      setShowAddForm(false);
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเกมได้",
        variant: "destructive",
      });
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Game> }) =>
      apiRequest('PUT', `/api/games/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดตเกมสำเร็จแล้ว",
      });
      setEditingGame(null);
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอัพเดตเกมได้",
        variant: "destructive",
      });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/games/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      toast({
        title: "สำเร็จ",
        description: "ลบเกมสำเร็จแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบเกมได้",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
      ...newGame,
      isEmbedded: uploadType === 'url',
    };
    createGameMutation.mutate(gameData);
  };

  const handleUpdate = (game: Game) => {
    if (editingGame) {
      updateGameMutation.mutate({ 
        id: editingGame.id, 
        data: editingGame 
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบเกมนี้?')) {
      deleteGameMutation.mutate(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['.zip', '.html', '.js'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์ .zip, .html หรือ .js เท่านั้น",
          variant: "destructive",
        });
      }
    }
  };

  const totalPlays = games?.reduce((sum, game) => sum + game.plays, 0) || 0;
  const avgRating = games?.length ? 
    games.reduce((sum, game) => sum + game.rating, 0) / games.length / 10 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" data-testid="page-admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 mint-gradient rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">แดชบอร์ดแอดมิน</h1>
              <p className="text-gray-400">จัดการเกม ASHURA</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-mint-300 border-mint-500/50 hover:bg-mint-500/10" data-testid="link-back-home">
              กลับไปหน้าเกม
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-dark border-mint-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">เกมทั้งหมด</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-total-games">{games?.length || 0}</p>
                </div>
                <Gamepad2 className="text-mint-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-mint-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">เล่นทั้งหมด</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-total-plays">
                    {totalPlays.toLocaleString()}
                  </p>
                </div>
                <Users className="text-mint-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-mint-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">คะแนนเฉลี่ย</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-avg-rating">{avgRating.toFixed(1)}</p>
                </div>
                <Star className="text-mint-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-mint-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">หมวดหมู่</p>
                  <p className="text-2xl font-bold text-white">{GAME_CATEGORIES.length}</p>
                </div>
                <BarChart3 className="text-mint-400 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Game Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mint-gradient text-white"
            data-testid="button-add-game"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มเกมใหม่
          </Button>
        </div>

        {/* Game Support Info */}
        <Card className="glass-dark border-mint-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2 text-mint-400" />
              รองรับเกมประเภทไหนบ้าง?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">✅ เกมที่รองรับ:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• เกม HTML5 ที่เล่นใน iframe ได้</li>
                  <li>• เกม embed จาก GameFlare, CrazyGames</li>
                  <li>• ไฟล์เกม HTML, JavaScript, ZIP ที่อัพโหลดเอง</li>
                  <li>• เกม Unity WebGL (ที่รองรับ iframe)</li>
                  <li>• เกม Flash ที่แปลงเป็น HTML5 แล้ว</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">❌ เกมที่ไม่รองรับ:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• เกมที่มี X-Frame-Options หรือ CSP Deny</li>
                  <li>• เกมที่ต้อง login ก่อนเล่น</li>
                  <li>• เกม Mobile App (iOS/Android)</li>
                  <li>• เกม Desktop (.exe, .dmg)</li>
                  <li>• เกม Flash ดั้งเดิมที่ไม่ได้แปลง</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">🔗 ตัวอย่าง URL ที่ใช้ได้:</h4>
              <div className="bg-gray-800 rounded p-3 text-xs space-y-1">
                <div>• https://www.gameflare.com/embed/game-name/</div>
                <div>• https://html5games.com/embed/game/</div>
                <div>• https://itch.io/embed/game-id</div>
                <div>• URL ของเกมที่อัพโหลดเองบน server</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Game Form */}
        {showAddForm && (
          <Card className="glass-dark border-mint-500/20 mb-8" data-testid="form-add-game">
            <CardHeader>
              <CardTitle className="text-white">เพิ่มเกมใหม่</CardTitle>
              <p className="text-gray-400 text-sm">เลือกว่าจะใส่ URL หรืออัพโหลดไฟล์เกม</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Upload Type Selection */}
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={uploadType === 'url' ? 'default' : 'outline'}
                    onClick={() => setUploadType('url')}
                    className={uploadType === 'url' ? 'mint-gradient text-white' : 'border-white/20 text-white'}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    ใส่ URL
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === 'file' ? 'default' : 'outline'}
                    onClick={() => setUploadType('file')}
                    className={uploadType === 'file' ? 'mint-gradient text-white' : 'border-white/20 text-white'}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    อัพโหลดไฟล์
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">ชื่อเกม</Label>
                    <Input
                      id="title"
                      value={newGame.title}
                      onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      data-testid="input-game-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-white">หมวดหมู่</Label>
                    <Select 
                      value={newGame.category} 
                      onValueChange={(value) => setNewGame({ ...newGame, category: value })}
                    >
                      <SelectTrigger className="glass border-white/20 text-white" data-testid="select-game-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-mint-500/20">
                        {GAME_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{categoryMap[cat]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">คำอธิบาย</Label>
                  <Textarea
                    id="description"
                    value={newGame.description}
                    onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                    required
                    className="glass border-white/20 text-white"
                    data-testid="input-game-description"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail" className="text-white">URL รูปภาพปก</Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={newGame.thumbnail}
                    onChange={(e) => setNewGame({ ...newGame, thumbnail: e.target.value })}
                    required
                    className="glass border-white/20 text-white"
                    data-testid="input-game-thumbnail"
                  />
                </div>

                {/* Conditional input based on upload type */}
                {uploadType === 'url' ? (
                  <div>
                    <Label htmlFor="gameUrl" className="text-white">URL เกม</Label>
                    <Input
                      id="gameUrl"
                      type="url"
                      value={newGame.gameUrl}
                      onChange={(e) => setNewGame({ ...newGame, gameUrl: e.target.value })}
                      required
                      placeholder="https://www.gameflare.com/embed/game-name/"
                      className="glass border-white/20 text-white"
                      data-testid="input-game-url"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ใส่ URL ของเกม HTML5 ที่สามารถเล่นใน iframe ได้
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="gameFile" className="text-white">ไฟล์เกม</Label>
                    <Input
                      id="gameFile"
                      type="file"
                      accept=".zip,.html,.js"
                      onChange={handleFileChange}
                      required
                      className="glass border-white/20 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      รองรับไฟล์ .zip, .html หรือ .js เท่านั้น (ขนาดไม่เกิน 50MB)
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-mint-400 mt-2">
                        ไฟล์ที่เลือก: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rating" className="text-white">คะแนน (0-50)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="50"
                      value={newGame.rating}
                      onChange={(e) => setNewGame({ ...newGame, rating: parseInt(e.target.value) })}
                      className="glass border-white/20 text-white"
                      data-testid="input-game-rating"
                    />
                  </div>
                  <div className="flex items-center space-x-4 pt-6">
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={newGame.isNew}
                        onChange={(e) => setNewGame({ ...newGame, isNew: e.target.checked })}
                        className="rounded border-white/20"
                        data-testid="checkbox-game-new"
                      />
                      <span>เกมใหม่</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4 pt-6">
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={newGame.isTrending}
                        onChange={(e) => setNewGame({ ...newGame, isTrending: e.target.checked })}
                        className="rounded border-white/20"
                        data-testid="checkbox-game-trending"
                      />
                      <span>เกมยอดนิยม</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createGameMutation.isPending}
                    className="mint-gradient text-white"
                    data-testid="button-save-game"
                  >
                    {createGameMutation.isPending ? 'กำลังเพิ่ม...' : 'เพิ่มเกม'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-white/20 text-white"
                    data-testid="button-cancel-add"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Games List */}
        <Card className="glass-dark border-mint-500/20">
          <CardHeader>
            <CardTitle className="text-white">เกมทั้งหมด ({games?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white">กำลังโหลดเกม...</div>
              </div>
            ) : (
              <div className="space-y-4" data-testid="list-games">
                {games?.map((game) => (
                  <div key={game.id} className="glass p-4 rounded-lg border border-white/10" data-testid={`item-game-${game.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="text-white font-semibold" data-testid={`text-game-title-${game.id}`}>{game.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{game.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs border-mint-500/50 text-mint-300">
                              {categoryMap[game.category]}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-white/20 text-white">
                              ⭐ {(game.rating / 10).toFixed(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-white/20 text-white">
                              {game.plays.toLocaleString()} เล่น
                            </Badge>
                            {!game.isEmbedded && (
                              <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                                อัพโหลดไฟล์
                              </Badge>
                            )}
                            {game.isNew && (
                              <Badge className="bg-blue-500 text-white text-xs">ใหม่</Badge>
                            )}
                            {game.isTrending && (
                              <Badge className="bg-orange-500 text-white text-xs">ยอดนิยม</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingGame(game)}
                          className="border-mint-500/50 text-mint-300 hover:bg-mint-500/10"
                          data-testid={`button-edit-${game.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(game.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          data-testid={`button-delete-${game.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
