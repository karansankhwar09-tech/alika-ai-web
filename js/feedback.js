// Community Feedback Hub - Secure Storage & Safe DOM Rendering
let feedbackData = JSON.parse(localStorage.getItem("alika_feedbacks")) || [];
let activeFilter = "All";

function saveAndRender() {
  localStorage.setItem("alika_feedbacks", JSON.stringify(feedbackData));
  renderComments();
}

function submitRootFeedback() {
  const nameInput = document.getElementById("fb-name");
  const tagSelect = document.getElementById("fb-tag");
  const contentInput = document.getElementById("fb-content");

  const name = nameInput.value.trim() || "User";
  const tag = tagSelect.value;
  const content = contentInput.value.trim();

  if (!content) return alert("Please type your feedback before transmitting!");

  const newPost = {
    id: "fb_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: name,
    tag: tag,
    content: content,
    timestamp: new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    upvotes: 0,
    replies: []
  };

  feedbackData.unshift(newPost);
  contentInput.value = "";
  saveAndRender();
}

function renderTree(item, isRoot = false) {
  const node = document.createElement("div");
  node.className = isRoot ? "root-comment" : "comment-node";
  node.id = item.id;

  // Metadata row (Author, Category Badge, Timestamp)
  const meta = document.createElement("div");
  meta.className = "comment-meta";

  const userTag = document.createElement("span");
  userTag.className = "user-tag";
  userTag.textContent = item.name || "User";
  meta.appendChild(userTag);

  if (item.tag) {
    const badge = document.createElement("span");
    const allowedTags = ["General", "Bug", "Feature", "Query"];
    const safeTagClass = allowedTags.includes(item.tag) ? item.tag : "General";
    badge.className = `badge-tag badge-${safeTagClass}`;
    badge.textContent = item.tag;
    meta.appendChild(badge);
  }

  const timeStamp = document.createElement("span");
  timeStamp.className = "time-stamp";
  timeStamp.textContent = item.timestamp || "";
  meta.appendChild(timeStamp);

  node.appendChild(meta);

  // Content body - Safe DOM text node
  const body = document.createElement("div");
  body.className = "comment-body";
  body.textContent = item.content || "";
  node.appendChild(body);

  // Comment controls (Upvote & Reply buttons)
  const controls = document.createElement("div");
  controls.className = "comment-controls";

  const upvoteBtn = document.createElement("button");
  upvoteBtn.className = "control-btn";
  upvoteBtn.type = "button";
  upvoteBtn.onclick = function() { upvote(item.id); };
  
  const upvoteIcon = document.createTextNode("▲ ");
  const upvoteCount = document.createElement("span");
  upvoteCount.textContent = (typeof item.upvotes === 'number' && !isNaN(item.upvotes)) ? item.upvotes : 0;
  upvoteBtn.appendChild(upvoteIcon);
  upvoteBtn.appendChild(upvoteCount);
  controls.appendChild(upvoteBtn);

  const replyBtn = document.createElement("button");
  replyBtn.className = "control-btn";
  replyBtn.type = "button";
  replyBtn.onclick = function() { toggleReplyBox(item.id); };
  replyBtn.textContent = "💬 Reply";
  controls.appendChild(replyBtn);

  node.appendChild(controls);

  // Reply input box
  const replyBox = document.createElement("div");
  replyBox.id = "reply-box-" + item.id;
  replyBox.className = "reply-input-box";
  replyBox.style.display = "none";

  const replyNameInput = document.createElement("input");
  replyNameInput.type = "text";
  replyNameInput.id = "reply-name-" + item.id;
  replyNameInput.placeholder = "Your Name";
  replyNameInput.setAttribute("aria-label", "Your Name");
  replyNameInput.style.cssText = "width: 130px; margin-bottom: 6px; font-size: 12px; padding: 4px 8px;";
  replyBox.appendChild(replyNameInput);

  const replyTextArea = document.createElement("textarea");
  replyTextArea.id = "reply-text-" + item.id;
  replyTextArea.rows = 2;
  replyTextArea.placeholder = "Write a direct response...";
  replyTextArea.setAttribute("aria-label", "Write a direct response");
  replyTextArea.style.fontSize = "13px";
  replyBox.appendChild(replyTextArea);

  const actionDiv = document.createElement("div");
  actionDiv.style.cssText = "text-align: right; margin-top: 6px;";

  const sendReplyBtn = document.createElement("button");
  sendReplyBtn.className = "neon-btn";
  sendReplyBtn.type = "button";
  sendReplyBtn.style.cssText = "padding: 4px 10px; font-size: 12px;";
  sendReplyBtn.textContent = "Send Reply";
  sendReplyBtn.onclick = function() { addReply(item.id); };
  actionDiv.appendChild(sendReplyBtn);

  replyBox.appendChild(actionDiv);
  node.appendChild(replyBox);

  // Nested replies wrapper
  const repliesWrapper = document.createElement("div");
  repliesWrapper.className = "replies-wrapper";
  repliesWrapper.id = "replies-" + item.id;

  if (Array.isArray(item.replies) && item.replies.length > 0) {
    item.replies.forEach(reply => {
      repliesWrapper.appendChild(renderTree(reply, false));
    });
  }
  node.appendChild(repliesWrapper);

  return node;
}

