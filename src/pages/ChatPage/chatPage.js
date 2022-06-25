import React, { useEffect, useRef } from "react";
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient as supabase } from "config/supabase-client";
import {
  Avatar,
  MainContainer,
  ChatContainer,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  ConversationHeader,
  Conversation,
  MessageList,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import chatPageStyles from "./chatPage.module.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";

const ChatPage = () => {
  const { state } = useLocation();
  const startChatData = state ? state.startChatData : null;

  const unusedModalState = {
    show: false,
    title: "",
    body: "",
    footer: "",
  };
  const [modalState, setModalState] = useState(unusedModalState);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ChatModal
        handleClose={() => setModalState(unusedModalState)}
        data={modalState}
      />
      <ChatPageBody
        startChatData={startChatData}
        setModalState={setModalState}
        unusedModalState={unusedModalState}
      />
      <FooterBar />
    </div>
  );
};

export default ChatPage;

const ChatPageBody = ({ startChatData, setModalState, unusedModalState }) => {
  // Whether to show the Sidebar or not. Applicable when window width is under 768px.
  const [showSidebar, setShowSidebar] = useState(window.innerWidth < 768);

  // The ID of the current active chat
  const [activeChatId, setActiveChatId] = useState(null);

  /* Array of objects which represent a message each.
     Structure: {
       time (ISO format),
       type (text/image/offer),
       content,
       isOwnMessage (true if sent by current user)
     }
  */
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const fileInput = useRef(null);

  /* The data containing the conversations to be loaded under the ConversationList.
     Stored as an object of objects.
     Key: chat_id
     Value:
     {
       user_id,
       self_pos (0 or 1 -- position in `participants`/`acknowledgement`),
       name,
       src,
       message,
       actionState
     } 
  */
  const [conversations, setConversations] = useState([]);

  // Boolean denoting whether the conversations are currently being fetched or not
  const [loadingConvos, setLoadingConvos] = useState(false);

  // String representing the query passed into the searchbar on the left sidebar
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const uid = supabase.auth.user().id;

  // Helper functions to add/remove classes from elements
  const removeClass = (elem, name) => {
    if (!elem || !elem.className.includes(name)) return;

    elem.className = elem.className
      .split(" ")
      .filter((cName) => cName !== name)
      .join(" ");
  };
  const addClass = (elem, name) => {
    if (!elem || elem.className.includes(name)) return;

    elem.className += ` ${name}`;
  };

  const generateSingleMessage = (msgData, position) => {
    const { time, content, type, isOwnMessage } = msgData;
    const lastOrSingle = position === "last" || position === "single";
    switch (type) {
      case "text":
        return (
          <Message
            key={"text-" + time}
            model={{
              message: content.replace("&nbsp; ", "\n"),
              direction: isOwnMessage ? "outgoing" : "incoming",
              position,
            }}
            type={"text"}
            avatarSpacer={!isOwnMessage && !lastOrSingle}
          >
            {!isOwnMessage && lastOrSingle && (
              <Avatar src={conversations[activeChatId].src} className="mb-3" />
            )}
            {lastOrSingle && (
              <Message.Footer
                sentTime={moment(time).format("LT")}
                className={chatPageStyles["msg-footer"]}
              />
            )}
          </Message>
        );
      case "image":
        return (
          <Message
            key={"image-" + time}
            model={{
              direction: isOwnMessage ? "outgoing" : "incoming",
              position,
            }}
            type={"image"}
            avatarSpacer={!isOwnMessage && !lastOrSingle}
          >
            {!isOwnMessage && lastOrSingle && (
              <Avatar src={conversations[activeChatId].src} className="mb-3" />
            )}
            <Message.CustomContent>
              <img
                src={content}
                width={window.innerWidth / (window.innerWidth < 768 ? 2 : 4)}
                alt="Sent message"
                onClick={() => {
                  setModalState({
                    show: true,
                    title: "View Image",
                    body: <img src={content} alt="Preview" />,
                  });
                }}
                style={{ cursor: "pointer" }}
              />
            </Message.CustomContent>
          </Message>
        );
      case "offer":
        return (
          <Message
            key={"offer-" + time}
            model={{
              direction: isOwnMessage ? "outgoing" : "incoming",
              position,
            }}
            type={"custom"}
            avatarSpacer={!isOwnMessage && !lastOrSingle}
          >
            {!isOwnMessage && lastOrSingle && (
              <Avatar src={conversations[activeChatId].src} className="mb-3" />
            )}
            <Message.CustomContent className="text-center p-3">
              <h4>
                {content === "MAKE_OFFER"
                  ? isOwnMessage
                    ? "You made an offer!"
                    : "Wants to make a deal!"
                  : isOwnMessage
                  ? "You accepted the offer!"
                  : "Accepted your offer!"}
              </h4>
              <p className="py-0 my-1">
                {content === "MAKE_OFFER"
                  ? isOwnMessage
                    ? "You can leave a review once your offer is accepted."
                    : "Accept the deal by clicking the button above."
                  : "You can now leave reviews for each other."}
              </p>
            </Message.CustomContent>
            {lastOrSingle && (
              <Message.Footer
                sentTime={moment(time).format("LT")}
                className={chatPageStyles["msg-footer"]}
              />
            )}
          </Message>
        );
      default:
        return (
          <Message key={"unknown-" + time}>
            <Message.CustomContent>
              unknown_message_type: {`(${type}, ${content})`}
            </Message.CustomContent>
          </Message>
        );
    }
  };

  // Helper function to generate array of Messsages from a single sender
  const generateMessages = (msgList) => {
    if (msgList.length === 0) return [];

    if (msgList.length === 1) {
      return [generateSingleMessage(msgList[0], "single")];
    } else {
      // Initialise result array with first message
      const res = [generateSingleMessage(msgList[0], "first")];

      // Add messages between first and last message
      for (let i = 1; i < msgList.length - 1; i++) {
        res.push(generateSingleMessage(msgList[i], "normal"));
      }

      // Add last message
      res.push(generateSingleMessage(msgList[msgList.length - 1], "last"));

      return res;
    }
  };

  // Helper function to parse raw Supabase message data
  const parseMessage = ({ created_at, sender_id, payload }) => {
    // Change this to expand the number of supported message types
    const type = Object.keys(payload)[0];

    // Change code here for content to expand supported content types
    return {
      time: created_at,
      type,
      content: payload[type],
      isOwnMessage: sender_id === uid,
    };
  };

  // Helper function to parse the latest message to be displayed
  const parseLatestMsg = (isOwnMessage, type, content) => {
    switch (type) {
      case "text":
        return `${isOwnMessage ? "You: " : ""}${content}`;
      case "image":
        return `${isOwnMessage ? "You" : ""} sent an Image`;
      case "offer":
        return `${isOwnMessage ? "You" : ""} ${
          content === "MAKE_OFFER" ? "made an offer" : "accepted the offer"
        }`;
      default:
        return "unknown_message_type: " + type;
    }
  };

  // Helper function to parse raw Supabase conversation data
  const parseConvo = async ({
    id,
    participants,
    messages,
    acknowledgement,
  }) => {
    let partnerId = "";
    let selfAck = false;
    let otherAck = false;
    let self_pos = 0;

    if (participants[0] === uid) {
      partnerId = participants[1];
      [selfAck, otherAck] = acknowledgement;
    } else {
      partnerId = participants[0];
      [otherAck, selfAck] = acknowledgement;
      self_pos = 1;
    }

    const type = Object.keys(messages.payload)[0];
    const message = messages
      ? parseLatestMsg(messages.sender_id === uid, type, messages.payload[type])
      : "";

    // Fetch username and avatar url from the profiles table
    let { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", partnerId)
      .single();
    if (userError) throw userError;

    // If avatar url from the profiles table is empty, set it to the default profile pic.
    const avatarUrl =
      userData.avatar_url === ""
        ? "/images/img_avatarDefault.jpg"
        : supabase.storage.from("avatars").getPublicUrl(userData.avatar_url)
            .data.publicURL;

    return {
      chat_id: id,
      name: userData.username,
      user_id: partnerId,
      message,
      src: avatarUrl,
      actionState: selfAck * 2 + otherAck,
      self_pos,
    };
  };

  const uploadImg = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${supabase.auth.user().id}/${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      let { publicURL, error: downloadError } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);
      if (downloadError) throw downloadError;

      let { error: msgError } = await supabase.from("messages").insert({
        recipient_id: conversations[activeChatId].user_id,
        convo_id: activeChatId,
        payload: {
          image: publicURL,
        },
      });
      if (msgError) throw msgError;
    } catch (error) {
      alert(error.message);
    }
  };

  // Handles the onClick event for the Conversation items (the left sidebar)
  const handleConvoClick = (chatId) => {
    setShowSidebar(false);
    setActiveChatId(chatId);
  };

  const handleOffers = async (isMakingOffer) => {
    const { user_id, self_pos, actionState } = conversations[activeChatId];
    try {
      // Send "message" to notify of action
      let { data: msgData, error: msgError } = await supabase
        .from("messages")
        .insert({
          recipient_id: user_id,
          convo_id: activeChatId,
          payload: {
            offer: isMakingOffer ? "MAKE_OFFER" : "ACCEPT_OFFER",
          },
        })
        .single();
      if (msgError) throw msgError;

      const selfAck = true;
      const otherAck = Boolean(actionState % 2);

      // Update latest message + acknowledgement state in conversations table
      let { error: convoError } = await supabase
        .from("conversations")
        .update({
          last_msg: msgData.id,
          acknowledgement:
            self_pos === 0 ? [selfAck, otherAck] : [otherAck, selfAck],
        })
        .eq("id", activeChatId);
      if (convoError) throw convoError;
    } catch (error) {
      alert(error);
    }
  };

  // Handles the onClick event for the action button on the Conversation Header
  const handleActionClick = async (actionState) => {
    switch (actionState) {
      case 0:
        setModalState({
          show: true,
          title: "Confirm Offer",
          body: "You are about to make an offer. This action cannot be undone.",
          footer: (
            <>
              <Button
                onClick={() => {
                  handleOffers(true);
                  setModalState(unusedModalState);
                }}
              >
                Confirm
              </Button>
              <Button
                variant="danger"
                onClick={() => setModalState(unusedModalState)}
              >
                Cancel
              </Button>
            </>
          ),
        });
        break;
      case 1:
        setModalState({
          show: true,
          title: "Accept Offer",
          body: "You are about to accept an offer. This action cannot be undone.",
          footer: (
            <>
              <Button
                onClick={() => {
                  handleOffers(false);
                  setModalState(unusedModalState);
                }}
              >
                Confirm
              </Button>
              <Button
                variant="danger"
                onClick={() => setModalState(unusedModalState)}
              >
                Cancel
              </Button>
            </>
          ),
        });
        break;
      case 3:
      default:
        console.log("unknown action state: " + actionState);
        break;
    }
  };

  // Handles the sending of (text) messages
  const handleMsgSend = async (msg) => {
    try {
      // Handle starting of new chat
      if (activeChatId.includes("temp-")) {
        // Create new conversation in Supabase
        let { data: newConvoData, error: newConvoError } = await supabase
          .from("conversations")
          .insert({
            participants: [uid, startChatData.user_id],
          })
          .single();
        if (newConvoError) throw newConvoError;

        // Upload new message into supabase, with previous conversation id as convo_id
        let { data: uploadMsgData, error: uploadMsgError } = await supabase
          .from("messages")
          .insert({
            recipient_id: activeChatId.substr(5),
            payload: {
              text: msg,
            },
            convo_id: newConvoData.id,
          })
          .single();
        if (uploadMsgError) throw uploadMsgError;

        // Update conversation last_msg to previously uploaded message id
        let { error: updateConvoError } = await supabase
          .from("conversations")
          .update({ last_msg: uploadMsgData.id })
          .eq("id", newConvoData.id);
        if (updateConvoError) throw updateConvoError;
      }
      // Handle normal message sending
      else {
        let { data, error } = await supabase.from("messages").insert({
          recipient_id: conversations[activeChatId].user_id,
          payload: {
            text: msg,
          },
          convo_id: activeChatId,
        });
        if (error) throw error;

        let { error: lastMsgError } = await supabase
          .from("conversations")
          .update({ last_msg: data[0].id })
          .eq("id", activeChatId);
        if (lastMsgError) throw lastMsgError;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handles image upload event
  const handleImgUpload = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      alert("Please select an image to upload.");
    }
    const file = event.target.files[0];
    const modalStateTemplate = {
      show: true,
      title: "Image Preview",
      body: (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="justify-self-center"
        />
      ),
    };
    setModalState({
      ...modalStateTemplate,
      footer: (
        <>
          <Button
            onClick={async () => {
              setModalState({
                ...modalStateTemplate,
                footer: (
                  <Spinner animation="border" className="justify-self-center" />
                ),
              });
              await uploadImg(file);
              setModalState(unusedModalState);
            }}
          >
            Send
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalState(unusedModalState)}
          >
            Cancel
          </Button>
        </>
      ),
    });
  };

  // Fetches messages in chat
  // Runs whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId || activeChatId.includes("temp-")) {
      setMessages({});
      return;
    }
    // Loads old messages and listens for any new messages
    const getOldMessages = async () => {
      try {
        setLoadingMessages(true);

        let { data, error } = await supabase
          .from("messages")
          .select("created_at, sender_id, payload")
          .eq("convo_id", activeChatId)
          .order("created_at", { ascending: true });
        if (error) throw error;

        const newMessages = data.map(parseMessage);

        setMessages(newMessages);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingMessages(false);
      }
    };
    getOldMessages();

    // Subscribe to INSERT events with convo_id === activeChatId
    const msgSub = supabase
      .from(`messages:convo_id=eq.${activeChatId}`)
      .on("INSERT", (payload) =>
        setMessages((oldMessages) => [
          ...oldMessages,
          parseMessage(payload.new),
        ])
      )
      .subscribe();

    return () => supabase.removeSubscription(msgSub);

    // We are disabling warnings regarding missing dependency
    // `parseMessage` as it is a helper function that will
    // never change. (i.e. redundant dependancy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  // Fetch all conversations and store them in `conversations`
  // Run only once, at the start.
  // Currently only supports direct messages. Group chats might be added (TBC)
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        setLoadingConvos(true);

        // Fetch data from conversations and messages table
        let { data: convoData, error: convoError } = await supabase
          .from("conversations")
          .select(
            "id, participants, acknowledgement, messages(sender_id, payload)"
          )
          .order("created_at", { ascending: false, foreignTable: "messages" });
        if (convoError) throw convoError;

        // Convert each row of convoData into the appropriate format for `conversations`
        let newConversations = await Promise.all(convoData.map(parseConvo));
        newConversations = newConversations.reduce((res, convo) => {
          const {
            chat_id,
            name,
            user_id,
            message,
            src,
            actionState,
            self_pos,
          } = convo;
          res[chat_id] = { name, user_id, message, src, actionState, self_pos };
          return res;
        }, {});

        if (startChatData) {
          const { user_id, name, src } = startChatData;
          const existingConvo = convoData.filter(({ participants }) =>
            participants.includes(user_id)
          );
          const hasExistingConvo = existingConvo.length > 0;
          const tempChatId = `temp-${user_id}`;
          if (!hasExistingConvo) {
            newConversations[tempChatId] = {
              name,
              user_id,
              src,
              message: "",
              actionState: 0,
              self_pos: 0,
            };
          }
          setConversations(newConversations);
          setActiveChatId(hasExistingConvo ? existingConvo[0].id : tempChatId);
        } else {
          setConversations(newConversations);
        }
        if (Object.keys(newConversations).length === 0) setShowSidebar(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingConvos(false);
      }
    };
    fetchConvos();

    // Subscribe to INSERT and UPDATE events
    const convoSub = supabase
      .from("conversations")
      .on("UPDATE", async (payload) => {
        try {
          let { data, error } = await supabase
            .from("messages")
            .select("sender_id, payload")
            .eq("id", payload.new.last_msg)
            .single();
          if (error) throw error;

          setConversations((oldConversations) => {
            const newConversations = { ...oldConversations };
            const type = Object.keys(data.payload)[0];
            let selfAck = false;
            let otherAck = false;

            newConversations[payload.new.id].message = parseLatestMsg(
              data.sender_id === uid,
              type,
              data.payload[type]
            );

            if (payload.new.participants[0] === uid) {
              [selfAck, otherAck] = payload.new.acknowledgement;
            } else {
              [otherAck, selfAck] = payload.new.acknowledgement;
            }
            newConversations[payload.new.id].actionState =
              selfAck * 2 + otherAck;

            return newConversations;
          });
        } catch (error) {
          alert(error.message);
        }
      })
      .on("INSERT", async (payload) => {
        const newConvo = await parseConvo(payload.new);
        const { chat_id, name, user_id, message, src, actionState } = newConvo;
        const tempChatId = `temp-${user_id}`;

        setConversations((oldConvos) => {
          const newConvos = { ...oldConvos };
          newConvos[chat_id] = { name, user_id, message, src, actionState };
          return newConvos;
        });

        setActiveChatId((oldChatId) => {
          if (oldChatId === tempChatId) {
            setConversations((oldConvos) => {
              const newConvos = { ...oldConvos };
              delete newConvos[tempChatId];
              return newConvos;
            });
            return chat_id;
          } else return oldChatId;
        });
      })
      .subscribe();

    return () => supabase.removeSubscription(convoSub);

    // We are disabling warnings regarding missing dependencies as this
    // hook is meant to only be run once at the start,
    // regardless of any other state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add event listener to show correct layout on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      } else if (!activeChatId) {
        setShowSidebar(
          document.getElementsByClassName("cs-conversation").length
        );
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies as we do not need to re-setup the event handler
    // on any state change.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle showing/hiding of the sidebar on showSidebar change
  useEffect(() => {
    const sidebarElem = document.getElementsByClassName("cs-sidebar")[0];
    const searchBarElem = document.getElementsByClassName("cs-search")[0];
    const chatContainerElem =
      document.getElementsByClassName("cs-chat-container")[0];
    const convoAvatarElems = Array.from(
      document.getElementsByClassName("cs-avatar")
    );
    const convoContentElems = Array.from(
      document.getElementsByClassName("cs-conversation__content")
    );

    if (window.innerWidth < 768 && showSidebar) {
      addClass(sidebarElem, chatPageStyles["sidebar-visible"]);
      convoAvatarElems.forEach((convoAvatar) =>
        addClass(convoAvatar, chatPageStyles["convoAvatar-visible"])
      );
      addClass(searchBarElem, chatPageStyles["convoContent-visible"]);
      addClass(chatContainerElem, chatPageStyles["chatContainer-invisible"]);
      convoContentElems.forEach((convoContent) =>
        addClass(convoContent, chatPageStyles["convoContent-visible"])
      );
    } else if (
      !showSidebar &&
      sidebarElem.className.includes("sidebar-visible")
    ) {
      removeClass(sidebarElem, chatPageStyles["sidebar-visible"]);
      removeClass(searchBarElem, chatPageStyles["convoContent-visible"]);
      convoAvatarElems.forEach((convoAvatar) =>
        removeClass(convoAvatar, chatPageStyles["convoAvatar-visible"])
      );
      removeClass(chatContainerElem, chatPageStyles["chatContainer-invisible"]);
      convoContentElems.forEach((convoContent) =>
        removeClass(convoContent, chatPageStyles["convoContent-visible"])
      );
    }
  }, [showSidebar, loadingConvos]);

  return (
    <div className={chatPageStyles.body}>
      <MainContainer responsive>
        <Sidebar position="left" loading={loadingConvos} scrollable>
          <Search
            placeholder="Search..."
            className={`${chatPageStyles["cs-search"]} py-0`}
            onChange={(query) => setSearchQuery(query)}
            onClearClick={() => setSearchQuery("")}
          />
          <ConversationList>
            {Object.keys(conversations)
              .filter((id) =>
                `${conversations[id].name.toLowerCase()} ${conversations[
                  id
                ].message.toLowerCase()}`.includes(searchQuery.toLowerCase())
              )
              .map((id) => (
                <Conversation
                  onClick={() => handleConvoClick(id)}
                  key={id}
                  active={activeChatId === id}
                >
                  <Avatar
                    src={conversations[id].src}
                    name={conversations[id].name}
                  />
                  <Conversation.Content
                    name={conversations[id].name}
                    info={conversations[id].message.replace("&nbsp; ", "; ")}
                  />
                </Conversation>
              ))}
          </ConversationList>
        </Sidebar>
        {!activeChatId ? (
          <ChatContainer>
            <MessageList>
              <MessageList.Content
                className={`${chatPageStyles["empty-chat"]}`}
              >
                <p className="px-md-5">
                  Nothing here! <br /> Try{" "}
                  {window.innerWidth < 768
                    ? "starting "
                    : "selecting a chat on the left or start "}
                  a new conversation from
                  <a href="/listingspage" className="ms-2">
                    a listing
                  </a>
                  .
                </p>
              </MessageList.Content>
            </MessageList>
          </ChatContainer>
        ) : (
          <ChatContainer>
            {
              <ConversationHeader>
                <ConversationHeader.Back onClick={() => setShowSidebar(true)} />
                <Avatar
                  src={conversations[activeChatId].src}
                  name={conversations[activeChatId].name}
                  onClick={() =>
                    navigate("/profile", {
                      state: {
                        creator_id: conversations[activeChatId].user_id,
                      },
                    })
                  }
                />
                <ConversationHeader.Content
                  userName={conversations[activeChatId].name}
                  className={`${chatPageStyles["convo-header"]}`}
                  onClick={() =>
                    navigate("/profile", {
                      state: {
                        creator_id: conversations[activeChatId].user_id,
                      },
                    })
                  }
                />
                <ConversationHeader.Actions>
                  <Button
                    onClick={() =>
                      handleActionClick(conversations[activeChatId].actionState)
                    }
                    disabled={conversations[activeChatId].actionState === 2}
                  >
                    {
                      [
                        "Make Offer",
                        "Accept Offer",
                        "Make Offer",
                        "Leave Review",
                      ][conversations[activeChatId].actionState]
                    }
                  </Button>
                </ConversationHeader.Actions>
              </ConversationHeader>
            }

            {loadingMessages ? (
              <MessageList>
                <MessageList.Content
                  className={`${chatPageStyles["empty-chat"]}`}
                >
                  <Spinner
                    animation="border"
                    role="status"
                    aria-label="Loading"
                  />
                </MessageList.Content>
              </MessageList>
            ) : (
              <MessageList className="py-2">
                {(() => {
                  const msgElems = [];
                  let currentDate = null;
                  let msgGroup = [];

                  for (let i = 0; i < messages.length; i++) {
                    const { time, isOwnMessage } = messages[i];
                    const date = moment(time).format("L");
                    if (date !== currentDate) {
                      currentDate = date;
                      msgElems.push(...generateMessages(msgGroup));
                      msgElems.push(
                        <MessageSeparator
                          content={moment(time).format("LL")}
                          key={time}
                        />
                      );
                      msgGroup = [messages[i]];
                    } else {
                      if (
                        i === 0 ||
                        isOwnMessage === messages[i - 1].isOwnMessage
                      ) {
                        msgGroup.push(messages[i]);
                      } else {
                        msgElems.push(...generateMessages(msgGroup));
                        msgGroup = [messages[i]];
                      }
                    }
                  }
                  if (msgGroup.length > 0)
                    msgElems.push(...generateMessages(msgGroup));

                  return msgElems;
                })()}
              </MessageList>
            )}

            <MessageInput
              placeholder="Your message here..."
              className={`${chatPageStyles["message-input"]}`}
              onSend={handleMsgSend}
              onAttachClick={() => fileInput.current.click()}
            ></MessageInput>
          </ChatContainer>
        )}
      </MainContainer>

      {/* File selector used to upload images.
      Hidden from view, only accessible via the attach image icon on the input bar. */}
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={handleImgUpload}
      />
    </div>
  );
};

const ChatModal = (props) => {
  const { handleClose, data } = props;
  const { show, title, body, footer } = data;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-center">{body}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
};
