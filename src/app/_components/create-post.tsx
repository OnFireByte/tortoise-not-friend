"use client";
import { useEffect, useState } from "react";

import { CHAT_MESSAGE_EVENT } from "@/constants/pusher-events";
import { api } from "@/trpc/react";
import { type ChatMessage } from "@/types/pusher";
import { type Channel } from "pusher-js";
import { usePusher } from "../_context/PusherContext";
import { ChatMessage as ChatMessageComponent } from "../chat/components/ChatMessage";

export function ChatShowcase({ withUser }: { withUser: string }) {
  "use client";
  const [posts, setPosts] = useState<ChatMessage[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [queryCursor, setQueryCursor] = useState<number | null>(null);

  const pusher = usePusher();
  let chatChannel: Channel | null = null;

  const { data: user } = api.auth.me.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data) return;
      chatChannel = pusher.subscribe(`2-private-user-${data.userId}`);
      // chatChannel.bind(CHAT_MESSAGE_EVENT, (data: ChatMessage) => {
      //   if (data.sender.id !== withUser && data.receiver.id !== withUser)
      //     return;
      //   setPosts((prev) => {
      //     if (prev.some((x) => x.id === data.id)) {
      //       return prev;
      //     }
      //     return [data, ...prev];
      //   });
      // });
    },
    refetchOnWindowFocus: false,
  });

  api.chat.infiniteChat.useQuery(
    {
      pairUserID: withUser,
      cursor: queryCursor,
      limit: 3,
    },
    {
      onSuccess: (data) => {
        setPosts((prev) => [...prev, ...data.messages]);
        setCursor(data.nextCursor);
      },

      refetchOnWindowFocus: false,
    },
  );
  useEffect(() => {
    return () => {
      chatChannel?.unbind(CHAT_MESSAGE_EVENT);
    };
  }, [chatChannel]);

  const reversePost = [...posts].reverse();
  return (
    <div className="w-full max-w-xs">
      {posts ? (
        <>
          {reversePost.map((message, i) => {
            let isMine = false;
            let isShowTop = false;
            let isShowBot = false;
            if (message.sender.id === user?.userId) {
              isMine = true;
            }
            if (
              i === posts.length - 1 ||
              reversePost[i + 1]?.sender?.id !== message.sender.id
            )
              isShowBot = true;
            if (
              !isMine &&
              (i === 0 || reversePost[i - 1]?.sender?.id !== message.sender.id)
            )
              isShowTop = true;
            return (
              <ChatMessageComponent
                key={message.id}
                senderName={message.sender.firstName}
                isShowBot={isShowBot}
                isMine={isMine}
                isShowTop={isShowTop}
                message={message.content}
                createdAt={message.createdAt.toString()}
                imageUrl={message.sender.profileImageURL}
              />
            );
          })}
          <button
            className="mx-auto rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/20"
            disabled={cursor === null}
            onClick={() => {
              if (cursor) {
                setQueryCursor(cursor);
              }
            }}
          >
            Load More
          </button>
        </>
      ) : (
        <p>You have no posts yet.</p>
      )}

      {user && <CreatePost toUserID={withUser} />}
    </div>
  );
}

export function CreatePost(props: { toUserID: string }) {
  const { toUserID: userID } = props;
  const [name, setName] = useState("");
  const createPost2 = api.chat.sendMessage2.useMutation({
    onSuccess: () => {
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost2.mutate({
          content: name,
          toUserID: userID,
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost2.isLoading}
      >
        {createPost2.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
