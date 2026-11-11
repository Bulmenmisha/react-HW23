import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice.js';

function Profile() {
  // ДЗ 23: dispatch и navigate для кнопки Logout
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const tokenData = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    dispatch(logout()); // удаляет токен из localStorage и очищает state
    navigate('/login'); // редирект на страницу авторизации
  };

  if (!tokenData) {
    return (
      <div className="card">
        <h1>Профиль</h1>
        <p>Login into account</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Профиль</h1>
      <p>
        <strong>ID пользователя:</strong> {tokenData.user.id}
      </p>
      <p className="muted">
        Токен действует до {new Date(tokenData.exp * 1000).toLocaleTimeString()}
      </p>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
