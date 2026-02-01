const EmptyState = ({ message, icon }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-5xl mb-4">{icon || '📭'}</div>
      <p className="text-gray-500">{message || 'Nothing to show here'}</p>
    </div>
  );
};

export default EmptyState;
