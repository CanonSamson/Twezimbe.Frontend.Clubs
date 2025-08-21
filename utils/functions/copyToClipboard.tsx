import Quill from "quill";
import { toast } from "sonner";

export const copyToClipboard = (value: string) => {
  const quill = new Quill(document.createElement("div"), { theme: "snow" });
  quill.enable(false);

  const delta = JSON.parse(value);
  quill.setContents(delta);
  const text = quill.getText();

  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Text copied to clipboard");
    })
    .catch((err) => {});
};
