export interface Author {
  login: string;
}

export interface Node {
  url: string;
  title: string;
  state: "OPEN" | "CLOSED";
  createdAt: Date;
  number: number;
  author: Author
}

interface IssueEdge {
  node: Node;
}

export interface IssuesListData {
  repository: {
    issues: {
      edges: IssueEdge[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

export interface IssuesListVariables {
  cursor?: string | null;
  state: "OPEN" | "CLOSED";
}