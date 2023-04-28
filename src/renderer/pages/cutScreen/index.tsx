import React, { ReactElement, useCallback } from "react";
import Screenshots, { Bounds } from "react-screenshots";

export default function App(): ReactElement {
  const onSave = useCallback((blob: Blob, bounds: Bounds) => {
    console.log("save", blob, bounds);
    console.log(URL.createObjectURL(blob));
  }, []);
  const onCancel = useCallback(() => {
    console.log("cancel");
  }, []);
  const onOk = useCallback((blob: Blob, bounds: Bounds) => {
    console.log("ok", blob, bounds);
    console.log(URL.createObjectURL(blob));
  }, []);

  return (
    <Screenshots
      url={"/assets/imgs/1.jpg"}
      width={window.innerWidth}
      height={window.innerHeight}
      onSave={onSave}
      onCancel={onCancel}
      onOk={onOk}
    />
  );
}
