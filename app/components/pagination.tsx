interface PaginationProps {
    totalPage: number;
    page: number;
    children: React.ReactNode;
    setPage: (page: number) => void;
    fetchData: (page: number) => void;
}

export default function Pagination({ 
    totalPage, 
    page,
    children,
    setPage, 
    fetchData 
}: PaginationProps ) {
    // pagination btn
    const handlePreviousPage = () => {
        if (page > 1) {
            const newPrePage = page - 1;
            setPage(newPrePage);
            fetchData(newPrePage);
        }
    }

    const handleNextPage = () => {
        if (page < totalPage) {
            const newNextPage = page + 1;
            setPage(newNextPage);
            fetchData(newNextPage);
        }
    }

  return (
    <>
        {/* pagination */}
        <div className="flex justify-end gap-2 mt-5">
            <button className="prev-page" onClick={handlePreviousPage}>
                <i className="fa-solid fa-chevron-left"></i>
            </button>
                {children}
            <button className="next-page" onClick={handleNextPage}>
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </>
  );
}