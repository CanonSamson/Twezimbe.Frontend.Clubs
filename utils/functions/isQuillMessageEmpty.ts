export const isQuillMessageEmpty = (message: string) => {
  try {
    // If it's HTML string
    if (typeof message === "string") {
      const cleaned = message
        ?.replace(/<p>(&nbsp;|\s|<br\s*\/?>)*<\/p>/gi, "")
        ?.replace(/<(.|\n)*?>/g, "")
        ?.trim();
      return !cleaned;
    }

    // If it's Quill Delta (object or stringified)
    const delta = typeof message === "string" ? JSON.parse(message) : message;

    if (delta?.ops?.length === 1 && delta.ops[0].insert.trim() === "\n") {
      return true;
    }

    const insertedText = delta.ops
      .map((op: any) => op.insert)
      .join("")
      .trim();

    return insertedText === "" || insertedText === "\n";
  } catch (err) {
    console.error("Error checking Quill message content:", err);
    return true;
  }
};