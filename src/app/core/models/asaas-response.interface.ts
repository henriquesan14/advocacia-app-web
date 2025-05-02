export interface AsaasResponse<T> {
    object: string;
    hasMore: boolean;
    totalCount: number;
    limit: number;
    offset: number;
    data: T[];
}