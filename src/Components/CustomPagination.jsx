import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { useCustomPagination } from '../CustomHooks/useCustomPagination';

function CustomPagination(props) {
    const customPaginationControl = useCustomPagination(props.elementsCount, props.elementsPerPage);
    const [activePage, setActivePage] = useState(1);

    const handlePageChange = async (event, page) => {
        await props.setNewOffset((page-1) * props.elementsPerPage);
        await props.getNewElements();
        setActivePage(page);
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