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

export const workMode = v.union(
  v.literal("Deep"),
  v.literal("Creative"),
  v.literal("Normal"),
);

export const taskStatus = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("done"),
);

export default defineSchema({
  userMeta: defineTable({
    userId: v.string(),
    onboardingCompletedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

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

  daysWorked: defineTable({
    userId: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    actualEndTime: v.optional(v.string()),
    sessionEndedAt: v.optional(v.number()),
    workMode,
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),

  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: taskStatus,
    projectId: v.optional(v.id("projects")),
    time: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId", "status"],
    }),
});
