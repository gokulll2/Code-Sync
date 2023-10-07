import React from 'react'
import {v4 as uuidV4} from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const Home = () => {
    const navigate = useNavigate();
    const[roomId,setroomId] = React.useState("");
    const[userName,setUsername] = React.useState("")
    const createNewRoom = (event) =>{
        event.preventDefault();
        const id = uuidV4();
        console.log(id);
        setroomId(id);
        toast.success('Created a new room')
    }

    const joinRoom  = ()=>{
        if(!roomId || !userName)
        {
            toast.error('Room ID and Username is required');
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{
                userName, 
            }
        })
    }
    const handleInputEnter = (e)=>{
        // console.log("event",e.key);
        if(e.key==='Enter')
        {
            joinRoom();
        }
    }
  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className='homePageLogo' src='/code-sync.png' alt="code-sync-logo"/> 
            <h4 className='mainLabel'>Paste Invitation ROOM ID</h4>
            <div className='inputGroup'>
                <input
                type='text'
                className='inputBox'
                placeholder='ROOM ID'
                onChange={(e)=>setroomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}/>
                 <input
                type='text'
                className='inputBox'
                placeholder='USERNAME'
                onChange={(e)=>setUsername(e.target.value)}
                value={userName}
                onKeyUp={handleInputEnter}/>
                <button onClick={joinRoom} className='btn joinBtn'> Join </button>
                <span className='createInfo'>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4 className='footer'>
                Contact me - 
                <a href='' className=''> Mail </a>
            </h4>
        </footer>
    </div>
  )
}
