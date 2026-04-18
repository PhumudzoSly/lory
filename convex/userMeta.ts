import { ConvexError } from "convex/values";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import { authComponent } from "./auth";

async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) throw new ConvexError("Not authenticated");
  return user._id;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("userMeta")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("userMeta")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const onboardingCompletedAt = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { onboardingCompletedAt });
      return existing._id;
    }
    return await ctx.db.insert("userMeta", {
      userId,
      onboardingCompletedAt,
    });
  },
});
