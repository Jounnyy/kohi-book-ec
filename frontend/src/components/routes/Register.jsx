import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { BsDownload } from 'react-icons/bs';
import imgRegister from '../assets/img_register.png';
import '../style/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [changePassword, setChangePassoword] = React.useState(true);
  const [isNotFound, setIsNotFound] = React.useState("");
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: "",
    confPassword: "", 
    role: "user",
  });
  const [file, setFile] = React.useState("");
  const [preview, setPreview] = React.useState("");
  
  const changeIcon = changePassword === true ? false : true;

  // function validatePassword(pass) {
  //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  //   return regex.test(pass)
  // }

  function loadPhoto(e) {
    const img = e.target.files[0];
    setFile(img);
    setPreview(URL.createObjectURL(img));
  }
  
  async function loginHandler(e){
    e.preventDefault();
    const { name, email, password, confPassword, role } = values;

    try {
      await axios.post('http://localhost:5000/user',{
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
        file: file,
        role: role
      },{
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(({data}) => {
        navigate('/')
        return data['result'];
      })
      .catch(err => {
        console.error(err);
        console.log(err.message)
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  function changeHandler(e){
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <section className='full__screen'>
        <div className="dark-screen">
            <div className="content-register">
                <div className="left__content-register">
                  <img src={imgRegister} alt="img register" className='img-register' />
                </div>  
                <div className="right__content-register">
                    <div className="title__register">
                        <h1>Register</h1>
                        <p>Please insert you’re data in this table!!</p>
                    </div>
                    <span className='err__msg'>{isNotFound === "Request failed with status code 404" ? (<p>{isNotFound}</p>) : ""}</span>
                    <form className='form__register' onSubmit={loginHandler}>    
                        <input 
                            type="text" 
                            name='name'
                            placeholder='JhonLBF' 
                            className='i__register' 
                            onChange={changeHandler}
                        />
                        <input 
                            type="email" 
                            name='email'
                            placeholder='Jhon@gmail.com' 
                            className='i__register' 
                            onChange={changeHandler}
                        />
                        <div className="password">
                          <input 
                              type={changePassword ? "password" : "text"} 
                              name='password'
                              placeholder='Password' 
                              className='i__register' 
                              onChange={changeHandler}
                          />
                          <span 
                            className="icon"
                            onClick={() => setChangePassoword(changeIcon)}
                          >
                            {changeIcon ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </span>
                        </div>
                        <div className="password">
                          <input 
                              type={changePassword ? "password" : "text"} 
                              name='confPassword'
                              placeholder='Confirm Password' 
                              className='i__register' 
                              onChange={changeHandler}
                          />
                        </div>
                        <div className="btm-choose">
                          <label className='i-file__register'>
                            <span>
                              <BsDownload />
                            </span>
                            <p>Choose File</p>
                            <input 
                                type="file" 
                                name="file"
                                className='i'
                                onChange={e => loadPhoto(e)}
                            />
                          </label>
                          {/* {preview ? (
                            <figure className="image is-128x128">
                                <img src={preview} alt="preview image" />
                            </figure>
                        ):("")} */}
                          <select name="role"className="options" onChange={changeHandler}>
                          <option value="">Role</option>
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                          </select>
                        </div>
                        <div className="bottom__form-register">
                          <p>Do you already have an account? <a href='/'>Login here!</a></p>
                          <input 
                              type="submit"
                              className='btn btn-submit' 
                          />
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Register
