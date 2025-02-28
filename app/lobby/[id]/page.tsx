"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface User {
  name: string;
  interests: {
    likes: string[];
    dislikes: string[];
  };
}

export default function Lobby() {
  const params = useParams();
  const lobbyId = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLobbyUsers = async () => {
      try {
        const response = await fetch(`/api/lobby/${lobbyId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch lobby data");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to load lobby data");
      }
    };

    fetchLobbyUsers();
  }, [lobbyId]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lobby {lobbyId}</h1>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-green-600">Likes:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.likes.map((tag, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-600">Dislikes:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.dislikes.map((tag, i) => (
                    <Badge key={i} className="bg-red-100 text-red-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
