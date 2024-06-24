import path from "path";
import * as fs from "node:fs";
import { generateApi } from "swagger-typescript-api";
import prettier from "prettier";
import { ignorePromise } from "../src/ex/utils";

const transform = async (input: string) => {
  const data = await generateApi({
    input,
    output: false,
    templates: input,
    generateClient: false,
    generateResponses: false,
    toJS: false,
    enumNamesAsValues: true,
    modular: true,
    hooks: {
      onParseSchema: (originalSchema, parsedSchema) => {
        if (originalSchema.type === "json") {
          // eslint-disable-next-line no-param-reassign
          parsedSchema.content = "JSON";
        }

        return parsedSchema;
      },
    },
  });

  const ts: string[] = [];
  ts.push("/* tslint:disable */");
  ts.push("/* eslint-disable */");
  ts.push(`// 자동 생성 파일 수정하지 말것 ${new Date().toString()}`);
  data.files.forEach((item) => {
    ts.push(item.fileContent);
  });

  const targetPath = path.join(__dirname, "..", "/src/api/schema.g.ts");
  const tsFormatted = await prettier.format(ts.join("\n"), { filepath: targetPath });
  fs.writeFileSync(targetPath, tsFormatted);
};

ignorePromise(() => transform(path.resolve(process.cwd(), "openapi.json")));
