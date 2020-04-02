import * as React from "react";
import { useState } from "react";

import { postFile } from "../util";
import Dropzone from "./dropzone";

interface VideoUploadProps {
}

const VideoUpload: React.FC<VideoUploadProps> = () => {
  const [ progress, setProgress ] = useState<number>(0);
  const [ total, setTotal ] = useState<number>(0);
  const [ displayNotification, setDisplayNotification] = useState<"success" | "error">();

  const startUpload = async (file: File) => {
    try {
      await postFile("/upload", file, (progress) => {
        setProgress(progress.loaded);
        setTotal(progress.total);
      });

      setDisplayNotification("success");
    } catch {
      setDisplayNotification("error");
    } finally {
      setTotal(0);
      setTimeout(() => setDisplayNotification(undefined), 3000);
    }
  };

  const closeNotification = () => {
    setDisplayNotification(undefined);
  };

  return (
    <>
      <h1 className="title">Upload Video</h1>
      {(total > 0) ? (
        <div className="progresscontainer">
          <progress className="progress is-primary" value={progress} max={total} />
        </div>
      ) : (
        <Dropzone size={["100%", 300]} onFileDropped={startUpload} />
      )}

      {(displayNotification == "success") ? (
        <div className="notification is-success fixed-notification">
          <button className="delete" onClick={closeNotification}></button>
          File successfully uploaded
        </div>
      ) : (displayNotification == "error") ? (
        <div className="notification is-error fixed-notification">
          <button className="delete" onClick={closeNotification}></button>
          Could not upload file
        </div>
      ) : null}
    </>
  );
};

export default VideoUpload;
