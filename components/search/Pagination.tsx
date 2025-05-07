import type { PageInfo } from "apps/commerce/types.ts";
import { createPageLink } from "./SearchResult.tsx";

export function Pagination({ pageInfo, url }: {
  pageInfo: PageInfo;
  url: string;
}) {
  const VTEX_PAGE_LIMIT = 50;
  const { records = 0, recordPerPage = 12, currentPage, nextPage, previousPage } = pageInfo;

  const totalPagesAccordingByTotalResults = Math.ceil(records / recordPerPage);
  const totalPages = totalPagesAccordingByTotalResults > VTEX_PAGE_LIMIT ? VTEX_PAGE_LIMIT : totalPagesAccordingByTotalResults;

  const basePageNumbersList = Array.from({ length: totalPages }).map((_, index) => index + 1);

  let visiblePageNumbers: string[] = [];

  const fiveLastPageNumbers = basePageNumbersList.slice(-5).map((pageNumber) => String(pageNumber));
  const isBetweenTheFiveLastPages = fiveLastPageNumbers.includes(String(currentPage));

  const firstPageNumber = String(basePageNumbersList.at(0));
  const lastPageNumber = String(basePageNumbersList.at(-1));

  if (totalPages <= 8) {
    visiblePageNumbers = basePageNumbersList.map((pageNumber) => String(pageNumber));
  } else if (currentPage < 5) {
    const fiveFirstPageNumbers = basePageNumbersList.slice(0, 5).map((pageNumber) => String(pageNumber));

    visiblePageNumbers = [
      ...fiveFirstPageNumbers,
      '...',
      lastPageNumber
    ];
  } else if (isBetweenTheFiveLastPages) {

    visiblePageNumbers = [
      firstPageNumber,
      '...',
      ...fiveLastPageNumbers
    ];
  } else {
    const previousPage = String(currentPage - 1);
    const nextPage = String(currentPage + 1);

    const treeMiddlePages = [
      previousPage,
      String(currentPage),
      nextPage
    ];

    visiblePageNumbers = [
      firstPageNumber,
      '...',
      ...treeMiddlePages,
      '...',
      lastPageNumber
    ];
  }

  return (
    <div className="flex items-center gap-2">
      {visiblePageNumbers.map((pageNumber) => {
        const isNumber = !Number.isNaN(Number(pageNumber));

        return (
          isNumber
            ? (
              <a className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/90" href={createPageLink(pageNumber, url)}>{pageNumber}</a>
            )
            : (
              <span>{pageNumber}</span>
            )
        );
      })}
    </div>
  );
}
