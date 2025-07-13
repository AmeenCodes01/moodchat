import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAll,
  getOneFrom,
  getManyFrom,
  getManyVia,
} from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

export const oppositeMood: Record<string, string> = {
  happy: "sad",
  sad: "happy",
  angry: "calm",
  calm: "angry",
  anxious: "excited",
  excited: "anxious",
  neutral: "neutral",
};

export const get = query({
  args: { id: v.id("chatRoom") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room) return null;

    // Fetch participant users
    const participantUsers = await getManyFrom(ctx.db,"participants","roomId", room._id)
    const userIds= participantUsers.map(p=>p.userId);
    const users = await getAll(ctx.db, userIds);

    // Build participant info list
    const participants = users.map((user) => ({
      id: user?._id,
      mood: user?.mood,
    }));

    // Return room data with participants’ moods
    return {
      ...room,
      participants,
    };
  },
});

export const createOrJoin = mutation({
  args: {
    userId: v.id("users"),
    mood: v.string(),
  },
  handler: async (ctx, { userId, mood }) => {
    //check if someone with opposite mood waiting, join them. else create

    const oppMood = oppositeMood[mood];
    //array of users with opposite mood
    const oppUsers = await ctx.db
      .query("waitingQue")
      .filter((q) => q.eq(q.field("mood"), oppMood))
      .collect();
    console.log(oppUsers, "oppUsers");

    if (oppUsers.length > 0) {
      const oppUser = oppUsers[Math.floor(Math.random() * oppUsers.length)];

      //gets room matching user is in
      const oppUserInfo = await getOneFrom(
        ctx.db,
        "participants",
        "userId",
        oppUser.userId
      );

      if (oppUserInfo) {
        await ctx.db.insert("participants", {
          userId: userId,
          roomId: oppUserInfo?.roomId,
        });

        //del from waitingQue

        await ctx.db.delete(oppUser._id);
        return oppUserInfo.roomId;
      }
      //can be only in one room
    }

    //need to del prev rooms user is in
    const prevRooms = await getManyFrom(ctx.db,"participants","userId",userId)
  
    await asyncMap(prevRooms,async r=> {
        await ctx.db.delete(r._id)
        //del from participants too
        
    } )
    await ctx.db.insert("waitingQue", { userId, mood });
    
    const roomId =  await ctx.db.insert("chatRoom", {});
    await ctx.db.insert("participants", {userId:userId, roomId})
    return roomId
  },
});

//get otheruser from waitingque
//get otheruser room id
// add user to participants
