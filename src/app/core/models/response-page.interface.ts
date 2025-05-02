export interface ResponsePage<T> {
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    items: T[];
    pageSize: number;
    totalCount: number;
    totalPages: number;
}