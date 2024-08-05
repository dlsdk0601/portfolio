import Link from "next/link";
import { Urls } from "../../url/url.g";

const NotFound = () => {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:py-20">
        <div className="mx-auto max-w-[410px]">
          <img
            alt="illustration"
            className="h-[400px] w-[400px] text-transparent"
            src="/assets/images/illustration/illustration-01.svg"
          />
          <div className="mt-7.5 text-center">
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
              페이지 및 데이터를 찾을 수 없습니다.
            </h2>
            <Link
              className="mt-7.5 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
              href={Urls.account.page.url({})}
            >
              <i className="mdi mdi-keyboard-backspace text-2xl" />
              <span>Home 으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
