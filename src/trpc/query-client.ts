import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 保持合理的缓存时间
      },
      dehydrate: {
        serializeData: superjson.serialize, // 使用 superjson 处理复杂数据类型[1](@ref)
        shouldDehydrateQuery: (query) => {
          // 核心修改：只脱水状态为 'success' 的查询
          return defaultShouldDehydrateQuery(query) && query.state.status === 'success';
        },
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
