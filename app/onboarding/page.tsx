"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ToggleTagsSelector from "@/components/ToggleTagsSelector";

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lobbyId = searchParams.get("lobbyId");
  const name = searchParams.get("name");
  const [likedTags, setLikedTags] = useState<string[]>([]);
  const [dislikedTags, setDislikedTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleTagsChange = (
    newLikedTags: string[],
    newDislikedTags: string[]
  ) => {
    setLikedTags(newLikedTags);
    setDislikedTags(newDislikedTags);
  };

  const handleComplete = async () => {
    if (likedTags.length + dislikedTags.length < 3) {
      setError("Please select at least 3 interests (likes or dislikes)");
      return;
    }

    try {
      const response = await fetch("/api/join-lobby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lobbyId,
          name,
          interests: {
            likes: likedTags,
            dislikes: dislikedTags,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join lobby");
      }

      router.push(`/lobby/${lobbyId}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Select Your Interests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will help match you with others. Like or dislike at least 3
            tags.
          </p>
        </div>

        <ToggleTagsSelector
          onTagsChange={handleTagsChange}
          initialLikedTags={[]}
          initialDislikedTags={[]}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleComplete} className="w-full">
          Join Lobby
        </Button>
      </div>
    </div>
  );
}
