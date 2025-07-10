export function paginate(totalItems: number, limit: number, page: number) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
