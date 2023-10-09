import React from 'react'
import Client from '../components/Client';
import  {Editor} from '../components/Editor';
export const EditorPage = () => {
    const[clients,setClients] = React.useState([
                                {socketId:1 , username:"Rakesh K"},
                                {socketId:2 , username:"Gokul"},
                                {socketId:3 , username:"John Doe"}
                    ]);
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
