import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./work";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getById = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      return null;
    }

    return project;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("projects", {
      userId,
      name: args.name,
      description: args.description,
      color: args.color,
      startDate: args.startDate,
      dueDate: args.dueDate,
    });
  },
});

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      throw new ConvexError("Project not found");
    }

    const patch: {
      name?: string;
      description?: string;
      color?: string;
      startDate?: string;
      dueDate?: string;
    } = {};

    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;
    if (args.color !== undefined) patch.color = args.color;
    if (args.startDate !== undefined) patch.startDate = args.startDate;
    if (args.dueDate !== undefined) patch.dueDate = args.dueDate;

    if (Object.keys(patch).length === 0) {
      throw new ConvexError("No fields to update");
    }

    await ctx.db.patch(args.projectId, patch);
    return args.projectId;
  },
});

export const remove = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      throw new ConvexError("Project not found");
    }

    // Optionally remove project from tasks before deleting the project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const task of tasks) {
      if (task.projectId === args.projectId) {
        await ctx.db.patch(task._id, { projectId: undefined });
      }
    }

    await ctx.db.delete(args.projectId);
    return args.projectId;
  },
});
