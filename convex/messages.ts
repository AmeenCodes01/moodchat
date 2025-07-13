import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const get = query({
  args: { id: v.id("chatRoom") },
  handler: async (ctx, args) => {
    // send back with moods.
    return  await ctx.db.query("messages").filter(q=>q.eq(q.field("roomId"),args.id)).collect()
  },
});

export const send = mutation({
  args: {roomId: v.id("chatRoom"),userId:v.id("users"), message:v.string() },
  handler: async (ctx, {roomId,userId,message}) => {
    // send back with moods.
    const room =  await ctx.db.insert("messages",{roomId,userId,message})
  },
});

