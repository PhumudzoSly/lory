import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const dayOfWeek = v.union(
  v.literal("monday"),
  v.literal("tuesday"),
  v.literal("wednesday"),
  v.literal("thursday"),
  v.literal("friday"),
  v.literal("saturday"),
  v.literal("sunday"),
);

export default defineSchema({
  workProfiles: defineTable({
    userId: v.string(),
    occupation: v.string(),
    industry: v.optional(v.string()),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  workSchedule: defineTable({
    userId: v.string(),
    dayOfWeek,
    isWorkDay: v.boolean(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_day", ["userId", "dayOfWeek"]),
});
