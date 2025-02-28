"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Banana } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [lobbyId, setLobbyId] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const createLobby = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/create-lobby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: lobbyName,
        }),
      });
      const data = await response.json();
      if (data.lobbyId) {
        setIsOpen(false);
        router.push(`/enter-name?lobbyId=${data.lobbyId}`);
      } else {
        setError("Failed to create lobby");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const joinLobby = () => {
    if (lobbyId.length !== 6 || !/^\d+$/.test(lobbyId)) {
      setError("Please enter a valid 6-digit lobby ID");
      return;
    }
    router.push(`/enter-name?lobbyId=${lobbyId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 flex gap-2 items-center">
        <Banana className="w-8 h-8" /> BananaTrail
      </h1>
      <div className="w-full max-w-md space-y-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Create Lobby</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Lobby</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lobbyName">Lobby Name</Label>
                <Input
                  id="lobbyName"
                  value={lobbyName}
                  onChange={(e) => setLobbyName(e.target.value)}
                  placeholder="Enter lobby name"
                />
              </div>
              <Button onClick={createLobby} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="space-y-2">
          <Label htmlFor="lobbyId">Join Existing Lobby</Label>
          <div className="flex space-x-2">
            <Input
              id="lobbyId"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              placeholder="Enter 6-digit Lobby ID"
              maxLength={6}
            />
            <Button onClick={joinLobby}>Join</Button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
