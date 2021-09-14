export function nestQueries(
  path,
  nestedQueries,
  operator = 'filter',
) {
  if (!nestedQueries || nestedQueries.length === 0) return [];
  return [
    {
      nested: {
        path,
        query: {
          bool: {
            [operator]: [...nestedQueries],
          },
        },
      },
    },
  ];
}
