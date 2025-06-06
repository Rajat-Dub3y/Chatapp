import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getStreamToken } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';
import toast from 'react-hot-toast';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const {id:targetUserId}=useParams();

  const [chatClient,setChatClient]=useState(null);
  const [channel,setChannel]=useState(null);
  const [loading,setLoading]=useState(true);

  console.log(1)

  const {authUser}=useAuthUser();


  console.log(2)

  const {data:tokenData}=useQuery({
    queryKey:["StreamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser
  })

  console.log(3)

  useEffect(()=>{
    const initChat=async()=>{
      if(!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing stream chat client ...")
        const client=StreamChat.getInstance(STREAM_API_KEY)

        console.log(11)
        await client.connectUser({
          id:authUser._id,
          name:authUser.fullname,
          image:authUser.profilepic
        },tokenData.token)

        console.log(12)
        const channelId=[authUser._id,targetUserId].sort().join("-");

        const currChannel=client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId]
        })

        await currChannel.watch();

        console.log(13)

        setChatClient(client);
        setChannel(currChannel)
        setLoading(false)

      } catch (error) {
        console.log(error)
      }
    }
    initChat()
  },[tokenData,authUser,targetUserId,setChatClient])

  if(loading || !chatClient || !channel) return <ChatLoader/>

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus/>
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage