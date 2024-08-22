"use client";

import { isNil } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { cPk, isNewPk } from "../../ex/query";
import { Replace } from "../layout/layoutSelector";
import { Urls } from "../../url/url.g";
import { ProjectShowRes, ProjectType, projectTypeValues, toProjectType } from "../../api/schema.g";
import { ignorePromise, isNotBlank, isNotNil, preventDefaulted } from "../../ex/utils";
import { api } from "../../api/api";
import { SelectFieldView } from "../selectView";
import TextFieldView, { ReadyOnlyView, TextAreaFieldView } from "../textFieldView";
import { useMomentField, useStringField, useTypeField } from "../../hooks/useValueField";
import { validateFields, vLength, vRequired, vUrl } from "../../ex/validate";
import { d1 } from "../../ex/dateEx";
import MdEditorView from "../mdEditorView";
import DatePickerView from "../datePickerView";

export const ProjectEditView = (props: { pk: cPk | null }) => {
  const pk = props.pk;

  if (isNil(pk)) {
    return <Replace url={Urls.account.page.url()} />;
  }

  const [project, setProject] = useState<ProjectShowRes | null>(null);

  useEffect(() => {
    if (isNewPk(pk)) {
      return;
    }

    ignorePromise(() => init(pk));
  }, [pk]);

  const init = useCallback(async (p: number) => {
    const res = await api.projectShow({ pk: p });

    if (isNil(res)) {
      return;
    }

    setProject({ ...res });
  }, []);

  return <ProjectFormEditView project={project} />;
};

export const ProjectFormEditView = (props: { project: ProjectShowRes | null }) => {
  const router = useRouter();

  const project = props.project;
  const [type, setType] = useTypeField<ProjectType>("프로젝트 유형", vRequired);
  const [title, setTitle] = useStringField("제목", vRequired, vLength(128));
  const [description, setDescription] = useStringField("설명", vRequired);
  const [websiteUrl, setWebsiteUrl] = useStringField("웹사이트 주소", vUrl, vLength(128));
  const [githubUrl, setGithubUrl] = useStringField("깃허브 주소", vUrl, vLength(128));
  const [mainText, setMainText] = useStringField("메인 설명", vRequired);
  const [issueAt, setIssueAt] = useMomentField("배포 일자", vRequired);
  const [createAt, setCreateAt] = useState<string>("");
  const [updateAt, setUpdateAt] = useState<string>("");

  useEffect(() => {
    if (isNil(project)) {
      return;
    }

    setType.set(project.type);
    setTitle.set(project.title);
    setDescription.set(project.description);
    setWebsiteUrl.set(project.websiteUrl);
    setGithubUrl.set(project.githubUrl);
    setMainText.set(project.mainText);
    setIssueAt.set(moment(project.issueAt));
    setCreateAt(d1(project.createAt));

    if (isNotNil(project.updateAt)) {
      setUpdateAt(d1(project.updateAt));
    }
  }, [project]);

  const onSubmit = useCallback(async () => {
    const isValid = validateFields([
      setType,
      setTitle,
      setDescription,
      setWebsiteUrl,
      setMainText,
      setIssueAt,
    ]);

    if (!isValid || isNil(type.value) || isNil(issueAt.value)) {
      alert("데이터가 유효하지 않습니다.");
      return;
    }

    // githubUrl 은 필수가 아니라서 따로 처리 한다.
    if (isNotBlank(githubUrl.value)) {
      const isValidGithubUrl = setGithubUrl.validate();
      if (isValidGithubUrl) {
        alert("데이터가 유효하지 않습니다.");
        return;
      }
    }

    const res = await api.projectEdit({
      pk: project?.pk ?? null,
      type: type.value,
      title: title.value,
      description: description.value,
      websiteUrl: websiteUrl.value,
      githubUrl: githubUrl.value,
      mainText: mainText.value,
      issueAt: issueAt.value.toISOString(true),
    });

    if (isNil(res)) {
      return;
    }

    alert("저장되었습니다.");
    router.replace(Urls.project["[pk]"].page.url({ pk: res.pk }));
  }, [project, type, title, description, websiteUrl, githubUrl, mainText, issueAt]);

  return (
    <form onSubmit={preventDefaulted(() => onSubmit())}>
      <div className="flex flex-col gap-5.5 sm:flex-row">
        <ReadyOnlyView placeholder="생성 내역이 없습니다." field={createAt} label="생성일자" />
        <ReadyOnlyView placeholder="수정 내역이 없습니다." field={updateAt} label="수정일자" />
      </div>
      <SelectFieldView<ProjectType>
        field={type}
        options={projectTypeValues}
        onChange={(value) => setType.set(value)}
        mapper={toProjectType}
      />
      <TextFieldView field={title} onChange={(value) => setTitle.set(value)} />
      <TextFieldView field={websiteUrl} onChange={(value) => setWebsiteUrl.set(value)} />
      <TextFieldView field={githubUrl} onChange={(value) => setGithubUrl.set(value)} />
      <DatePickerView field={issueAt} onChange={(value) => setIssueAt.set(moment(value))} />
      <TextAreaFieldView field={description} onChange={(value) => setDescription.set(value)} />

      <MdEditorView height={750} field={mainText} onChange={(value) => setMainText.set(value)} />

      <ProjectEditButtonView pk={project?.pk} />
    </form>
  );
};

const ProjectEditButtonView = (props: { pk?: number }) => {
  const router = useRouter();
  const pk = props.pk;

  const onDelete = useCallback(async () => {
    if (isNil(pk)) {
      return;
    }

    if (!confirm("삭제 하시겠습니까?")) {
      return;
    }

    const res = await api.projectDelete({ pk });

    if (isNil(res)) {
      return;
    }

    alert("삭제 되었습니다.");
    router.replace(Urls.project.page.url({}));
  }, [pk]);

  return (
    <div className="flex justify-end gap-4.5">
      {isNotNil(pk) && (
        <button
          type="button"
          className="mr-2 flex justify-center rounded bg-danger px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          onClick={() => onDelete()}
        >
          Delete
        </button>
      )}
      <button
        type="submit"
        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
      >
        Save
      </button>
    </div>
  );
};
