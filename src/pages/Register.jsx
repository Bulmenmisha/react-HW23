import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetState } from '../features/auth/authSlice.js';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', password2: '' });
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert('Пароли не совпадают');
      return;
    }
    dispatch(register({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="card">
      <h1>Регистрация</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <input type="password" name="password2" placeholder="Повторите пароль" value={formData.password2} onChange={handleChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
      {isError && <p className="message error">{message}</p>}
      {isSuccess && <p className="message success">{message}</p>}
    </div>
  );
}

export default Register;
