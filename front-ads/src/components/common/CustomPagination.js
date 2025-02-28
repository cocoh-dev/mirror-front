import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 번호
 * @param {number} props.totalItems - 전체 아이템 수
 * @param {number} props.itemsPerPage - 페이지당 아이템 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러 함수
 * @param {number} [props.maxVisiblePages=5] - 화면에 표시할 최대 페이지 수
 * @param {boolean} [props.showItemCount=true] - 아이템 카운트 표시 여부
 * @param {string} [props.className=""] - 추가 CSS 클래스
 */
const CustomPagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  maxVisiblePages = 5,
  showItemCount = true,
  className = ""
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 표시할 페이지 번호들을 계산하는 함수
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // 표시할 페이지 범위 계산
    let startPage;
    let endPage;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 maxVisiblePages 이하면 모든 페이지 표시
      startPage = 1;
      endPage = totalPages;
    } else {
      // 현재 페이지 중심으로 표시할 페이지 계산
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // 현재 페이지가 앞쪽에 있는 경우
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // 현재 페이지가 뒤쪽에 있는 경우
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // 현재 페이지가 중간에 있는 경우
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }
    
    // 페이지 번호 배열 생성
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return { pageNumbers, showFirstEllipsis: startPage > 1, showLastEllipsis: endPage < totalPages };
  };
  
  const { pageNumbers, showFirstEllipsis, showLastEllipsis } = getPageNumbers();
  
  // 페이지가 1개 이하면 페이지네이션 표시하지 않음
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between p-4 gap-4 ${className}`}>
      {showItemCount && (
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 ? 
            `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}` 
            : 'No results'}
        </div>
      )}
      
      <Pagination className={`mx-auto ${showItemCount ? "sm:ml-auto sm:mr-0" : ""}`}>
        <PaginationContent>
          {/* 이전 페이지 버튼 */}
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {/* 첫 페이지 및 첫 번째 생략 부호 */}
          {showFirstEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          
          {/* 페이지 번호들 */}
          {pageNumbers.map(pageNumber => (
            <PaginationItem key={pageNumber}>
              <PaginationLink 
                isActive={currentPage === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {/* 마지막 생략 부호 및 마지막 페이지 */}
          {showLastEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          {/* 다음 페이지 버튼 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;