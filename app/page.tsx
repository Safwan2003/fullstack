'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Page = () => {
  type User = {
  id: number;
  name: string;
  email: string;
};

const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const getUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id: number) => {
    try {
      await axios.delete('/api/users', {
        data: { id },
      });
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users', {
        name: formData.name,
        email: formData.email,
      });
      setFormData({ name: '', email: '' });
      getUsers(); // Refresh
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Create User Form */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create New User</h2>
        <form onSubmit={createUser} className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">
            Create User
          </Button>
        </form>
      </Card>

      {/* User List */}
      {users.map((user) => (
        <Card key={user.id} className="p-6 text-gray-800">
          <CardContent className="space-y-2">
            <h3 className="font-semibold">ID: {user.id}</h3>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <Button
              variant="destructive"
              onClick={() => deleteUser(user.id)}
              className="mt-2"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Page;
