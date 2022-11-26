import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import paginationLimits from '../Data/paginationLimits';
import { useCustomPagination } from '../CustomHooks/useCustomPagination';

function CustomPagination(props) {
    const customPaginationControl = useCustomPagination(props.elementsCount, props.elementsPerPage);
    const [activePage, setActivePage] = useState(1);

    const handlePageChange = async (event, page) => {
        props.setNewOffset((page-1) * paginationLimits.pendingTitleContractsLimit);
        await props.getNewElements();
        setActivePage(page);
    }

    return (
        <Pagination
            count={Number(props.elementsCount)}
            size="large"
            page={activePage}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
        />
    );
}

export default CustomPagination;