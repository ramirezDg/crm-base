export interface PaginatedResponse<TData> {
    total: number;
    limit: number;
    offset: number;
    results: TData[];
}