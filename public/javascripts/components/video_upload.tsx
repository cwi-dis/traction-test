import * as React from "react";
import { useState } from "react";

import { postFile } from "../util";
import Dropzone from "./dropzone";

interface VideoUploadProps {
}

const VideoUpload: React.FC<VideoUploadProps> = () => {
  const [ progress, setProgress ] = useState<number>(0);
  const [ total, setTotal ] = useState<number>(0);

  const startUpload = (file: File) => {
    postFile("/upload", file, (progress) => {
      setProgress(progress.loaded);
      setTotal(progress.total);
    }).then(() => {
      setTotal(0);
    });
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
    </>
  );
};

export default VideoUpload;
