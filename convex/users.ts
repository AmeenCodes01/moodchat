import { v } from "convex/values";
import { query,mutation } from "./_generated/server";

export const create = mutation({
  args: {mood:v.string()},
  handler: async (ctx,args) => {
    return await ctx.db.insert("users",{mood:args.mood});
  },
});


export const addMood = mutation({
  args: {
    userId: v.id("users"),
    mood:v.string()
  },
  handler: async (ctx,{userId,mood}) => {
    return await ctx.db.patch(userId,{mood})
  },
});