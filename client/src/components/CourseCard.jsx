import { Link } from 'react-router-dom';

const CourseCard = ({ course, showStatus = false, enrolled = false, progress = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-4xl">📚</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{course.title}</h3>
          {showStatus && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                course.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {course.status}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{course.description}</p>
        {enrolled && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {course.modules?.length || 0} modules
          </span>
          <Link
            to={`/courses/${course._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
