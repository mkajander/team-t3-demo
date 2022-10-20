import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [message, setMessage] = React.useState("");
  const {
    data: messages,
    refetch,
    isLoading,
  } = trpc.useQuery(["message.getLatest"], {
      refetchInterval: 60000,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
  });
  const sendMessageMutation = trpc.useMutation(["message.create"]);

  const handleSendMessage = async () => {
    await sendMessageMutation.mutateAsync({
        text: message,
    })
    setMessage("");
    await refetch();
};

  const sendingMessage = sendMessageMutation.isLoading || isLoading;
  return (
    <>
            <Head>
                <title>T3 demo</title>
                <meta name="description" content="Team demo"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

      <main className="container mx-auto flex flex-col items-center justify-center p-4">
                {/* Input field to create a new message */}
                <div className="space-y-8 divide-y divide-gray-200">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">New message</label>
                        <div className="mt-1">
                            <input type="text" name="message" id="message" onChange={(e) => setMessage(e.target.value)}
                                   value={message}
                                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                   placeholder="Your message"/>
                        </div>
                    </div>
                    <button type="submit" onClick={handleSendMessage} disabled={sendingMessage}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Send
                    </button>
                </div>
                {/* List of messages, props are text and createdAt */}
                <div className="mt-6 flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {messages?.map((message) => (
                        <li key={message.id} className="py-5">
                            <div className="flex items-center space-x-5">
                                <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        <a href="#" className="hover:underline focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true"></span>
                                            {message.createdAt.toUTCString()}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{message.text}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </main>
    </>
  );
};

export default Home;