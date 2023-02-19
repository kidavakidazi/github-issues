import gql from "graphql-tag";

export const GET_ISSUES = gql`
  query GetIssues($cursor: String, $state: IssueState!) {
    repository(owner: "reactjs", name: "reactjs.org") {
      issues(first: 10, after: $cursor, states: [$state], orderBy: {field: CREATED_AT, direction: DESC}) {
        edges {
          node {
            url
            title
            state
            createdAt
            number
            author {
              login
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;