export function getFileType(name: string) {
    const extension = name.split(".").pop()?.toLowerCase();
    if (!extension) return "Unknown";
  
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Document";
      case "xlsx":
        return "Excel";
      case "ppt":
      case "pptx":
        return "Presentation";
      case "zip":
      case "rar":
        return "Compressed";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "Image";
      default:
        return extension.toUpperCase();
    }
  }
  