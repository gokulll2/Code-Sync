import React from 'react';
import Codemirror from "codemirror"
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
export const Editor = () => {
    React.useEffect(()=>{
        async function init(){
           const editor =  Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: { name: 'javascript' , json:true },
                theme: 'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            });
            return ()=>{
                editor.toTextArea();
            };
        }
        init();
    }, []);
  return (
    <div>
         <textarea id='realtimeEditor'></textarea>
    </div>
  )
}
