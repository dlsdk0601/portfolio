import { isNil, reduce } from "lodash";

export function transformKoreanPostPosition(sentence: string): string {
  return reduce(
    [
      ["이", "가"],
      ["은", "는"],
      ["을", "를"],
      ["으로", "로"],
    ] as [string, string][],
    (sentence, [withBottom, withoutBottom]) => {
      return transformKoreanPostPositionWith(sentence, withBottom, withoutBottom);
    },
    sentence,
  );
}

export const k = transformKoreanPostPosition;

export function transformKoreanPostPositionWith(
  sentence: string,
  withBottomConsonants: string,
  withoutBottomConsonants: string,
): string {
  const target = `(${withBottomConsonants}|${withoutBottomConsonants})`;
  const targetIndex = sentence.indexOf(target);
  // 변경할 내용이 없다.
  if (targetIndex === -1) {
    return sentence;
  }
  // 대상이 없는 경우 문장이 '('으로 시작할때
  if (targetIndex < 1) {
    // eslint-disable-next-line no-console
    console.error("잘못된 사용법 - 선택 조사가 문장 처음이다.");
    return sentence;
  }
  // 대상이 한글이 아닌경우
  const char = sentence[targetIndex - 1];
  if (isNil(char)) {
    // eslint-disable-next-line no-console
    console.error(
      "알고리즘 오류 - 선택된 조사가 문장 처음이 아니기 때문에 한칸 선두의 글자는 반드시 있어야 한다.",
    );
    return sentence;
  }
  if (!/[가-힣]/.test(char)) {
    // eslint-disable-next-line no-console
    console.error("잘못된 사용법 - 선택 조사는 한글 뒤에 위치해야 한다.");
    return sentence;
  }
  const nfdChar = char.normalize("NFD");
  const replaced = sentence.replace(
    char + target,
    char + (nfdChar.length === 3 ? withBottomConsonants : withoutBottomConsonants),
  );
  return transformKoreanPostPositionWith(replaced, withBottomConsonants, withoutBottomConsonants);
}
