
import { LiveEditor, LiveError, LiveProvider } from "react-live";

const CodeEditor:React.FC<{code:string}> = ({
      code=`const app=()=>{
      return <div>
           <h1>Hello, World!</h1>
           <p>This is a simple code editor component.</p>
      </div>;
}`
}) => {
     return (
  <LiveProvider code={code} noInline>
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <LiveEditor />
        <LiveError style={{ color: "red" }} />
      </div>
    </div>
  </LiveProvider>)
};
export default CodeEditor;
