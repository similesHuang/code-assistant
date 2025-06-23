
import { LiveEditor, LiveError, LiveProvider } from "react-live";

const CodeEditor:React.FC<{code:string,setCode:(value:string)=>void}> = ({
      code,
      setCode
}) => {
     return (
  <LiveProvider code={code} noInline>
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <LiveEditor onChange={(value)=>{
           setCode(value);
        }} />
        <LiveError style={{ color: "red" }} />
      </div>
    </div>
  </LiveProvider>)
};
export default CodeEditor;
