// Utility functions for the LMS
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(date);
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
}

export function truncate(str, length = 100) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getLevelColor(level) {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getRoleColor(role) {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    case 'trainer':
      return 'bg-teal-100 text-teal-800';
    case 'learner':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
