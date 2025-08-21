
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { User, Crown, Mail, Lock, GamepadIcon, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Auth() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${data.user.username}!`,
      });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "สมัครสมาชิกสำเร็จ",
        description: "กรุณาเข้าสู่ระบบด้วยบัญชีใหม่",
      });
      // เปลี่ยนไปแท็บเข้าสู่ระบบ
    },
    onError: () => {
      toast({
        title: "สมัครสมาชิกไม่สำเร็จ",
        description: "กรุณาตรวจสอบข้อมูลและลองใหม่",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "รหัสผ่านสั้นเกินไป",
        description: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...dataToSend } = registerData;
    registerMutation.mutate(dataToSend);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 mint-gradient rounded-full">
            <GamepadIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ASHURA Games</h1>
          <p className="text-gray-400">เข้าสู่โลกเกมที่ไร้ขีดจำกัด</p>
        </div>

        <Card className="glass-dark border-mint-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50">
                <TabsTrigger value="login" className="text-white">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="register" className="text-white">สมัครสมาชิก</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-white flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      ชื่อผู้ใช้หรืออีเมล
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      รหัสผ่าน
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="กรอกรหัสผ่าน"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loginMutation.isPending}
                    className="w-full mint-gradient text-white font-semibold py-3"
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        กำลังเข้าสู่ระบบ...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Crown className="w-4 h-4 mr-2" />
                        เข้าสู่ระบบ
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-white flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      ชื่อผู้ใช้
                    </Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="เลือกชื่อผู้ใช้"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      อีเมล
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="กรอกอีเมลของคุณ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      รหัสผ่าน
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="สร้างรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-white flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      ยืนยันรหัสผ่าน
                    </Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      className="glass border-white/20 text-white"
                      placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={registerMutation.isPending}
                    className="w-full mint-gradient text-white font-semibold py-3"
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        กำลังสมัครสมาชิก...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        สมัครสมาชิก
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to Games */}
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              กลับไปหน้าเกม
            </Button>
          </Link>
        </div>

        {/* Demo Account Info */}
        <Card className="glass-dark border-mint-500/20 backdrop-blur-xl mt-4">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-white font-semibold mb-2">🎮 ทดลองใช้แอดมิน</h3>
              <p className="text-gray-400 text-sm mb-2">
                ชื่อผู้ใช้: <span className="text-mint-400">admin</span>
              </p>
              <p className="text-gray-400 text-sm">
                รหัสผ่าน: <span className="text-mint-400">admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
