// HTML xüsusi simvollarını escape et funksiyası
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Mesaj göndərmə funksiyası
async function sendMessage() {
  const messageInput = document.getElementById("message");
  const chatDiv = document.getElementById("chat");
  const message = messageInput.value.trim();

  if (!message) return;

  // İstifadəçi mesajını chat-ə əlavə et (escape edilmiş)
  chatDiv.innerHTML += `<p><b>Sən:</b> ${escapeHtml(message)}</p>`;
  messageInput.value = "";

  // Scroll-u aşağı endir
  chatDiv.scrollTop = chatDiv.scrollHeight;

  try {
    // Backend server-ə POST request
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // AI cavabı chat-ə əlavə et (escape edilmiş)
    chatDiv.innerHTML += `<p><b>Ruhun Aynası:</b> ${escapeHtml(data.reply)}</p>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;

  } catch (err) {
    console.error(err);
    chatDiv.innerHTML += `<p><b>Ruhun Aynası:</b> Üzr istəyirəm, bir problem yarandı.</p>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }
}

// Enter düyməsi ilə də göndərmək
document.getElementById("message").addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
