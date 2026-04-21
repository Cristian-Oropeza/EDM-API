interface AlertProps {
  type: 'error' | 'warning' | 'success';
  messages: string | string[];
  onClose?: () => void;
}

const STYLES = {
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
} as const;

export default function Alert({ type, messages, onClose }: AlertProps) {
  const list = Array.isArray(messages) ? messages : [messages];

  if (list.length === 0 || list.every((m) => !m)) return null;

  return (
    <div
      className={`border rounded-lg px-4 py-3 text-sm space-y-1 relative ${STYLES[type]}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
      <div className={onClose ? 'pr-6' : ''}>
        {list.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}