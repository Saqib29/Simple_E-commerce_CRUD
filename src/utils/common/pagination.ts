import { SelectQueryBuilder } from "typeorm";


export function paginate<T> (
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number,
): Promise<T[]> {
    return queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
}