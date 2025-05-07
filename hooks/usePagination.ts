import { PageInfo } from "apps/commerce/types.ts";

type PaginationProps = Pick<PageInfo, "currentPage" | "recordPerPage" | "records">

export const usePagination = ({ records = 0, recordPerPage = 0, currentPage = 0,  }: PaginationProps): string[] => {
  if (recordPerPage === 0 || records === 0) {
    return ["1"]
  }
  
  const VTEX_PAGE_LIMIT = 50
  const totalPagesAccordingByTotalResults = Math.ceil(records / recordPerPage)
  const totalPages = totalPagesAccordingByTotalResults > VTEX_PAGE_LIMIT ? VTEX_PAGE_LIMIT : totalPagesAccordingByTotalResults

  const basePageNumbersList = Array.from({ length: totalPages }, (_, index) => index + 1)
  
  let visiblePageNumbers: string[] = []

  const fiveLastPageNumbers = basePageNumbersList.slice(-5).map((pageNumber) => String(pageNumber))
  const isBetweenTheFiveLastPages = fiveLastPageNumbers.includes(String(currentPage))

  const firstPageNumber = String(basePageNumbersList.at(0))
  const lastPageNumber = String(basePageNumbersList.at(-1))

  if (totalPages <= 8) {
    visiblePageNumbers = basePageNumbersList.map((pageNumber) => String(pageNumber))
  } else if (currentPage < 5) {
    const fiveFirstPageNumbers = basePageNumbersList.slice(0, 5).map((pageNumber) => String(pageNumber))

    visiblePageNumbers = [
      ...fiveFirstPageNumbers,
      '...',
      lastPageNumber
    ]
  } else if (isBetweenTheFiveLastPages) {

    visiblePageNumbers = [
      firstPageNumber,
      '...',
      ...fiveLastPageNumbers
    ]
  } else {
    const previousPage = String(currentPage - 1)
    const nextPage = String(currentPage + 1)

    const threeMiddlePages = [
      previousPage,
      String(currentPage),
      nextPage
    ]

    visiblePageNumbers = [
      firstPageNumber,
      '...',
      ...threeMiddlePages,
      '...',
      lastPageNumber
    ]
  }

  return visiblePageNumbers
}