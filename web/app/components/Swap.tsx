/** Text that slides up and is replaced by a copy on hover; put it inside a link. */
export function Swap({ children }: { children: string }) {
  return (
    <span className="swap">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
