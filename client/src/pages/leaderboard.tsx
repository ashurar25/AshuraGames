
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Medal, Award, User, TrendingUp, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface LeaderboardEntry {
  user: {
    id: string;
    username: string;
    level: number;
    isAdmin: boolean;
  };
  bestScore: number;
}

export default function Leaderboard() {
  const { data: globalLeaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard');
      return response.json();
    }
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'from-gray-800/20 to-gray-900/20 border-gray-600/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">🏆 อันดับผู้เล่น</h1>
              <p className="text-gray-400">ผู้เล่นที่มีคะแนนสูงสุดของเซิร์ฟเวอร์</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-mint-300 border-mint-500/50 hover:bg-mint-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับไปเล่นเกม
            </Button>
          </Link>
        </div>

        {/* Leaderboard */}
        <Card className="glass-dark border-mint-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-mint-400" />
              อันดับโลก - คะแนนรวมสูงสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-mint-500/30 border-t-mint-500 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-white">กำลังโหลดอันดับ...</div>
              </div>
            ) : globalLeaderboard && globalLeaderboard.length > 0 ? (
              <div className="space-y-4">
                {globalLeaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  
                  return (
                    <div
                      key={entry.user.id}
                      className={`relative p-4 rounded-lg border bg-gradient-to-r ${getRankColor(rank)} backdrop-blur-sm transition-all hover:scale-[1.02]`}
                    >
                      {/* Glow effect for top 3 */}
                      {isTopThree && (
                        <div className="absolute inset-0 rounded-lg blur-sm bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 -z-10"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(rank)}
                          </div>
                          
                          {/* User Info */}
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 mint-gradient rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-semibold text-lg">
                                  {entry.user.username}
                                </span>
                                {entry.user.isAdmin && (
                                  <Badge className="bg-purple-500 text-white text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    แอดมิน
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                เลเวล {entry.user.level}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-mint-400">
                            {entry.bestScore.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            คะแนนสูงสุด
                          </div>
                        </div>
                      </div>
                      
                      {/* Special effects for #1 */}
                      {rank === 1 && (
                        <div className="absolute top-2 right-2">
                          <div className="text-yellow-500 animate-pulse">
                            ✨
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <div className="text-white text-xl mb-2">ยังไม่มีข้อมูลอันดับ</div>
                <div className="text-gray-400 mb-6">เป็นคนแรกที่ขึ้นอันดับกันเถอะ!</div>
                <Link href="/">
                  <Button className="mint-gradient text-white">
                    เริ่มเล่นเกม
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Info */}
        <Card className="glass-dark border-mint-500/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-mint-400" />
              ระบบคะแนน
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">🎯 วิธีการได้คะแนน:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• เล่นเกมและทำคะแนนสูงๆ</li>
                  <li>• คะแนนจะสะสมจากทุกเกมที่เล่น</li>
                  <li>• ยิ่งเล่นเก่งยิ่งได้คะแนนเยอะ</li>
                  <li>• แต่ละเกมจะเก็บคะแนนสูงสุดไว้</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">🏆 รางวัลสำหรับผู้นำ:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 🥇 อันดับ 1: ตำแหน่งแชมป์โลก</li>
                  <li>• 🥈 อันดับ 2: เหรียญเงิน</li>
                  <li>• 🥉 อันดับ 3: เหรียญทองแดง</li>
                  <li>• 🎖️ ท็อป 10: เกียรติยศและชื่อเสียง</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-mint-500/10 to-blue-500/10 rounded-lg border border-mint-500/20">
              <h4 className="text-mint-400 font-semibold mb-2">💡 เคล็ดลับการขึ้นอันดับ:</h4>
              <p className="text-sm">
                เล่นเกมหลากหลายประเภท ฝึกฝนทักษะให้เก่งขึ้น และอย่าลืมเก็บคะแนนสูงๆ ในแต่ละเกม! 
                คะแนนรวมจากทุกเกมจะนำมาคำนวณอันดับของคุณ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
