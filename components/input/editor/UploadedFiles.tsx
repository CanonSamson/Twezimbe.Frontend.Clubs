import UploadedFileCard from "./UploadedFileCard";

const UploadedFiles = ({
  fileUrls,
  removeFile,
}: {
  fileUrls: {
    [key: string]: {
      url: string;
      id: string;
      file: File | null;
      uploading: boolean;
      completed: boolean;
    };
  };
  removeFile: (id: string) => void;
}) => {
  return (
    <>
      {Object.values(fileUrls).length > 0 && (
        <div className=" ml-2 flex w-full  items-center gap-2">
          {Object.values(fileUrls).map((image, index) => {
            return (
              <UploadedFileCard
                key={index}
                completed={image.completed}
                uploading={image.uploading}
                url={image?.url}
                file={image.file}
                removeFile={() => removeFile(image.id)}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default UploadedFiles;
