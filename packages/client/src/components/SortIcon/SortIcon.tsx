import { SortableIcon } from '@icons/SortableIcon';

export function SortIcon({
  query,
  value,
}: {
  query: {
    sortDir?: string;
    sortBy?: string;
  };
  value: string;
}) {
  return <SortableIcon dir={query.sortBy !== value ? undefined : query.sortDir} />;

  // return (
  //   <ArrowUpward
  //     color="primary"
  //     sx={{
  //       width: 16,
  //       height: 16,
  //       transition: 'transform 300ms ease-out',
  //       transform: query.sortDir === 'asc' ? 'rotate(180deg)' : 'rotate(0)',
  //     }}
  //   />
  // );
}
