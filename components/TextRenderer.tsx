import Quill from "quill";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { GroupMemberType } from "@/api/group";
import UserProfileHint from "./UserProfileHint";
import linkifyHtml from "linkify-html";

interface RendererProps {
  value: string;
  members?: GroupMemberType[] | undefined;
  isCurrentUser?: boolean;
  mentioned?: boolean;
  maxLength?: number;
}

const TextRenderer = ({
  value,
  members,
  isCurrentUser,
  mentioned,
  maxLength,
}: RendererProps) => {
  const [content, setContent] = useState<string>("");
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  // const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   setPosition({
  //     x: Math.round(e.clientX - rect.left),
  //     y: Math.round(e.clientY - rect.top),
  //   });
  // };

  const truncateHtmlText = (html: string, limit: number) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    const quill = new Quill(document.createElement("div"), { theme: "snow" });
    quill.enable(false);

    try {
      const delta = JSON.parse(value);
      quill.setContents(delta);
      const htmlContent = quill.root.innerHTML;

      if (maxLength && maxLength > 0) {
        const truncated = truncateHtmlText(htmlContent, maxLength);
        setContent(truncated);
      } else {
        setContent(htmlContent);
      }
    } catch {
      if (maxLength && maxLength > 0) {
        const truncated = truncateHtmlText(value, maxLength);
        setContent(truncated);
      } else {
        setContent(value);
      }
    }
  }, [value, maxLength]);

  const enhanceMentions = (html: string) => {
    const mentionRegex = /(@\w+)/g;

    const linkedHtml = linkifyHtml(html, {
      defaultProtocol: "https",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-primary ",
      validate: {
        email: false, // Disable email linkification
      },
    });

    return linkedHtml.replace(
      mentionRegex,
      (match) => `<mention>${match}</mention>`
    );
  };

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === "tag" && domNode.name === "a") {
        const element = domNode;
        const linkText = element.children[0]?.data;

        return (
          <span
            className="hover:cursor-pointer no-underline hover:underline duration-600 transition-all text-primary font-semibold bg-primary/10"
            onClick={() => window.open(linkText, "_blank")}
          >
            {linkText}
          </span>
        );
      }

      if (domNode.name === "mention") {
        const mention = domNode.children[0].data.slice(1);
        const member = members?.find(
          (m) => m.user.profile?.userName === mention
        );
        return member ? (
          <UserProfileHint
            align={isCurrentUser ? "end" : "start"}
            user={{
              id: member?.user.id || "",
              userName: mention,
              firstName: member?.user.profile?.firstName || mention,
              lastName: member?.user.profile?.lastName || "",
            }}
          >
            <span
              // onMouseMove={handleMouseMove}
              className="hover:cursor-pointer text-primary font-semibold bg-primary/10"
            >
              @{mention}
            </span>
          </UserProfileHint>
        ) : mentioned || mention === "everyone" || mention === "here" ? (
          <span
            // onMouseMove={handleMouseMove}
            className="hover:cursor-pointer text-primary font-semibold bg-primary/10"
          >
            @{mention}
          </span>
        ) : (
          <span
            // onMouseMove={handleMouseMove}
            className="hover:cursor-pointer font-semibold"
          >
            @{mention}
          </span>
        );
      }
    },
  };

  const parsed = content && parse(enhanceMentions(content), options);

  return <div>{parsed}</div>;
};

export default TextRenderer;
