import Chat from "../components/Chat"


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

//received roomId.  get it's participants + moods. 


  return <div className="w-full min-h-screen bg-[#0196ed]  flex flex-col"
   style={{
   
  }}>

  <Chat id={id}/>
  </div>
}