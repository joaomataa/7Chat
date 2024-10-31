document.addEventListener("DOMContentLoaded", () => {
  const loggedInUserId = sessionStorage.getItem("loggedInUserId")
  const loggedInUsername = sessionStorage.getItem("loggedInUsername")

  if (!loggedInUserId) {
    window.location.href = "index.html";
    return;
  }

  const h4_username = document.getElementById("h4_username");
  const messageForm = document.getElementById("messageForm")
  const messageInput = document.getElementById("messageInput");
  const messageList = document.getElementById("messageList")
  const chatList = document.getElementById("chatList")
  const searchChat = document.getElementById("searchChat")

  messageForm.classList.add("hidden")
  h4_username.innerHTML = loggedInUsername

  let previousMessageCount = 0
  let receiverId = null

  async function fetchChatList() {
    try {
      const response = await fetch(
        `php/get_chat_list.php?user_id=${loggedInUserId}`
      );
      if (!response.ok) throw new Error("Failed to fetch chat list")

      const chatData = await response.json();
      displayChatList(chatData)
    } catch (error) {
      console.error("Error fetching chat list:", error);
      alert("Failed to load chat list. Please try again later.");
    }
  }

  let selectedChatId = null

  function displayChatList(chats) {
    chatList.innerHTML = ""

    if (Array.isArray(chats) && chats.length > 0) {
      chats.forEach((chat) => {
        if (!chat.last_message && !chat.timestamp) return;

        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item")
        chatItem.dataset.receiverId = chat.receiver_id

        const chatUsername = document.createElement("span")
        chatUsername.classList.add("chat-username");
        chatUsername.textContent = chat.username

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "space-between"

        const chatSnippet = document.createElement("span")
        chatSnippet.classList.add("chat-snippet");
        chatSnippet.textContent =
          chat.last_message || `Say hello to ${chat.username}!`

        const chatTimestamp = document.createElement("span")
        chatTimestamp.classList.add("chat-timestamp");
        chatTimestamp.textContent = chat.timestamp !== "1970-01-01 00:00:00" ? formatTime(chat.timestamp) : " ";

        chatItem.appendChild(chatUsername);
        chatItem.appendChild(container);
        container.appendChild(chatSnippet);
        container.appendChild(chatTimestamp);

        if (selectedChatId === chat.receiver_id) {
          chatItem.classList.add("selected");
        }

        chatItem.addEventListener("click", () => {
          receiverId = chat.receiver_id
          selectedChatId = chat.receiver_id
          loadMessages(receiverId, true);
          messageInput.placeholder = `Send message to ${chat.username}...`;

          messageForm.classList.remove("hidden");
          messageForm.style.display = "flex"

          const previousSelected = document.querySelector(
            ".chat-item.selected"
          );
          if (previousSelected && previousSelected !== chatItem) {
            previousSelected.classList.remove("selected");
          }
          
          chatItem.classList.add("selected");
        });

        chatList.appendChild(chatItem);
      });
    } else {
      chatList.innerHTML = "<div>No users available.</div>"
    }
  }

  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim()

    if (!message || !receiverId) {
      alert("Please select a user and enter a message!");
      return;
    }

    try {
      const response = await fetch(
        "php/send_msg.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            message: message,
            sender_id: loggedInUserId,
            receiver_id: receiverId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send the message");

      messageInput.value = ""
      loadMessages(receiverId, true);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  });

  async function loadMessages(receiverId) {
    if (!receiverId) return;

    try {
      const response = await fetch(
        `php/get_msg.php?sender_id=${loggedInUserId}&receiver_id=${receiverId}`
      );

      if (!response.ok) throw new Error("Failed to load messages");

      const messages = await response.json();
      const newMessageCount = messages.length

      if (newMessageCount != previousMessageCount) {
        previousMessageCount = newMessageCount
        displayMessages(messages, true);
        messageList.scrollTop = messageList.scrollHeight;
      } else {
        displayMessages(messages, false);
      }

      fetchChatList();
    } catch (error) {
      console.error("Error loading messages:", error);
      alert("Failed to load messages.");
    }
  }

  function displayMessages(messages, shouldScroll) {
    messageList.innerHTML = "";

    if (Array.isArray(messages) && messages.length > 0) {
      const fragment = document.createDocumentFragment();
      messages.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message")

        const timestampSpan = document.createElement("span")
        timestampSpan.classList.add("message-timestamp");
        timestampSpan.textContent = msg.timestamp ? formatTime(msg.timestamp) : "Unknown time";

        const alignmentClass = msg.sender_id == loggedInUserId ? "message-right" : "message-left";
        messageDiv.classList.add(alignmentClass);

        messageDiv.textContent = msg.message

        messageDiv.appendChild(timestampSpan)
        fragment.appendChild(messageDiv)
      });

      messageList.appendChild(fragment);

      if (shouldScroll) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    } else {
      messageList.innerHTML =
        "<div class='no-messages'>No messages here yet...</div>";
    }
  }

  function formatTime(timestamp) {
    if (!timestamp) {
      return "Unknown time";
    }
    const timePart = timestamp.split(" ")[1];
    return timePart ? timePart.substring(0, 5) : "Unknown time";
  }

  searchChat.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase()
    const chatItems = document.querySelectorAll(".chat-item")

    chatItems.forEach((item) => {
      const username = item
        .querySelector(".chat-username")
        .textContent.toLowerCase()
      if (username.includes(query)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

  fetchChatList();

  setInterval(() => {
    fetchChatList();
    if (receiverId) {
      loadMessages(receiverId)
    }
  }, 1000);
});
