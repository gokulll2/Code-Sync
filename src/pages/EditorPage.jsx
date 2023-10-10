import React, { useRef } from 'react'
import Client from '../components/Client';
import  {Editor} from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
export const EditorPage = () => {

    const socketRef = useRef(null);

    const location = useLocation();
    
    const { roomId } = useParams(); //useParams hook to fetch the roomId from the url.

    const reactNavigator = useNavigate();

    React.useEffect(() =>{
        const init  = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect failed ' , (err) => handleErrors(err));
            socketRef.current.on('connect_failed' , (err)=> handleErrors(err));



            function handleErrors(e){
                console.log('socket error' , e);
                toast.error('Socket conncetion failed , try again later');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN , {
                roomId , 
                username: location.state?.username,

            });

            //Listening for joined event
            socketRef.current.on(ACTIONS.JOINED , ({clients , username , socketId,})=>{
                if(username !== location.state?.username)
                {
                    toast.success(`${username} joined the room.`)
                    console.log(`${username} joined`);
                }
            })

        }
        init();
    },[])
    
    const[clients,setClients] = React.useState([
                                {socketId:1 , username:"Rakesh K"},
                                {socketId:2 , username:"Gokul"},
                                {socketId:3 , username:"John Doe"}
                    ]);
   if(!location.state)
   {
    return <Navigate to="/"/>
   }
  return (
    <div className='mainWrap'>
        <div className='aside'>
            <div className='asideInner'>
                <div className='logo'>
                    <img 
                    className='logoImage'
                    src='/code-sync.png' 
                    alt='code-sync-png'/>
                </div>
                <h3>Connected</h3>
                <div className='clientsList'>
                    {clients.map((client) => (
                        <Client 
                        key={client.socketId}
                        username={client.username}
                        />
                    ))}
                </div>
            </div>
            <button className='btn copyBtn'>Copy ROOM ID</button>
            <button className='btn leaveBtn'>Leave</button>
        </div>
        <div className='editorWrap'>
           <Editor/>
        </div>
    </div>
  )
}
