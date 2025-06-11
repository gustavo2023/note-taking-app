const DRAFT_KEY = "noteAppDraft";

const saveDraft = (content) => {
  if (typeof content !== "string") {
    console.error("Invalid draft content: Must be a string.");
    return;
  }
  try {
    sessionStorage.setItem(DRAFT_KEY, content);
  } catch (error) {
    console.error("Error saving draft to sessionStorage:", error);
  }
};

const loadDraft = () => {
  const draft = sessionStorage.getItem(DRAFT_KEY);

  return draft || "";
};

const clearDraft = () => {
  sessionStorage.removeItem(DRAFT_KEY);
};

export { saveDraft, loadDraft, clearDraft };
