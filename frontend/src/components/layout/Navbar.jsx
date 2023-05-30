import * as React from 'react'
import imgNav from '../assets/img_nav.png';
import { useNavigate } from 'react-router-dom';
import { BsSearch, BsCart3 } from 'react-icons/bs';
import { SlSettings } from 'react-icons/sl';
import '../style/navbar.css';
import axios from 'axios';

const Navbar = ({ children }) => {
  const [profiles, setProfiles] = React.useState([]);
  const [notLogin, setNotLogin] = React.useState("");
  const navigate = useNavigate();

  async function getUser() {
    await axios.get('http://localhost:5000/profile', {withCredentials: true})
    .then(({data}) => {
      console.log(data.user)
      setProfiles(data.user);
    }).catch((err) => {
      setNotLogin(err);
      console.error(err);
    })
  }

  function backLoginPage(){
    alert("Please login your account")
    navigate("/")
    window.location.reload();
  }

    React.useEffect(() => {
      getUser();
    }, [])

  return (
    <>
    {notLogin === 401 ? backLoginPage() : (
      <>
          <nav>
            <div className="logo__nav">
                <img src={imgNav} alt="logo nav" />
                <h1 className="title__nav">KOHI <span>BOOK</span></h1>
            </div>
            <div className="search__bar">
                <form className='search__bar-f' action="">
                    <input 
                        type="text"
                        placeholder='Search'
                        className='search__bar-i'
                    />
                    <button type='submit' className='nav-btn '>
                      <BsSearch />
                    </button>
                </form>
            </div>
            <div className="more__infomation">
              <div className="icons">
                <BsCart3 className='icon-nav' />
                <SlSettings className='icon-nav'/>
              </div>
              <div className="wall"> </div>
                <div className="img__user">
                  <h2>{profiles.url}</h2>
                </div>
            </div>
          </nav>          
          {children}
      </>
    )}
    </>
  )
}

export default Navbar
