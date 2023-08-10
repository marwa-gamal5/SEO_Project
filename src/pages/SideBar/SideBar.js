import React from 'react';
import styles from './SideBar.module.css'
import { useNavigate } from 'react-router-dom';
const SideBar = () => {
  
    
  
    
    const navigate = useNavigate()

    const handleSettingsClick = () => {
      
      navigate('/ViewAllSettings');
    };
    const handleURLsClick = () =>{
      navigate('/ViewAllUrl');
    };
    const handleTitlesClick =()=>{
      navigate('/ViewAllTitles');
    }
    const handleMetaClick =()=>{
      navigate('/ViewAllMeta');
    }
  return (
    <>
    <div className={`${styles.container}`}>
    <div className={`${styles.sidebar}`}>
      <ul className="list-group">
      <li className="list-group-item" onClick={handleSettingsClick}>Settings</li>
      <li className="list-group-item" onClick={handleURLsClick}>URLs</li>
      <li className="list-group-item"onClick={handleTitlesClick}>Title</li>
      <li className="list-group-item" onClick={handleMetaClick} >Meta</li>
      </ul>
    </div>
    </div>
    </>
  )
}

export default SideBar;