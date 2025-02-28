"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  name: string;
  likes: string[];
  dislikes: string[];
}

export default function Lobby() {
  const params = useParams();
  const lobbyId = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [suggest, setSuggest] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLobbyUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/lobby/${lobbyId}/hub`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lobby data");
        }
        const data = await response.json();
        setUsers(data.members);
      } catch (err) {
        setError("Failed to load lobby data");
      }
    };

    fetchLobbyUsers();
  }, [lobbyId]);

  useEffect(() => {
    const fetchLobbyRecommendation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/lobby/${lobbyId}/recommendations`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lobby data");
        }
        const data = await response.text();
        console.log(data);
        setSuggest(data);
      } catch (err) {
        setError("Failed to load lobby data");
      }
    };

    fetchLobbyRecommendation();
  }, [lobbyId]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lobby - {lobbyId}</h1>
      <p className="">We will suggest you places for Singapore.</p>

      {!suggest ? (
        <div className="flex flex-col space-y-4 pt-5 pb-6">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none break-words pt-2 pb-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-medium mt-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed my-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 space-y-1" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 pl-4 italic opacity-80"
                  {...props}
                />
              ),
              code: ({ node, className, ...props }) => (
                <code
                  className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm"
                  {...props}
                />
              ),
            }}
          >
            {suggest}
          </ReactMarkdown>
        </div>
      )}

      <h4 className="text-xl font-semibold mb-4">Members</h4>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-green-600">Likes:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.likes.map((tag, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-600">Dislikes:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.dislikes.map((tag, i) => (
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
