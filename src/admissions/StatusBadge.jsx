import { portalConfig } from './portalConfig';

export default function StatusBadge({ status = 'incomplete' }) {
  const statusMeta =
    portalConfig.statuses[status] || portalConfig.statuses.incomplete;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${statusMeta.tone}`}
    >
      {statusMeta.label}
    </span>
  );
}
