import React, { useEffect,  useState } from "react";
import { getLinkPreview } from "link-preview-js";

import Quill from "quill";
import Image from "next/image";

interface LinkPreviewCardProps {
  text: string;
}

const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({ text }) => {
  const [previews, setPreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");

  // Function to extract all URLs from the text
  const extractLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  useEffect(() => {
    const quill = new Quill(document.createElement("div"), { theme: "snow" });
    quill.enable(false);

    let parsedContents;
    try {
      parsedContents = JSON.parse(text);
    } catch {
      setContent(`${text}`);
      return;
    }

    quill.setContents(parsedContents);
    const quillText = quill.getText();
    setContent(quillText);

    return () => {
      setContent("");
    };
  }, [text]);

  useEffect(() => {
    const fetchPreviews = async () => {
      setLoading(true);
      setError(null);
      const links = extractLinks(content);
      const previewsData: any[] = [];

      for (const link of links) {
        try {
          const data = await getLinkPreview(link);
          previewsData.push(data);
        } catch (error: any) {
          console.error("Error fetching preview for:", link, error);
          setError("There was an error fetching the link previews.");
        }
      }

      setPreviews(previewsData);
      setLoading(false);
    };

    if (content) {
      fetchPreviews();
    }
  }, [content]);

  if (loading) return <p>Loading previews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {previews.length === 0 ? (
        <p>No previews available.</p>
      ) : (
        previews.map((preview, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            {"images" in preview && preview.images.length > 0 && (
              <Image
                src={preview.images[0]}
                alt={("title" in preview && preview.title) || "Link Image"}
                style={{ width: "100px", height: "auto" }}
                width={200}
                height={200}
              />
            )}
            <h3>
              {("title" in preview && preview.title) || "No title available"}
            </h3>
            <p>
              {("description" in preview && preview.description) ||
                "No description available"}
            </p>
            <a href={preview.url} target="_blank" rel="noopener noreferrer">
              {preview.url}
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default LinkPreviewCard;
