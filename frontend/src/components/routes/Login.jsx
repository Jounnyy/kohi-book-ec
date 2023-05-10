import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgLogin from '../assets/img_login.png';
import './style/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [changePassword, setChangePassoword] = useState(true);
  const [isNotFound, setIsNotFound] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: ""
  });
  const changeIcon = changePassword === true ? false : true;
  
  async function loginHandler(e){
    e.preventDefault();
    const { email, password } = values;

    try {
      await axios.post('http://localhost:5000/login',{
        email: email,
        password: password
      })
      .then(res => {
        navigate('/dashboard');
        return res.data['result'];
      })
      .catch(err => setIsNotFound(err.message));
    } catch (err) {
      console.error(err.message);
    }
  }

  function changeHandler(e){
    setValues({...values, [e.target.name]: e.target.value});
  }

  return (
    <>
      <section className='full__screen'>
        <div className="dark-screen">
            <div className="content-login">
                <div className="left__content-login">
                    <div className="title__login">
                        <h1>Login</h1>
                        <p>Please insert you're email and password!</p>
                    </div>
                    <span className='err__msg'>{isNotFound === "Request failed with status code 404" ? (<p>{isNotFound}</p>) : ""}</span>
                    <form className='form__login' onSubmit={loginHandler}>    
                        <input 
                            type="email" 
                            name='email'
                            placeholder='Jhon@gmail.com' 
                            className='i__login' 
                            onChange={changeHandler}
                        />
                        <div className="password">
                          <input 
                              type={changePassword ? "password" : "text"} 
                              name='password'
                              placeholder='********' 
                              className='i__login' 
                              onChange={changeHandler}
                          />
                          <span 
                            className="icon"
                            onClick={() => setChangePassoword(changeIcon)}
                          >
                            {changeIcon ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </span>
                        </div>
                        <div className="bottom__form">
                          <p>Do you don't have a account? <a href='/register'>register here!</a></p>
                          <input 
                              type="submit"
                              className='btn btn-submit' 
                          />
                        </div>
                    </form>
                </div>  
                <div className="right__content-login">
                  <img src={imgLogin} alt="img login" className='img-login' />
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Login
