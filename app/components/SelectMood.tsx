"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import useMoodStore from "../store/useMoodStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

const moods = [
  { color: "#FCD34D", mood: "happy" },
  { color: "#60A5FA", mood: "sad" },
  { color: "#F87171", mood: "angry" },
  { color: "#34D399", mood: "calm" },
  { color: "#A78BFA", mood: "anxious" },
  { color: "#FBBF24", mood: "excited" },
  { color: "#9CA3AF", mood: "neutral" },
];

function SelectMood() {
  const { mood, setMood, userId, setUserId } = useMoodStore((state) => state);
  const createUser = useMutation(api.users.create);
  const addMood = useMutation(api.users.addMood);
  const createChat = useMutation(api.chatRoom.createOrJoin);
  const router = useRouter();

  const handleSelectMood = (m: string) => {
    console.log(m)
    setMood(m);
  };

  console.log(mood, " mood id ",userId)
const logMood = async () => {
  if (!mood) {
    return toast.error("Please select a colour mood first");
  }

  let activeUserId = userId;

  if (!activeUserId) {
    const newUserId = await createUser({ mood });
    if (newUserId) {
      setUserId(newUserId); // state updates after function completes
      activeUserId = newUserId;
    }
  } else {
    await addMood({ userId: activeUserId as Id<"users">, mood });
  }

  const roomId = await createChat({
    userId: activeUserId as Id<"users">,
    mood,
  });

  router.push(`/chat/${roomId}`);
};

  return (
    <div className="flex flex-col gap-5 ">
      <div className="grid grid-cols-3 gap-4 p-6">
        {moods.map((m) => (
          <Button
            key={m.mood}
            onClick={() => handleSelectMood(m.mood)}
            className={`w-20 h-20 rounded-full ${mood == m.mood ? "inset-ring-2 " : ""} `}
            style={{ backgroundColor: m.color }}
          />
        ))}
      </div>

      <Button
        className="text-lg mx-2"
        variant={"secondary"}
        onClick={() => logMood()}
      >
        Log
      </Button>
    </div>
  );
}

export default SelectMood;
