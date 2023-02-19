import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import IssuesList from "../src/components/IssuesList/IssuesList";
import getIssueOpenedStatus from "../src/util/getIssueOpenedStatus";

jest.mock("@apollo/client", () => {
  return {
    useQuery: jest.fn().mockReturnValue({
      loading: false,
      error: null,
      data: {
        repository: {
          issues: {
            edges: [
              {
                node: {
                  url: "https://github.com/reactjs/reactjs.org/issues/1",
                  title: "Issue 1",
                  state: "OPEN",
                  createdAt: new Date(),
                  number: 1,
                  author: {
                    login: "author1"
                  }
                }
              },
              {
                node: {
                  url: "https://github.com/reactjs/reactjs.org/issues/2",
                  title: "Issue 2",
                  state: "OPEN",
                  createdAt: new Date(),
                  number: 2,
                  author: {
                    login: "author2"
                  }
                }
              }
            ],
            pageInfo: {
              endCursor: "endCursor",
              hasNextPage: true
            }
          }
        }
      }
    })
  };
});

describe("IssuesList", () => {
  afterEach(cleanup);

  it("renders correctly with open issues", () => {
    const { getByTestId, getByText } = render(<IssuesList />);
    const selectElement = getByTestId("state") as HTMLSelectElement;

    expect(selectElement.value).toBe("OPEN");
    expect(getByText("Issue 1")).toBeInTheDocument();
    expect(getByText("Issue 2")).toBeInTheDocument();
    expect(getByText("Load More")).toBeInTheDocument();
  });

  it("renders correctly with closed issues", () => {
    const { getByTestId, getByText } = render(<IssuesList />);
    const selectElement = getByTestId("state") as HTMLSelectElement;
    fireEvent.change(selectElement, { target: { value: "CLOSED" } });

    expect(selectElement.value).toBe("CLOSED");
    expect(getByText("Issue 1")).toBeInTheDocument();
    expect(getByText("Issue 2")).toBeInTheDocument();
    expect(getByText("Load More")).toBeInTheDocument();
  });

  it("select element should change state", () => {
    const { getByTestId } = render(<IssuesList />);
    const selectElement = getByTestId("state") as HTMLSelectElement;

    fireEvent.change(selectElement, { target: { value: "CLOSED" } });

    expect(selectElement.value).toBe("CLOSED");
  });
});

describe("getIssueOpenedStatus", () => {
  it("should return the correct date when the issue was opened less than 7 days ago", () => {
    const opened = new Date();
    const date = new Date(opened.getTime() - 5 * 24 * 60 * 60 * 1000);
    const status = getIssueOpenedStatus(date);

    expect(status).toEqual("opened 5 days ago");
  });

  it("should return the correct date when the issue was opened between 7 and 13 days ago", () => {
    const opened = new Date();
    const date = new Date(opened.getTime() - 10 * 24 * 60 * 60 * 1000);
    const status = getIssueOpenedStatus(date);

    expect(status).toEqual("opened last week");
  });

  it("should return the correct date when the issue was opened between 14 and 31 days ago", () => {
    const opened = new Date();
    const date = new Date(opened.getTime() - 21 * 24 * 60 * 60 * 1000);
    const status = getIssueOpenedStatus(date);

    expect(status).toEqual("opened 3 weeks ago");
  });

  it("should return the correct date when the issue was opened more than 31 days ago", () => {
    const date = new Date("2022-01-01");
    const status = getIssueOpenedStatus(date);

    expect(status).toEqual(`opened on ${date.toDateString()}`);
  });
});
