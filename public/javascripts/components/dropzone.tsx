import * as React from "react";
import { useState } from "react";
import * as classNames from "classnames";

interface DropzoneProps {
  onFileDropped: (f: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = (props) => {
  const { onFileDropped } = props;
  const [ dropzoneEntered, setDropzoneEntered ] = useState(false);

  const parseFormData = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log("File dropped");
    const file = e.dataTransfer.files.item(0);

    if (file) {
      onFileDropped(file);
    }
  }

  return (
    <div>
      <div
        style={{ width: 300, height: 300 }}
        className={classNames("dropzone", { "dropzone-entered": dropzoneEntered })}
        onDragEnter={() => setDropzoneEntered(true)}
        onDragLeave={() => setDropzoneEntered(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={parseFormData}
      >
        Drop a file here
      </div>
    </div>
  );
}

export default Dropzone;
