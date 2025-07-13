"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import useMoodStore from '@/app/store/useMoodStore'
const mockMessages = [
  {
    _id: "msg1",
    senderName: "AnonymousFox",
    message: "Hey, how's your mood today?",
    sentAt: Date.now() - 60000,
  },
  {
    _id: "msg2",
    senderName: "AnonymousTiger",
    message: "Not great to be honest, kinda anxious.",
    sentAt: Date.now() - 58000,
  },
  {
    _id: "msg3",
    senderName: "AnonymousFox",
    message: "Ah — I get that. Want to talk about it?",
    sentAt: Date.now() - 55000,
  },
  {
    _id: "msg4",
    senderName: "AnonymousTiger",
    message: "Sure… it's just one of those weeks, you know?",
    sentAt: Date.now() - 53000,
  },
  {
    _id: "msg5",
    senderName: "AnonymousFox",
    message: "Yeah, I hear you. Happens to me too sometimes.",
    sentAt: Date.now() - 50000,
  },
];

const names = ["࣪당신은 것입니다","어느날 치유되다"]
function Chat({id}:{id:string}) {

  const userId = useMoodStore(state=>state.userId)
  console.log(userId," userId")
  const messages = useQuery(api.messages.get,{id:id as Id<"chatRoom">});
  const [txt,setTxt]=useState("")
  const sendMsg = useMutation(api.messages.send)

  const chatRoom = useQuery(api.chatRoom.get,{id: id as Id<"chatRoom">})


  const displayName = (userId: string) => {
  const index = chatRoom?.participants.findIndex((user) => user.id === userId);
   console.log(index)
  return index !==undefined && index>-1 ? names[index] : "Anonymous";
};

if(chatRoom?.participants.length==1){
  return (
    <div className='font-mono text-white text-xl p-8'>
      Waiting...
    </div>
  )
}

console.log(chatRoom," userId")
  return (
   <div className="w-full min-h-screen text-white  font-semibold  justify-end  flex flex-col pb-20">
    <div className='flex flex-row gap-3 border-2'>

{chatRoom?.participants.map(u=>

   <span key={u.id} className={`w-[150px] flex flex-col overflow-hidden px-[10px] ${u.id !==userId ? "text-[#1b549d]":""}`}  style={{backgroundColor:u.id !== userId ? "white":"",
      
    }}>
        {displayName(u.id as string) } <span className='flex flex-row gap-2'> {u.mood} {u.id === userId ? "(you)":""}  </span>   
        </span>
)
  
}
    </div>
<div className='p-6  mt-auto  '>
{messages?.map((msg) => (
  <div key={msg._id } className="flex flex-row gap-8">
    <div className={`min-w-[150px]`}>
      <span className={`w-[150px] flex overflow-hidden px-[10px] ${msg.userId !==userId ? "text-[#1b549d]":""}`}  style={{backgroundColor:msg.userId !== userId ? "white":"",
      
    }}>
        {displayName(msg.userId)}
        </span>
      
      </div>
    <div className="w-full text-lg tracking-tight">
      {msg.message.trimStart()}
    </div>
  </div>
))}

</div>



<div className='flex flex-row items-center font-mono gap-2 text-white w-full border-t-2 p-3 '>

 Chat: 
<Input
value={txt} 
  onChange={(e) => setTxt(e.target.value)}
  onKeyDown={async(e) => {
    if (e.key === "Enter") {
     // setMessages(prev=> [...prev,{_id:"msg9",message: txt,senderName:user, sentAt:Date.now()}]);
      setTxt("")
      await sendMsg({roomId:id as Id<"chatRoom">, message: txt, userId: userId as Id<"users">})
    }
  }}
className="border-0 focus-visible:ring-0  rounded-none w-full flex justify-end mt-auto max-w-5xl self-center " 

/>
</div>
  </div>
  )
}

export default Chat