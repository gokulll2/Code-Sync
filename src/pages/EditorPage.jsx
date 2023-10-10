import React, { useRef } from 'react'
import Client from '../components/Client';
import  {Editor} from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
export const EditorPage = () => {

    const socketRef = useRef(null);

    const codeRef = useRef(null);

    const location = useLocation();
    
    const { roomId } = useParams(); //useParams hook to fetch the roomId from the url.

    const reactNavigator = useNavigate();

    const[clients,setClients] = React.useState([]);

    React.useEffect(() =>{
        const init  = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect error ' , (err) => handleErrors(err));
            socketRef.current.on('connect_failed' , (err)=> handleErrors(err));



            function handleErrors(e){
                console.log('socket error' , e);
                toast.error('Socket conncetion failed , try again later');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN , {
                roomId , 
                username: location.state?.userName,

            });

            //Listening for joined event
            socketRef.current.on
            (ACTIONS.JOINED , 
            ({clients , username , socketId,})=>{
                if(username !== location.state?.userName)
                {
                    toast.success(`${username} joined the room.`)
                    console.log(`${username} joined`);
                }
                console.log("clients:" , clients);
                console.log("username:",username);
                setClients(clients);
            })

        }
        init();
    },[]);

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
