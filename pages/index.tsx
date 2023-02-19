import Head from "next/head";
import IssuesList from "@/src/components/IssuesList/IssuesList";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: cache,
  headers: {
    authorization: `Bearer YOUR_GITHUB_TOKEN_HERE`
  }
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Issues List</title>
      </Head>
      <main className="main">
        <IssuesList />
      </main>
    </ApolloProvider>
  )
}
