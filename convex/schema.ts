import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    mood: v.string(),
  }),

  chatRoom: defineTable({
  }),
  waitingQue: defineTable({
    userId:v.id("users") ,
    mood:v.string()
  }).index("mood",["mood"]),
  messages:defineTable({
   message: v.string(),
   userId: v.id("users"),
   roomId: v.id("chatRoom") 
  }).index("roomId",["roomId"]),
  participants: defineTable({
    userId: v.id("users"),
    roomId: v.id("chatRoom")
  }).index("userId",["userId"])
  .index("roomId",["roomId"])
});