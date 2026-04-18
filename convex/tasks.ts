import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { taskStatus } from "./schema";
import { requireUserId } from "./work";

export const list = query({
  args: {
    status: v.optional(taskStatus),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    if (args.searchQuery) {
      if (args.status) {
        return await ctx.db
          .query("tasks")
          .withSearchIndex("search_title", (q) =>
            q
              .search("title", args.searchQuery!)
              .eq("userId", userId)
              .eq("status", args.status!),
          )
          .collect();
      }
      return await ctx.db
        .query("tasks")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.searchQuery!).eq("userId", userId),
        )
        .collect();
    }

    if (args.status) {
      return await ctx.db
        .query("tasks")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", userId).eq("status", args.status!),
        )
        .collect();
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getById = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const task = await ctx.db.get(args.taskId);

    if (!task || task.userId !== userId) {
      return null;
    }

    return task;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(taskStatus),
    projectId: v.optional(v.id("projects")),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("tasks", {
      userId,
      title: args.title,
      description: args.description,
      status: args.status ?? "todo",
      projectId: args.projectId,
      time: args.time,
    });
  },
});

export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(taskStatus),
    projectId: v.optional(v.id("projects")),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const task = await ctx.db.get(args.taskId);

    if (!task || task.userId !== userId) {
      throw new ConvexError("Task not found");
    }

    const patch: {
      title?: string;
      description?: string;
      status?: "todo" | "in_progress" | "done";
      projectId?: string;
      time?: string;
    } = {};

    if (args.title !== undefined) patch.title = args.title;
    if (args.description !== undefined) patch.description = args.description;
    if (args.status !== undefined) patch.status = args.status;
    if (args.projectId !== undefined) patch.projectId = args.projectId;
    if (args.time !== undefined) patch.time = args.time;

    if (Object.keys(patch).length === 0) {
      throw new ConvexError("No fields to update");
    }

    await ctx.db.patch(args.taskId, patch);
    return args.taskId;
  },
});

export const setStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: taskStatus,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const task = await ctx.db.get(args.taskId);

    if (!task || task.userId !== userId) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.patch(args.taskId, {
      status: args.status,
    });

    return args.taskId;
  },
});

export const remove = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const task = await ctx.db.get(args.taskId);

    if (!task || task.userId !== userId) {
      throw new ConvexError("Task not found");
    }

    await ctx.db.delete(args.taskId);
    return args.taskId;
  },
});
