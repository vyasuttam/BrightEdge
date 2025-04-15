import { Link } from 'react-router-dom';
import {
  FaClock,
  FaQuestionCircle,
  FaCheckCircle,
  FaPlayCircle,
  FaCalendarAlt,
  FaSignInAlt,
} from 'react-icons/fa';

export const ExamCard = ({
  exam,
  user,
  status,
  formatDateTime,
  isEnrolled,
  showAction,
  handleEnroll = () => {},
  location = 'dashboard', // default location
}) => {

    console.log(user)

  return (
    <div
      key={exam._id}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-lg transition"
    >
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">{exam.exam_name}</h2>
        <p className="text-sm text-gray-600">{exam.exam_description}</p>

        <div className="text-sm text-gray-700 flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-blue-600" />
            <span>{formatDateTime(exam.exam_start_time)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-500" />
            <span>{exam.exam_duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FaQuestionCircle className="text-gray-500" />
            <span>{exam.total_questions} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-600" />
            <span>{exam.passing_marks} Marks</span>
          </div>
        </div>{user && (
  <div className="mt-2 text-sm text-gray-600">
    <div>
      <span className="font-medium text-gray-700">Exam By:</span> {user.full_name}
    </div>
    <div>
      <span className="font-medium text-gray-700">Email:</span> {user.email}
    </div>
  </div> )}
        
      </div>

      {/* ACTION AREA */}
      <div className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto">
  {location === 'dashboard' && (
    <>
      {status === 'pending' && (
        <button className="bg-yellow-500 text-white px-4 py-2 rounded text-sm" disabled>
          Upcoming
        </button>
      )}
      {status === 'login' && (
        <Link
          to={`/exams/${exam._id}/login`}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
        >
          <FaSignInAlt className="text-white" />
          Login
        </Link>
      )}
      {status === 'started' && (
        <Link
          to={`/exams/${exam._id}/examQuestions`}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          <FaPlayCircle className="text-white" />
          Start
        </Link>
      )}
      {status === 'completed' && (
        <Link to={`/exams/${exam._id}/examResult`}>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
            Certificate
          </button>
        </Link>
      )}
    </>
  )}

  {location === 'examsPage' && showAction && (
    <>
      {isEnrolled ? (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded text-sm cursor-default"
          disabled
        >
          Enrolled
        </button>
      ) : (
        <button
          onClick={() => handleEnroll(exam._id)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
        >
          Enroll
        </button>
      )}
    </>
  )}
</div>
    </div>
  );
};
