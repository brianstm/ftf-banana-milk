"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ToggleTagsSelectorProps {
  onTagsChange: (likes: string[], dislikes: string[]) => void;
  initialLikedTags: string[];
  initialDislikedTags: string[];
}

export default function ToggleTagsSelector({
  onTagsChange,
  initialLikedTags,
  initialDislikedTags,
}: ToggleTagsSelectorProps) {
  const initialTags = [
    "Outdoor",
    "Indoor",
    "Physical",
    "Creative",
    "Social",
    "Relaxing",
    "Educational",
    "Adventure",
    "Cultural",
    "Culinary",
    "Fitness",
    "Entertainment",
    "Spiritual",
    "Tech-related",
  ];

  const [allTags, setAllTags] = useState<string[]>(initialTags);
  const [likedTags, setLikedTags] = useState<string[]>(initialLikedTags);
  const [dislikedTags, setDislikedTags] =
    useState<string[]>(initialDislikedTags);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string, isLike: boolean) => {
    let newLikedTags = [...likedTags];
    let newDislikedTags = [...dislikedTags];

    if (isLike) {
      if (likedTags.includes(tag)) {
        newLikedTags = newLikedTags.filter((t) => t !== tag);
      } else {
        newLikedTags.push(tag);
        newDislikedTags = newDislikedTags.filter((t) => t !== tag);
      }
    } else {
      if (dislikedTags.includes(tag)) {
        newDislikedTags = newDislikedTags.filter((t) => t !== tag);
      } else {
        newDislikedTags.push(tag);
        newLikedTags = newLikedTags.filter((t) => t !== tag);
      }
    }

    setLikedTags(newLikedTags);
    setDislikedTags(newDislikedTags);
    onTagsChange(newLikedTags, newDislikedTags);
  };

  useEffect(() => {
    const fetchTags = async () => {
      if (
        likedTags.length + dislikedTags.length !== 3 &&
        likedTags.length + dislikedTags.length !== 6 &&
        likedTags.length + dislikedTags.length !== 9
      )
        return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "http://localhost:8000/generate-interests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              liked_tags: likedTags,
              disliked_tags: dislikedTags,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setAllTags((prevTags) => [...new Set([...prevTags, ...data.new_tags])]);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load suggestions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [likedTags, dislikedTags]);

  const SkeletonLoader = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Activity Preferences</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <div key={tag} className="flex items-center">
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer transition-colors py-2 px-3",
                  likedTags.includes(tag) &&
                    "bg-green-100 text-green-800 hover:bg-green-200",
                  dislikedTags.includes(tag) &&
                    "bg-red-100 text-red-800 hover:bg-red-200"
                )}
              >
                {tag}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={() => toggleTag(tag, true)}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => toggleTag(tag, false)}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {isLoading && <SkeletonLoader />}
        </div>
      </div>

      {error && (
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {(likedTags.length > 0 || dislikedTags.length > 0) && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Your preferences:</h4>
          <div className="space-y-2">
            {likedTags.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-600">Likes:</h5>
                <div className="flex flex-wrap gap-2">
                  {likedTags.map((tag) => (
                    <Badge key={tag} className="bg-green-100 text-green-800">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent text-green-800"
                        onClick={() => toggleTag(tag, true)}
                      >
                        <span className="sr-only">Remove {tag}</span>×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {dislikedTags.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-600">Dislikes:</h5>
                <div className="flex flex-wrap gap-2">
                  {dislikedTags.map((tag) => (
                    <Badge key={tag} className="bg-red-100 text-red-800">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent text-red-800"
                        onClick={() => toggleTag(tag, false)}
                      >
                        <span className="sr-only">Remove {tag}</span>×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