function renderComments() {
  const container = document.getElementById("comments-tree");
  if (!container) return;
  container.innerHTML = "";

  const filtered = activeFilter === "All" 
    ? feedbackData 
    : feedbackData.filter(i => i.tag === activeFilter);

  const totalThreadsElem = document.getElementById("total-threads");
  if (totalThreadsElem) {
    totalThreadsElem.textContent = filtered.length + " Feedback Threads";
  }

  filtered.forEach(item => {
    container.appendChild(renderTree(item, true));
  });
}

function toggleReplyBox(id) {
  const box = document.getElementById('reply-box-' + id);
  if (!box) return;
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function findAndAddReply(list, targetId, newReply) {
  for (let item of list) {
    if (item.id === targetId) {
      if (!Array.isArray(item.replies)) item.replies = [];
      item.replies.push(newReply);
      return true;
    }
    if (item.replies && item.replies.length > 0) {
      if (findAndAddReply(item.replies, targetId, newReply)) return true;
    }
  }
  return false;
}

function addReply(parentId) {
  const nameInput = document.getElementById('reply-name-' + parentId);
  const textInput = document.getElementById('reply-text-' + parentId);
  if (!nameInput || !textInput) return;

  const name = nameInput.value.trim() || "Anonymous";
  const text = textInput.value.trim();
  if (!text) return;

  const replyObj = {
    id: "rep_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: name,
    content: text,
    timestamp: new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    upvotes: 0,
    replies: []
  };

  findAndAddReply(feedbackData, parentId, replyObj);
  saveAndRender();
}

function findAndUpvote(list, id) {
  for (let item of list) {
    if (item.id === id) {
      item.upvotes = (Number(item.upvotes) || 0) + 1;
      return true;
    }
    if (item.replies && findAndUpvote(item.replies, id)) return true;
  }
  return false;
}

function upvote(id) {
  findAndUpvote(feedbackData, id);
  saveAndRender();
}

function filterComments(tag) {
  activeFilter = tag;
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText.includes(tag) || (tag === "All" && btn.innerText === "All"));
  });
  renderComments();
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

renderComments();

// Giscus GitHub Discussions Integration
const GISCUS_CONFIG = {
  repo: "karansankhwar09-tech/alika-ai-web",
  repoId: "R_kgDOUqWz1g",
  category: "General",
  categoryId: "DIC_kwDOUqWz1s4DLt_N",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  theme: "transparent_dark",
  lang: "en",
  loading: "lazy"
};

function initGiscus() {
  const thread = document.getElementById("giscus-thread");
  const statusText = document.getElementById("giscus-status-text");
  const placeholder = document.getElementById("giscus-placeholder");

  if (!thread) return;

  if (GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId) {
    if (placeholder) placeholder.style.display = "none";
    if (statusText) statusText.textContent = "Connecting to GitHub Discussions...";

    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.setAttribute("data-repo", GISCUS_CONFIG.repo);
    s.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    s.setAttribute("data-category", GISCUS_CONFIG.category);
    s.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    s.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
    s.setAttribute("data-strict", GISCUS_CONFIG.strict);
    s.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
    s.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
    s.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
    s.setAttribute("data-theme", GISCUS_CONFIG.theme);
    s.setAttribute("data-lang", GISCUS_CONFIG.lang);
    s.setAttribute("data-loading", GISCUS_CONFIG.loading);
    s.crossOrigin = "anonymous";
    s.async = true;

    s.onload = function() {
      if (statusText) statusText.textContent = "GitHub Discussions Connected";
    };
    s.onerror = function() {
      if (statusText) statusText.textContent = "Discussions Offline (Use Direct Links)";
      if (placeholder) placeholder.style.display = "block";
    };

    thread.appendChild(s);
  }
}

// Maintainer Guide Toggle
const guideBtn = document.getElementById("toggleMaintainerGuideBtn");
const guideBox = document.getElementById("maintainerGuide");
if (guideBtn && guideBox) {
  guideBtn.addEventListener("click", function() {
    guideBox.classList.toggle("hidden");
  });
}

// Local Sandbox Toggle
const sandboxBtn = document.getElementById("toggleLocalSandboxBtn");
const sandboxContainer = document.getElementById("localSandboxContainer");
const sandboxArrow = document.getElementById("sandboxToggleArrow");
if (sandboxBtn && sandboxContainer) {
  sandboxBtn.addEventListener("click", function() {
    const isHidden = sandboxContainer.classList.contains("hidden");
    sandboxContainer.classList.toggle("hidden", !isHidden);
    sandboxBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    if (sandboxArrow) sandboxArrow.innerHTML = isHidden ? "&uarr;" : "&darr;";
  });
}

initGiscus();
// Explicit Window Global Exports for HTML inline event handlers
if (typeof window !== "undefined") {
  window.submitRootFeedback = submitRootFeedback;
  window.filterComments = filterComments;
  window.upvote = upvote;
  window.addReply = addReply;
  window.toggleReplyBox = toggleReplyBox;
  window.initGiscus = initGiscus;
}
