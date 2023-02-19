import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ISSUES } from "../../query/IssuesList.query";
import getIssueOpenedStatus from "../../util/getIssueOpenedStatus";
import { Node, IssuesListData, IssuesListVariables } from "../../types/IssuesList.types";

const IssuesList: React.FC = () => {
  const [state, setState] = useState<"OPEN" | "CLOSED">("OPEN");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { loading, error, data } = useQuery<IssuesListData, IssuesListVariables>(GET_ISSUES, {
    variables: { cursor, state: state },
  });

  useEffect(() => {
    if (data?.repository?.issues) {
      setHasNextPage(data.repository.issues.pageInfo.hasNextPage);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="issue__container">
      <h2 className="issue__title">Github Issues</h2>
      <div className="issue__select-container">
        <label htmlFor="state" className="issue__select-label">Filter by status:</label>
        <select
          id="state"
          className="issue__select"
          value={state}
          onChange={(e) => setState(e.target.value === "OPEN" ? "OPEN" : "CLOSED")}
          data-testid="state"
          aria-label="Filter Issues by status"
        >
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <ul className="issue__list" aria-label="Issues List">
        {data?.repository.issues.edges.map((issue: { node: Node; }) => (
          <li key={issue.node.url} className="issue__list-item">
            <a href={issue.node.url} className="issue__list-link" tabIndex={0}>{issue.node.title}</a>
            <div className="issue__list-item-info">
              #{issue.node.number} {getIssueOpenedStatus(issue.node.createdAt)} by {issue?.node?.author?.login}
            </div>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button
          aria-label="Load More Issues"
          tabIndex={0}
          className="issue__load-more"
          onClick={() =>
            setCursor(data?.repository.issues.pageInfo.endCursor || null)
          }
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default IssuesList;
