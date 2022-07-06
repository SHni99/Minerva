import React, { useEffect, useRef } from "react";
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import Rating from "components/Rating/Rating";
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
import BlockReportMenu from "components/BlockReportMenu/blockReportMenu";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ChatPage = () => {
  const { state } = useLocation();
  const startChatData = state ? state.startChatData : null;

  const unusedModalState = {
    show: false,
    title: "",
    body: "",
    footer: "",
    centerBody: false,
    centerFooter: false,
    presetData: null,
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
       id,
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
       actionState,
       hasReviewed,
       otherHasReviewed
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
    const { id, time, content, type, isOwnMessage } = msgData;
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
                  const modalStateTemplate = {
                    show: true,
                    title: "View Image",
                    body: <img src={content} alt="Preview" />,
                    centerBody: true,
                  };
                  const footers = [
                    <Button
                      variant="danger"
                      className="px-3"
                      onClick={() =>
                        setModalState({
                          ...modalStateTemplate,
                          footer: footers[1],
                          centerFooter: true,
                        })
                      }
                    >
                      Delete
                    </Button>,
                    <p className="text-center">
                      Are you sure? <br />
                      <Button
                        variant="danger"
                        onClick={async () => {
                          setModalState({
                            ...modalStateTemplate,
                            footer: footers[2],
                            centerFooter: true,
                          });
                          await deleteImg(content, id);
                          setModalState(unusedModalState);
                        }}
                        className="px-4 mx-2"
                      >
                        Yes
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setModalState({
                            ...modalStateTemplate,
                            footer: footers[0],
                          })
                        }
                        className="px-4 mx-2"
                      >
                        No
                      </Button>
                    </p>,
                    <Spinner animation="border" />,
                  ];
                  setModalState({
                    ...modalStateTemplate,
                    footer: isOwnMessage && footers[0],
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
      case "review":
        return (
          <Message
            key={"review-" + time}
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
              <h4>{isOwnMessage ? "You left a review!" : "Left a review!"}</h4>
              <p className="py-0 my-1">
                {isOwnMessage
                  ? "Your review can be found under their profile."
                  : "The review can be found under your profile."}
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
  const parseMessage = ({ id, created_at, sender_id, payload }) => {
    // Change this to expand the number of supported message types
    const type = Object.keys(payload)[0];

    // Change code here for content to expand supported content types
    return {
      id,
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
      case "review":
        return `${isOwnMessage ? "You" : ""} left a review`;
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
    reviewed,
  }) => {
    const self_pos = participants.indexOf(uid);
    const partnerId = participants[1 - self_pos];
    const selfAck = acknowledgement[self_pos];
    const otherAck = acknowledgement[1 - self_pos];
    const hasReviewed = reviewed[self_pos];
    const otherHasReviewed = reviewed[1 - self_pos];

    const type = messages ? Object.keys(messages.payload)[0] : "text";
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
      hasReviewed,
      otherHasReviewed,
    };
  };

  // Function that creates a new conversation from a temporary one
  // and send the first message
  const sendFirstMsg = async (payload) => {
    try {
      setLoadingMessages(true);
      if (!startChatData)
        throw new Error(
          "Cannot find other party's user ID. Please try starting a new chat again."
        );
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
          payload,
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Function that sends a message to an already existing conversation
  const sendMsg = async (payload) => {
    try {
      let { data: msgData, error: msgError } = await supabase
        .from("messages")
        .insert({
          recipient_id: conversations[activeChatId].user_id,
          convo_id: activeChatId,
          payload,
        })
        .single();
      if (msgError) throw msgError;

      let { error: convoError } = await supabase
        .from("conversations")
        .update({ last_msg: msgData.id })
        .eq("id", activeChatId);
      if (convoError) throw convoError;
    } catch (error) {
      alert(error.message);
    }
  };

  const uploadImg = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${supabase.auth.user().id}/${Math.random()}.${fileExt}`;

      // Upload image file
      let { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get image public URL
      let { publicURL, error: downloadError } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);
      if (downloadError) throw downloadError;

      // Send image as message
      if (activeChatId.includes("temp-")) {
        await sendFirstMsg({ image: publicURL });
      } else {
        await sendMsg({ image: publicURL });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteImg = async (publicURL, msgId) => {
    const filePath = publicURL.split("/").slice(-2).join("/");
    try {
      let { data: msgData, error: msgError } = await supabase
        .from("messages")
        .select("id, payload")
        .eq("convo_id", activeChatId)
        .limit(2)
        .order("created_at", { ascending: false });
      if (msgError) throw msgError;

      if (msgData[0].id === msgId) {
        // Latest message to be deleted
        // Need to roll back latest message by 1

        // Update conversations to reflect latest message
        let { error: convoError } = await supabase
          .from("conversations")
          .update({ last_msg: (msgData[1] || { id: "" }).id })
          .eq("id", activeChatId);
        if (convoError) throw convoError;
      }

      // Delete message
      let { error: deleteMsgError } = await supabase
        .from("messages")
        .delete()
        .match({ id: msgId });
      if (deleteMsgError) throw deleteMsgError;

      // Delete image from storage
      let { error: deleteImgError } = await supabase.storage
        .from("chat-images")
        .remove([filePath]);
      if (deleteImgError) throw deleteImgError;
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
      alert(error.message);
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
        setModalState({
          show: true,
          presetData: {
            type: "review",
            convo: conversations[activeChatId],
            chat_id: activeChatId,
          },
        });
        break;
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
        await sendFirstMsg({ text: msg });
      }
      // Handle normal message sending
      else {
        await sendMsg({ text: msg });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handles image upload event
  const handleImgUpload = (event) => {
    if (
      !event.target.files ||
      event.target.files.length === 0 ||
      !event.target.files[0].type.match(/image-*/)
    ) {
      alert("Please select a valid image to upload.");
      return;
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
      centerBody: true,
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
                centerFooter: true,
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
    // Loads old messages and listens for any new/deleted messages
    const getOldMessages = async () => {
      try {
        setLoadingMessages(true);

        let { data, error } = await supabase
          .from("messages")
          .select("id, created_at, sender_id, payload")
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
          ...(oldMessages || []),
          parseMessage(payload.new),
        ])
      )
      .on("DELETE", (payload) =>
        setMessages((oldMessages) =>
          [...(oldMessages || [])].filter(
            (oldMsg) => oldMsg.id !== payload.old.id
          )
        )
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
            "id, participants, acknowledgement, reviewed, messages(sender_id, payload)"
          )
          .contains("participants", `["${uid}"]`)
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
            hasReviewed,
            otherHasReviewed,
          } = convo;
          res[chat_id] = {
            name,
            user_id,
            message,
            src,
            actionState,
            self_pos,
            hasReviewed,
            otherHasReviewed,
          };
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
              actionState: 2,
              self_pos: 0,
              hasReviewed: false,
            };
          }
          setConversations(newConversations);
          setActiveChatId(hasExistingConvo ? existingConvo[0].id : tempChatId);
        } else {
          setConversations(newConversations);
        }
        if (Object.keys(newConversations).length === 0) setShowSidebar(false);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingConvos(false);
      }
    };
    fetchConvos();

    // Subscribe to INSERT and UPDATE events
    const convoSub = supabase
      .from("conversations")
      .on("UPDATE", async (updated) => {
        const { id, participants, last_msg, acknowledgement, reviewed } =
          updated.new;
        const self_pos = participants.indexOf(uid);
        try {
          let { data: message, error: msgError } = await supabase
            .from("messages")
            .select("sender_id, payload")
            .eq("id", last_msg)
            .single();
          if (msgError) throw msgError;

          setConversations((oldConversations) => {
            const newConversations = { ...oldConversations };

            const type = Object.keys(message.payload)[0];
            newConversations[id].message = parseLatestMsg(
              message.sender_id === uid,
              type,
              message.payload[type]
            );
            newConversations[id].actionState =
              acknowledgement[self_pos] * 2 + acknowledgement[1 - self_pos];
            newConversations[id].hasReviewed = reviewed[self_pos];
            newConversations[id].otherHasReviewed = reviewed[1 - self_pos];

            return newConversations;
          });
        } catch (error) {
          alert(error.message);
        }
      })
      .on("INSERT", async (payload) => {
        const newConvo = await parseConvo(payload.new);
        const { chat_id, name, user_id, message, src, actionState, self_pos } =
          newConvo;
        const tempChatId = `temp-${user_id}`;

        setConversations((oldConvos) => {
          const newConvos = { ...oldConvos };
          newConvos[chat_id] = {
            name,
            user_id,
            message,
            src,
            actionState,
            self_pos,
          };
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
                  style={{ cursor: "pointer" }}
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
                  style={{ cursor: "pointer" }}
                />
                <ConversationHeader.Actions>
                  <Button
                    onClick={() =>
                      handleActionClick(conversations[activeChatId].actionState)
                    }
                    disabled={
                      conversations[activeChatId].actionState === 2 ||
                      conversations[activeChatId].hasReviewed
                    }
                    className="mx-3"
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
                  <BlockReportMenu
                    showModal={(title, body, footer) =>
                      setModalState({
                        ...unusedModalState,
                        show: true,
                        title,
                        body,
                        footer,
                      })
                    }
                    hideModal={() => setModalState(unusedModalState)}
                    target_id={conversations[activeChatId].user_id}
                  />
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
        accept="image/*"
      />
    </div>
  );
};

const ChatModal = (props) => {
  const { handleClose, data } = props;
  const { show, title, body, centerBody, footer, centerFooter, presetData } =
    data;
  const unusedModalState = {
    rating: 0,
    reviewText: "",
    footerState: 0,
    validation: {},
  };
  const [modalState, setModalState] = useState(unusedModalState);
  const getStateSetter = (stateKey) => (stateVal) =>
    setModalState((oldState) => {
      const newState = { ...oldState };
      newState[stateKey] = stateVal;
      return newState;
    });

  if (presetData) {
    if (presetData.type === "review") {
      const { user_id, name, src, self_pos, otherHasReviewed } =
        presetData.convo;
      const setRating = getStateSetter("rating");
      const setReviewText = getStateSetter("reviewText");
      const setFooterState = getStateSetter("footerState");
      const setValidation = getStateSetter("validation");
      const exitModal = () => {
        setModalState(unusedModalState);
        handleClose();
      };

      const insertReview = async () => {
        const { rating, reviewText } = modalState;
        try {
          // Insert to reviews table
          let { error: reviewError } = await supabase.from("reviews").insert({
            index: rating,
            textbox: reviewText,
            reviewee_id: user_id,
          });
          if (reviewError) throw reviewError;

          // Send review "message"
          let { data: msgData, error: msgError } = await supabase
            .from("messages")
            .insert({
              recipient_id: user_id,
              payload: {
                review: true,
              },
              convo_id: presetData.chat_id,
            })
            .single();
          if (msgError) throw msgError;

          // Update conversations to indicate completion of review
          let { error: convoError } = await supabase
            .from("conversations")
            .update({
              reviewed:
                self_pos === 0
                  ? [true, otherHasReviewed]
                  : [otherHasReviewed, true],
              last_msg: msgData.id,
            })
            .eq("id", presetData.chat_id);
          if (convoError) throw convoError;
        } catch (error) {
          alert(error.message);
        }
      };

      const footers = [
        <>
          <Button onClick={() => setFooterState(1)}>Submit</Button>
          <Button variant="secondary" onClick={exitModal}>
            Cancel
          </Button>
        </>,
        <p className="text-center">
          Confirm submission? <br />
          <Button
            className="mx-2 px-3"
            onClick={async () => {
              const { rating, reviewText } = modalState;
              // Input validation
              if (!rating || !reviewText) {
                setValidation({
                  ...modalState.validation,
                  rating: rating > 0 || "This is a required field",
                  reviewText: reviewText !== "" || "This is a required field",
                });
                return;
              }

              // Show loading spinner
              setFooterState(2);

              // Insert review to Supabase
              await insertReview();

              // Clear modal and exit
              exitModal();
            }}
          >
            Yes
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => setFooterState(0)}
          >
            No
          </Button>
        </p>,
        <Spinner animation="border" />,
      ];

      return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Leave Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container fluid>
              <Row className="pb-3">
                <Col xs="auto" className="ps-2">
                  <Avatar src={src} size="lg" />
                </Col>
                <Col xs="auto" className="align-center py-1">
                  <Row className="nunito font-weight-bold text-lg">{name}</Row>
                  <Row>
                    <Rating
                      setReviews={[modalState.rating, setRating]}
                      ratingHover={true}
                      className="px-0"
                    />
                  </Row>
                  <Row>
                    <p className="m-0 p-0 nunito text-danger">
                      {!modalState.rating && modalState.validation?.rating}
                    </p>
                  </Row>
                </Col>
              </Row>
              <Row className="px-1">
                <textarea
                  style={{
                    borderRadius: "12px",
                    resize: "none",
                    height: "120px",
                    borderColor: "var(--gray500---98a2b3)",
                    padding: "12px 16px",
                  }}
                  placeholder={`What do you think of ${name}?`}
                  value={modalState.reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={200}
                ></textarea>
                <p
                  className="text-end text-xs mb-0"
                  style={{
                    color:
                      modalState.reviewText.length < 200
                        ? "var(--gray600---667085)"
                        : "red",
                  }}
                >
                  Characters remaining: {200 - modalState.reviewText.length}
                </p>
              </Row>
              <Row>
                <p className="m-0 nunito text-danger">
                  {!modalState.reviewText && modalState.validation?.reviewText}
                </p>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>{footers[modalState.footerState]}</Modal.Footer>
        </Modal>
      );
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={centerBody && "d-flex justify-center"}>
        {body}
      </Modal.Body>
      <Modal.Footer className={centerFooter && "d-flex justify-content-center"}>
        {footer}
      </Modal.Footer>
    </Modal>
  );
};
