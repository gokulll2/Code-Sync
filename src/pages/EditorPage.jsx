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
                // console.log("clients:" , clients);
                // console.log("username:",username);
                setClients(clients);
            });
            
            //Listening for Disconnecting
            socketRef.current.on(ACTIONS.DISCONNECTED,({ socketId , username })=>{
                toast.success(`${username} left the room . `);
                setClients((prev)=>{
                    return prev.filter((client) => client.socketId!==socketId)
                })
            })
        };
        init();
        //cleaning function
        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[]);

   if(!location.state)
   {
    return <Navigate to="/"/>
   }

   async function copyRoomID(){
    try{
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
    }catch(err){
        toast.error('Could not copy the Room ID');
        console.log(err);
    }
   }
   function leaveRoom()
   {
   reactNavigator('/');
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
            <button className='btn copyBtn' onClick={copyRoomID}>Copy ROOM ID</button>
            <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
        </div>
        <div className='editorWrap'>
           <Editor socketRef = {socketRef} roomId={roomId}/>
        </div>
    </div>
  )
}
