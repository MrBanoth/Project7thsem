export function buildQueryOptions(query) {
  // Pagination
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;

  // Sorting (e.g., ?sort=price,-createdAt)
  let sort = undefined;
  if (query.sort) {
    const fields = String(query.sort)
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
      .join(' ');
    sort = fields;
  } else {
    sort = '-createdAt';
  }

  // Filtering: pass through known fields; remove pagination/sort keys
  const { page: _p, limit: _l, sort: _s, ...filters } = query;

  return { page, limit, skip, sort, filters };
}


