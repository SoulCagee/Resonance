import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  // 1. 安全地解构 opts，提供默认值
  const { req = {} as Request, resHeaders = new Headers() } = opts || {};

  // 2. 安全地获取认证信息，添加错误捕获
  let userId: string | null = null;
  let orgId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult.userId || null;
    orgId = authResult.orgId || null;
  } catch (error) {
    // 认证失败时，记录错误但继续执行，返回 null 值
    console.error('Failed to authenticate in createTRPCContext:', error);
  }

  // 3. 始终返回一个结构完整的上下文对象
  return {
    userId,
    orgId,
    headers: req.headers || new Headers(),
    _resHeaders: resHeaders,
  };
};

// 初始化 tRPC，指定上下文类型
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// 基础路由和过程助手
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// 认证过程
export const authProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const orgProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (!ctx.orgId) {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Organization required' 
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      orgId: ctx.orgId,
    },
  });
});

// 在 init.ts 中，添加以下过程
export const optionalOrgProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // 不强制认证，但将可用的认证信息（可能为null）传递给上下文
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId || null,
      orgId: ctx.orgId || null,
    },
  });
});

