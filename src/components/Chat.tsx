
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Users, Send, Radio, User, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, OnlineUser } from '@/types/app';
import { toast } from 'sonner';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('broadcast');
  const [userNickname, setUserNickname] = useState(user?.username || '');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize mock online users
  useEffect(() => {
    const mockUsers: OnlineUser[] = [
      { id: 1, username: 'admin', nickname: 'Administrator', lastSeen: new Date(), isOnline: true },
      { id: 2, username: 'kapor1', nickname: 'Kapor Wilayah 1', lastSeen: new Date(), isOnline: true },
      { id: 3, username: 'operator1', nickname: 'Operator Data', lastSeen: new Date(Date.now() - 300000), isOnline: false },
    ];
    setOnlineUsers(mockUsers);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user!.id,
      senderUsername: user!.username,
      senderNickname: userNickname,
      content: newMessage,
      timestamp: new Date(),
      type: selectedRecipient === 'broadcast' ? 'broadcast' : 'private',
      recipientId: selectedRecipient !== 'broadcast' ? parseInt(selectedRecipient) : undefined,
      recipientUsername: selectedRecipient !== 'broadcast' 
        ? onlineUsers.find(u => u.id.toString() === selectedRecipient)?.username 
        : undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    if (message.type === 'broadcast') {
      toast.success('Pesan broadcast terkirim ke semua user');
    } else {
      toast.success(`Pesan pribadi terkirim ke ${message.recipientUsername}`);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMessages = activeTab === 'broadcast' 
    ? messages.filter(m => m.type === 'broadcast')
    : messages.filter(m => 
        m.type === 'private' && 
        (m.senderId === user!.id || m.recipientId === user!.id)
      );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Online Users Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users Online ({onlineUsers.filter(u => u.isOnline).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Nickname Anda:</label>
              <Input
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                placeholder="Masukkan nickname"
              />
            </div>
            
            <ScrollArea className="h-64">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                  <Circle 
                    className={`h-3 w-3 ${onlineUser.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {onlineUser.nickname || onlineUser.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {onlineUser.isOnline ? 'Online' : `Terakhir: ${formatTime(onlineUser.lastSeen)}`}
                    </div>
                  </div>
                  {onlineUser.id === user?.id && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat System
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                Broadcast
              </TabsTrigger>
              <TabsTrigger value="private" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Private
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
              <ScrollArea className="flex-1 h-64 border rounded p-4 mb-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type === 'broadcast').map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.senderId === user?.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="text-xs opacity-75 mb-1">
                          {message.senderNickname || message.senderUsername} • {formatTime(message.timestamp)}
                        </div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="private" className="flex-1 flex flex-col mt-4">
              <ScrollArea className="flex-1 h-64 border rounded p-4 mb-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type === 'private' && (m.senderId === user?.id || m.recipientId === user?.id)).map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.senderId === user?.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-purple-100 text-purple-900'
                      }`}>
                        <div className="text-xs opacity-75 mb-1">
                          {message.senderId === user?.id 
                            ? `Ke: ${message.recipientUsername}` 
                            : `Dari: ${message.senderNickname || message.senderUsername}`
                          } • {formatTime(message.timestamp)}
                        </div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Message Input */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex gap-2">
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broadcast">📢 Broadcast ke Semua</SelectItem>
                  {onlineUsers.filter(u => u.id !== user?.id).map(onlineUser => (
                    <SelectItem key={onlineUser.id} value={onlineUser.id.toString()}>
                      💬 {onlineUser.nickname || onlineUser.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  selectedRecipient === 'broadcast' 
                    ? 'Tulis pesan broadcast...' 
                    : `Tulis pesan pribadi ke ${onlineUsers.find(u => u.id.toString() === selectedRecipient)?.nickname || 'user'}...`
                }
                className="flex-1"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
