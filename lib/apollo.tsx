import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import Head from 'next/head';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';

export function withApollo(PageComponent: NextPage): any {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: ApolloClient<NormalizedCacheObject>;
    pageProps: string[];
  }) => {
    const client = apolloClient || initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...(pageProps as any)} />
      </ApolloProvider>
    );
  };

  WithApollo.getInitialProps = async (ctx: any) => {
    const { AppTree } = ctx;
    const apolloClient = (ctx.apolloClient = initApolloClient());

    let pageProps = {};
    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx);
    }

    // If on server
    if (typeof window === 'undefined') {
      if (ctx.res && ctx.res.finished) {
        return pageProps;
      }

      try {
        const { getDataFromTree } = await import('@apollo/react-ssr');
        await getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              apolloClient,
            }}
          />
        );
      } catch (e) {
        console.error(e);
      }
      Head.rewind();
    }

    const apolloState = apolloClient.cache.extract();
    return {
      ...pageProps,
      apolloState,
    };
  };

  return WithApollo;
}

const initApolloClient = (initialState = {}) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const url = isDev ? 'http://localhost:3000' : 'https://usethis.dev';

  const ssrMode = typeof window === 'undefined';
  const link = createHttpLink({
    uri: `${url}/api/graphql`,
    fetch,
  });
  const cache = new InMemoryCache().restore(initialState);

  const client = new ApolloClient({
    ssrMode,
    link,
    cache,
  });

  return client;
};
