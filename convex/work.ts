import { ConvexError, v } from "convex/values";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import { authComponent } from "./auth";
import { dayOfWeek, workMode } from "./schema";

export async function requireUserId(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
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

export const getDayWorked = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("daysWorked")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();
  },
});

export const getRecentDaysWorked = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const limit = args.limit ?? 14;

    return await ctx.db
      .query("daysWorked")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const upsertDayWorked = mutation({
  args: {
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    workMode,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await ctx.db
      .query("daysWorked")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();

    if (existing) {
      let nextStartTime = args.startTime;
      if (existing.startTime <= args.startTime) {
        nextStartTime = existing.startTime;
      }

      if (nextStartTime >= args.endTime) {
        throw new ConvexError("Start time must be before end time");
      }

      await ctx.db.patch(existing._id, {
        startTime: nextStartTime,
        endTime: args.endTime,
        actualEndTime: undefined,
        sessionEndedAt: undefined,
        workMode: args.workMode,
      });
      return existing._id;
    }

    if (args.startTime >= args.endTime) {
      throw new ConvexError("Start time must be before end time");
    }

    return await ctx.db.insert("daysWorked", {
      userId,
      date: args.date,
      startTime: args.startTime,
      endTime: args.endTime,
      actualEndTime: undefined,
      sessionEndedAt: undefined,
      workMode: args.workMode,
    });
  },
});

export const endDayWorked = mutation({
  args: {
    date: v.string(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("daysWorked")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();

    if (!existing) {
      throw new ConvexError("No work session found for this date");
    }

    if (existing.sessionEndedAt) {
      return existing._id;
    }

    if (existing.startTime >= args.endTime) {
      throw new ConvexError("End time must be after start time");
    }

    await ctx.db.patch(existing._id, {
      endTime: args.endTime,
      actualEndTime: args.endTime,
      sessionEndedAt: Date.now(),
    });

    return existing._id;
  },
});

export const deleteDayWorked = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("daysWorked")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();

    if (!existing) {
      return { deleted: false };
    }

    await ctx.db.delete(existing._id);
    return { deleted: true };
  },
});

export const reconcileSessionsOnAppOpen = mutation({
  args: {
    currentDate: v.string(),
    currentTime: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const recent = await ctx.db
      .query("daysWorked")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(31);

    let reconciledCount = 0;

    for (const day of recent) {
      if (day.sessionEndedAt) {
        continue;
      }

      const isPastDate = day.date < args.currentDate;
      const isEndedToday =
        day.date === args.currentDate && day.endTime <= args.currentTime;

      if (!isPastDate && !isEndedToday) {
        continue;
      }

      if (day.startTime >= day.endTime) {
        continue;
      }

      await ctx.db.patch(day._id, {
        actualEndTime: day.endTime,
        sessionEndedAt: Date.now(),
      });
      reconciledCount += 1;
    }

    return { reconciledCount };
  },
});
