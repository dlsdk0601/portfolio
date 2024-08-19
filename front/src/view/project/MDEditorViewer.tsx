"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const MdEditorViewer = (props: { mainText: string }) => {
  return (
    <div className="markdownDiv" data-color-mode="light">
      <MDEditor.Markdown className="p-[20px]" source={props.mainText} />
    </div>
  );
};

export default MdEditorViewer;
