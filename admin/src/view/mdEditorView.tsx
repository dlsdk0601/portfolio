"use client";

import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { ExecuteState, TextAreaTextApi } from "@uiw/react-md-editor/src/commands";
import { isNil } from "lodash";
import { ValueField } from "../hooks/useValueField";
import useDarkMode from "../hooks/useDarkMode";
import { blockModel } from "../store/blockModel";
import { onNewAsset } from "../ex/fileEx";

const c = [
  commands.bold,
  commands.italic,
  commands.divider,
  commands.hr,
  commands.checkedListCommand,
  commands.codeBlock,
  commands.strikethrough,
  {
    ...commands.image,
    execute: async (state: ExecuteState, api: TextAreaTextApi) => {
      blockModel.setState({ isLock: true });
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;

        if (isNil(files)) {
          return alert("파일 업로드에 실패 했습니다.");
        }

        const file = files[0];

        if (isNil(file)) {
          return alert("파일 업로드에 실패 했습니다.");
        }

        const bsset = await onNewAsset(file);

        if (isNil(bsset)) {
          return alert("파일 업로드에 실패 했습니다.");
        }

        const imageMarkdown = `![${file.name}](${bsset.url})`;
        api.replaceSelection(imageMarkdown);
      };
      input.click();
      blockModel.setState({ isLock: false });
    },
  },
];

const MdEditorView = (props: { field: ValueField<string>; onChange: (value: string) => void }) => {
  const { isDark } = useDarkMode();

  return (
    <div className="markarea">
      <div data-color-mode={isDark ? "dark" : "light"}>
        <MDEditor
          height={300}
          value={props.field.value}
          onChange={(value) => props.onChange(value ?? "")}
          commands={c}
        />
      </div>
    </div>
  );
};

export default MdEditorView;
