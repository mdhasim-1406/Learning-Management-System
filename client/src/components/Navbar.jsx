import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isTrainer = user?.role === 'trainer' || isAdmin;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
              >
                L
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600">
                LMS
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              <NavLink to="/dashboard" current={location.pathname}>Dashboard</NavLink>
              <NavLink to="/courses" current={location.pathname}>Courses</NavLink>
              {user?.role === 'learner' && (
                <NavLink to="/my-enrollments" current={location.pathname}>My Learning</NavLink>
              )}
              {isTrainer && (
                <NavLink to="/admin/courses" current={location.pathname}>Manage Courses</NavLink>
              )}
              {isAdmin && (
                <>
                  <NavLink to="/admin/users" current={location.pathname}>Users</NavLink>
                  <NavLink to="/admin/reports" current={location.pathname}>Reports</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-stone-700">
                {user?.name}
              </span>
              <span className="text-xs text-emerald-600 font-medium capitalize bg-emerald-50 px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="text-sm font-medium text-stone-500 hover:text-red-600 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, current }) => {
  const isActive = current === to || current.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
        isActive ? "text-emerald-700 bg-emerald-50" : "text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 mx-4"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Navbar;
