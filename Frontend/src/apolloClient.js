import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000', // 确保这个 URI 与您的 GraphQL 服务器地址匹配
  cache: new InMemoryCache()
});

export default client;
