import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface MoodState {
  mood: string | null;
  setMood: (mood: string) => void;
  userId: string | null;
  setUserId: (id:string)=>void;
}

const useMoodStore = create<MoodState>()(
    persist(

        (set) => ({
      mood: null,
      setMood: (s) => set({ mood: s }),
      userId:null,
      setUserId: (id)=>set({userId:id})
    }),{
        name:"mood-store",
              skipHydration: true,

    }
    )
)

export default useMoodStore