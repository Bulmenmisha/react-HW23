import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, resetState } from '../features/auth/authSlice.js';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  // после успешного входа — на страницу профиля
  useEffect(() => {
    if (isSuccess && token) navigate('/profile');
  }, [isSuccess, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="card">
      <h1>Вход</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      {isError && <p className="message error">{message}</p>}
    </div>
  );
}

export default Login;
