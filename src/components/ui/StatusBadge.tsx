interface StatusBadgeProps {
  status: string;
  statusColor: string;
}

const StatusBadge = ({ status, statusColor }: StatusBadgeProps) => (
  <div className={`mt-3 text-sm font-semibold ${statusColor}`}>
    {status}
  </div>
);

export default StatusBadge;
