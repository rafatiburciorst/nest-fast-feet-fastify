import { PaginationProps } from "src/@types/type-pagination";



export class Pagination {

    private page: number
    private limit: number
    private pageCount: number
    private total: number
    constructor({ page, limit, total }: PaginationProps) {
        this.page = page
        this.limit = limit
        this.pageCount = Math.ceil(total/limit)
        this.total = total
    }

    paginate() {
        return {
            page: this.page,
            perPage: this.limit,
            pageCount: this.pageCount,
            total: this.total
        }
    }
}