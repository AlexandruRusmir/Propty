import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { useCustomPagination } from '../CustomHooks/useCustomPagination';

function CustomPagination(props) {
    const customPaginationControl = useCustomPagination(props.elementsCount, props.elementsPerPage);
    const [activePage, setActivePage] = useState(props.startingPage ?? 1);

    const handlePageChange = async (event, page) => {
        const pageNumber = Math.max(1, page);
        const currentPage = Math.min(pageNumber, Number(props.elementsCount / props.elementsPerPage));
        await props.setNewOffset((currentPage-1) * props.elementsPerPage);
        await props.getNewElements();
        setActivePage(currentPage);
    }

    return (
        <Pagination
            count={Math.ceil(Number(props.elementsCount / props.elementsPerPage))}
            size="large"
            page={activePage}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
        />
    );
}

export default CustomPagination;