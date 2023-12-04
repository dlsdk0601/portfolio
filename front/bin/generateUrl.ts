import path from "path";
import * as fs from "fs";
import prettier from "prettier";
import { isNotBlank, removeSuffix } from "../src/ex/utils";

// webstorm 에서 ts-node 설정을 읽지를 못한다.
export {};

type Page = {
  kind: "page";
  readonly name: string;
};

type Dir = {
  kind: "dir";
  readonly name: string;
  readonly children: Array<Page | Dir>;
};

function parseSource(parentDir: string): Array<Page | Dir> {
  const entries = fs.readdirSync(parentDir, { withFileTypes: true });
  // eslint-disable-next-line no-array-constructor
  const contents = Array<Page | Dir>();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) {
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".tsx") && !entry.name.startsWith("_")) {
      contents.push({
        kind: "page",
        name: removeSuffix(entry.name, ".tsx"),
      });
      continue;
    }

    if (entry.isDirectory()) {
      const children = parseSource(path.join(parentDir, entry.name));
      if (isNotBlank(children)) {
        contents.push({ kind: "dir", name: entry.name, children });
      }
    }
  }

  return contents;
}

function generateSources(pages: Array<Page | Dir>, parents: string[]): string[] {
  return pages.flatMap((page) => generateSource(page, parents));
}

function generateSource(page: Page | Dir, parents: string[]): string[] {
  // eslint-disable-next-line no-array-constructor
  const lines = Array<string>();
  const newParents = [...parents, page.name === "index" ? "" : page.name];
  switch (page.kind) {
    case "page": {
      const pathname = `/${newParents.join("/")}`;
      const key = `"${page.name}"`;
      lines.push(
        `${key}: new PageUrl("${
          pathname.endsWith("/") && pathname !== "/"
            ? pathname.substring(0, pathname.length - 1)
            : pathname
        }"),`,
      );
      break;
    }
    case "dir":
    default: {
      lines.push(`"${page.name}" : {`);
      lines.push(...generateSources(page.children, newParents));
      lines.push("},");
      break;
    }
  }

  return lines;
}

const pagesDir = path.join(__dirname, "..", "src/pages");
const pages = parseSource(pagesDir);

// eslint-disable-next-line no-array-constructor
const ts = Array<string>();
ts.push("/* tslint:disable */");
ts.push("/* eslint-disable */");
ts.push(`// 자동 생성 파일 수정하지 말것 ${new Date().toString()}`);
ts.push("import { PageUrl } from './url';");
ts.push("export const Urls = {");
ts.push(...generateSources(pages, []));
ts.push("};");

const targetPath = path.join(__dirname, "..", "src/url/url.g.ts");
prettier.format(ts.join("\n"), { filepath: targetPath }).then(res=> {
  fs.writeFileSync(targetPath, res);
});
