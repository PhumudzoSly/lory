import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { query, mutation, type QueryCtx, type MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { dayOfWeek } from "./schema";

async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new ConvexError("Not authenticated");
  }
  return user._id;
}

export const getWorkProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const profile = await ctx.db
      .query("workProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return profile;
  },
});

export const upsertWorkProfile = mutation({
  args: {
    occupation: v.string(),
    industry: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("workProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("workProfiles", { userId, ...args });
  },
});

export const getWorkSchedule = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("workSchedule")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const upsertWorkDay = mutation({
  args: {
    dayOfWeek,
    isWorkDay: v.boolean(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    if (args.isWorkDay) {
      if (!args.startTime || !args.endTime) {
        throw new ConvexError("Work days require start and end times");
      }
      if (args.startTime >= args.endTime) {
        throw new ConvexError("Start time must be before end time");
      }
    }

    const existing = await ctx.db
      .query("workSchedule")
      .withIndex("by_user_and_day", (q) =>
        q.eq("userId", userId).eq("dayOfWeek", args.dayOfWeek),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isWorkDay: args.isWorkDay,
        startTime: args.isWorkDay ? args.startTime : undefined,
        endTime: args.isWorkDay ? args.endTime : undefined,
      });
      return existing._id;
    }

    return await ctx.db.insert("workSchedule", {
      userId,
      dayOfWeek: args.dayOfWeek,
      isWorkDay: args.isWorkDay,
      startTime: args.isWorkDay ? args.startTime : undefined,
      endTime: args.isWorkDay ? args.endTime : undefined,
    });
  },
});
