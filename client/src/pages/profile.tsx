
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Crown, 
  Coins, 
  Trophy, 
  Star, 
  Calendar,
  Edit,
  Save,
  LogOut,
  Gamepad2,
  TrendingUp,
  Award
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
  achievements: string[];
  createdAt: string;
  lastLogin: string;
  isAdmin: boolean;
}

interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  playTime: number;
  completedAt: string;
}

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  // ตรวจสอบว่ามี token หรือไม่
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['/api/auth/profile'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    }
  });

  const { data: scores, isLoading: scoresLoading } = useQuery<GameScore[]>({
    queryKey: ['/api/scores/my'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/scores/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      return response.json();
    }
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['/api/leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard');
      return response.json();
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
      toast({
        title: "อัพเดตสำเร็จ",
        description: "ข้อมูลโปรไฟล์ได้รับการอัพเดตแล้ว",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดตข้อมูลได้",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "หวังว่าจะได้เจอกันใหม่เร็วๆ นี้!",
    });
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  useEffect(() => {
    if (profile && !isEditing) {
      setProfileData({
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar || ''
      });
    }
  }, [profile, isEditing]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">ไม่พบข้อมูลผู้ใช้</div>
      </div>
    );
  }

  // คำนวณสถิติ
  const totalGamesPlayed = scores?.length || 0;
  const totalScore = scores?.reduce((sum, score) => sum + score.score, 0) || 0;
  const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0;
  const userRank = leaderboard?.findIndex((entry: any) => entry.user.id === profile.id) + 1 || 0;

  // Achievement mapping
  const achievementNames: Record<string, { name: string; icon: string; color: string }> = {
    'first_login': { name: 'ก้าวแรก', icon: '🎮', color: 'bg-blue-500' },
    'admin_access': { name: 'ผู้ดูแลระบบ', icon: '👑', color: 'bg-purple-500' },
    'game_master': { name: 'เซียนเกม', icon: '🏆', color: 'bg-yellow-500' },
    'high_scorer': { name: 'คะแนนสูง', icon: '⭐', color: 'bg-green-500' },
    'speed_runner': { name: 'นักวิ่ง', icon: '⚡', color: 'bg-orange-500' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 mint-gradient rounded-full flex items-center justify-center">
              <User className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">โปรไฟล์ของฉัน</h1>
              <p className="text-gray-400">จัดการข้อมูลส่วนตัวและดูสถิติการเล่น</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" className="text-mint-300 border-mint-500/50 hover:bg-mint-500/10">
                <Gamepad2 className="w-4 h-4 mr-2" />
                เล่นเกม
              </Button>
            </Link>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="text-red-400 border-red-500/50 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="glass-dark border-mint-500/20">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 mint-gradient rounded-full flex items-center justify-center">
                  <User className="text-white text-3xl" />
                </div>
                <CardTitle className="text-white text-xl">{profile.username}</CardTitle>
                {profile.isAdmin && (
                  <Badge className="bg-purple-500 text-white">
                    <Crown className="w-4 h-4 mr-1" />
                    แอดมิน
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level & XP */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint-400">เลเวล {profile.level}</div>
                  <div className="text-sm text-gray-400">{profile.experience.toLocaleString()} XP</div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                    <div 
                      className="mint-gradient h-2 rounded-full transition-all"
                      style={{ width: `${(profile.experience % 1000) / 10}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {1000 - (profile.experience % 1000)} XP ถึงเลเวลถัดไป
                  </div>
                </div>

                {/* Coins */}
                <div className="flex items-center justify-center space-x-2 text-yellow-400">
                  <Coins className="w-5 h-5" />
                  <span className="text-lg font-semibold">{profile.coins.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">เหรียญ</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">{totalGamesPlayed}</div>
                    <div className="text-xs text-gray-400">เกมที่เล่น</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">#{userRank || '--'}</div>
                    <div className="text-xs text-gray-400">อันดับ</div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="text-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  สมาชิกตั้งแต่ {new Date(profile.createdAt).toLocaleDateString('th-TH')}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-dark border-mint-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-mint-400" />
                  ความสำเร็จ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {profile.achievements.map((achievement, index) => {
                    const achievementInfo = achievementNames[achievement] || {
                      name: achievement,
                      icon: '🏅',
                      color: 'bg-gray-500'
                    };
                    
                    return (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50">
                        <div className={`w-8 h-8 ${achievementInfo.color} rounded-full flex items-center justify-center text-white text-sm`}>
                          {achievementInfo.icon}
                        </div>
                        <span className="text-white text-sm">{achievementInfo.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="overview" className="text-white">ภาพรวม</TabsTrigger>
                <TabsTrigger value="scores" className="text-white">คะแนน</TabsTrigger>
                <TabsTrigger value="settings" className="text-white">ตั้งค่า</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glass-dark border-mint-500/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-mint-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{totalScore.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">คะแนนรวม</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-dark border-mint-500/20">
                    <CardContent className="p-6 text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{averageScore.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">คะแนนเฉลี่ย</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-dark border-mint-500/20">
                    <CardContent className="p-6 text-center">
                      <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">#{userRank || '--'}</div>
                      <div className="text-sm text-gray-400">อันดับโลก</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Games */}
                <Card className="glass-dark border-mint-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">เกมล่าสุด</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scoresLoading ? (
                      <div className="text-center text-gray-400">กำลังโหลด...</div>
                    ) : scores && scores.length > 0 ? (
                      <div className="space-y-3">
                        {scores.slice(0, 5).map((score) => (
                          <div key={score.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                            <div>
                              <div className="text-white font-medium">เกม ID: {score.gameId}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(score.completedAt).toLocaleDateString('th-TH')}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-mint-400 font-bold">{score.score.toLocaleString()}</div>
                              <div className="text-xs text-gray-400">{Math.round(score.playTime/1000)}s</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">ยังไม่มีการเล่นเกม</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scores">
                <Card className="glass-dark border-mint-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">ประวัติคะแนนทั้งหมด</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scoresLoading ? (
                      <div className="text-center text-gray-400">กำลังโหลด...</div>
                    ) : scores && scores.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {scores.map((score) => (
                          <div key={score.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                            <div>
                              <div className="text-white font-medium">เกม ID: {score.gameId}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(score.completedAt).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-mint-400 font-bold">{score.score.toLocaleString()}</div>
                              <div className="text-xs text-gray-400">เล่น {Math.round(score.playTime/1000)} วินาที</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>ยังไม่มีการเล่นเกม</p>
                        <Link href="/">
                          <Button className="mt-4 mint-gradient text-white">
                            เริ่มเล่นเกม
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="glass-dark border-mint-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">ตั้งค่าโปรไฟล์</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">ชื่อผู้ใช้</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        disabled={!isEditing}
                        className="glass border-white/20 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">อีเมล</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="glass border-white/20 text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="mint-gradient text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          แก้ไขข้อมูล
                        </Button>
                      ) : (
                        <>
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="mint-gradient text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
                          </Button>
                          <Button 
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="border-white/20 text-white"
                          >
                            ยกเลิก
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
