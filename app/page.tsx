import { BilibiliFilled } from '@ant-design/icons';
import ChatBot from './components/ChatBot';



export default function Home() {
  return (
    <div className='w-full flex-col flex justify-center items-center'>
       <header className='flex items-center justify-between p-4 bg-white shadow-md h-16 w-full'>
           <div >
             <BilibiliFilled style={{fontSize:20,color:'rgb(22 93 255)'}}/>
             <span className='text-[20px] pl-[12px]'>代码生成助手</span>
           </div>
       </header>
       <ChatBot></ChatBot>
    </div>
  );
}
