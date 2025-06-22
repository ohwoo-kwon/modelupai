import { useSearchParams } from "react-router";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface CustomPagination {
  totalPages: number;
}

export default function CustomPagination({ totalPages }: CustomPagination) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const onClick = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          {page === 1 ? null : (
            <>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${page - 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onClick(page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={`?page=${page - 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onClick(page - 1);
                  }}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationLink
              href={`?page=${page}`}
              isActive
              onClick={(event) => {
                event.preventDefault();
                onClick(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {page === totalPages ? null : (
            <>
              <PaginationItem>
                <PaginationLink
                  href={`?page=${page + 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onClick(page + 1);
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                {page + 1 === totalPages ? null : <PaginationEllipsis />}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`?page=${page + 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onClick(page + 1);
                  }}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
