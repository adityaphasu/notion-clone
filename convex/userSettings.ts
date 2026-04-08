import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return settings;
  },
});

export const updateUserSettings = mutation({
  args: {
    editorFont: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingUserSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingUserSettings) {
      await ctx.db.patch(existingUserSettings._id, {
        ...args,
      });
    } else {
      await ctx.db.insert("userSettings", {
        userId,
        ...args,
      });
    }
  },
});
