import React, { useRef } from 'react';
import Codemirror from "codemirror"
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
export const Editor = (props) => {
    const socketRef = props.socketRef;
    const roomId = props.roomId;
    const editorRef = useRef(null);
    React.useEffect(()=>{
        async function init(){
              editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: { name: 'javascript' , json:true },
                theme: 'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            });
            // socketRef.current.on(ACTIONS.CODE_CHANGE,({code}) => { 
            //   if(code!== null)
            //   {
            //     editorRef.current.setValue(code)
            //   }
            //   // else{
            //   //   editorRef.current.setValue(`console.log('hello');`)
            //   // }
            // })
            editorRef.current.on('change',(instance,changes)=>{
              console.log("changes",changes);
              const {origin} = changes;
              const code = instance.getValue();

              if(origin!=='setValue')
              {
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                  roomId,
                  code,
                })
              }
              console.log(code);
            });
            // editorRef.current.setValue(`console.log('Hello')`)
            // return ()=>{
            //     editor.toTextArea();
            // };
        }
        init();
    }, []);
    React.useEffect(()=>{
      if(socketRef.current)
      {
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
          if(code !== null)
          {
            editorRef.current.setValue(code);
          }
        })
      }
    },[socketRef.current])
  return (
    <div>
         <textarea id='realtimeEditor'></textarea>
    </div>
  )
}
