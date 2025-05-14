import { BellIcon } from 'lucide-react';

type NotificationBellProps = {
  hasUnread?: boolean;
  onClick?: () => void;
};

export default function NotificationBell({ hasUnread = false, onClick }: NotificationBellProps) {
  return (
    <button
      className="relative rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
      onClick={onClick}
      aria-label="Notifications"
    >
      <BellIcon className="w-5 h-5" />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}