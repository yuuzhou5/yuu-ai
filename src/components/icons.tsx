import React from "react";

import { cn } from "@/lib/utils";

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  Google: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  ),
  Discord: (props: IconProps) => (
    <svg
      width="24px"
      height="24px"
      viewBox="0 -28.5 256 256"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <g>
        <path
          d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
          fill="#5865F2"
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  ),
  OpenAI: ({ className, ...props }: IconProps) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-foreground", className)}
      {...props}
    >
      <title>OpenAI</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
  DeepSeek: (props: IconProps) => (
    <svg
      height="1em"
      style={{
        flex: "none",
        lineHeight: 1,
      }}
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078.253.253 0 01-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
        fill="#4D6BFE"
      />
    </svg>
  ),
  Meta: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={100}
      height={100}
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="#0081fb"
        d="M47 29.36l-2.193 1.663L42.62 29.5c0-.16 0-.33-.01-.5 0-.16 0-.33-.01-.5-.14-3.94-1.14-8.16-3.14-11.25-1.54-2.37-3.51-3.5-5.71-3.5-2.31 0-4.19 1.38-6.27 4.38-.06.09-.13.18-.19.28-.04.05-.07.1-.11.16-.1.15-.2.3-.3.46-.9 1.4-1.84 3.03-2.86 4.83-.09.17-.19.34-.28.51-.03.04-.06.09-.08.13l-.21.37-1.24 2.19c-2.91 5.15-3.65 6.33-5.1 8.26-2.55 3.39-4.73 4.68-7.6 4.68-3.4 0-5.56-1.47-6.89-3.69C1.53 34.51 1 32.14 1 29.44l4.97.17c0 1.76.38 3.1.89 3.92C7.52 34.59 8.49 35 9.5 35c1.29 0 2.49-.27 4.77-3.43 1.83-2.53 3.99-6.07 5.44-8.3l1.37-2.09.29-.46.3-.45.5-.77c.76-1.16 1.58-2.39 2.46-3.57.1-.14.2-.28.31-.42.1-.14.21-.28.31-.41.9-1.15 1.85-2.22 2.87-3.1 1.85-1.61 3.84-2.5 5.85-2.5 3.37 0 6.58 1.95 9.04 5.61 2.51 3.74 3.82 8.4 3.97 13.25.01.16.01.33.01.5.01.17.01.33.01.5z"
      />
      <linearGradient
        id="a"
        x1={42.304}
        x2={13.533}
        y1={24.75}
        y2={24.75}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#0081fb" />
        <stop offset={0.995} stopColor="#0064e1" />
      </linearGradient>
      <path
        fill="url(#a)"
        d="M4.918 15.456C7.195 11.951 10.483 9.5 14.253 9.5c2.184 0 4.354.645 6.621 2.493 2.479 2.02 5.122 5.346 8.419 10.828l1.182 1.967c2.854 4.746 4.477 7.187 5.428 8.339C37.125 34.606 37.888 35 39 35c2.82 0 3.617-2.54 3.617-5.501L47 29.362c0 3.095-.611 5.369-1.651 7.165C44.345 38.264 42.387 40 39.093 40c-2.048 0-3.862-.444-5.868-2.333-1.542-1.45-3.345-4.026-4.732-6.341l-4.126-6.879c-2.07-3.452-3.969-6.027-5.068-7.192-1.182-1.254-2.642-2.754-5.067-2.754-1.963 0-3.689 1.362-5.084 3.465l-4.23-2.51z"
      />
      <linearGradient
        id="b"
        x1={7.635}
        x2={7.635}
        y1={32.87}
        y2={13.012}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#0081fb" />
        <stop offset={0.995} stopColor="#0064e1" />
      </linearGradient>
      <path
        fill="url(#b)"
        d="M14.25 14.5c-1.959 0-3.683 1.362-5.075 3.465C7.206 20.937 6 25.363 6 29.614c0 1.753-.003 3.072.5 3.886l-3.84 2.813C1.574 34.507 1 32.2 1 29.5c0-4.91 1.355-10.091 3.918-14.044C7.192 11.951 10.507 9.5 14.27 9.5l-.02 5z"
      />
      <path
        d="M21.67 20.27l-.3.45-.29.46a68.65 68.65 0 012.37 3.69l.21-.37c.02-.04.05-.09.08-.13.09-.17.19-.34.28-.51-.83-1.36-1.63-2.57-2.35-3.59zm3.27-4.76c-.11.14-.21.28-.31.42.73.91 1.47 1.94 2.25 3.1.1-.16.2-.31.3-.46.04-.06.07-.11.11-.16.06-.1.13-.19.19-.28a44.36 44.36 0 00-2.23-3.03c-.1.13-.21.27-.31.41z"
        opacity={0.05}
      />
      <path
        d="M21.67 20.27l-.3.45a72.57 72.57 0 012.37 3.65c.09-.17.19-.34.28-.51-.83-1.36-1.63-2.57-2.35-3.59zm2.96-4.34c.73.91 1.47 1.94 2.25 3.1.1-.16.2-.31.3-.46-.77-1.14-1.52-2.16-2.24-3.06-.11.14-.21.28-.31.42z"
        opacity={0.07}
      />
    </svg>
  ),
  Anthropic: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 92.2 65"
      xmlSpace="preserve"
      {...props}
    >
      <path
        d="M66.5 0H52.4l25.7 65h14.1L66.5 0zM25.7 0L0 65h14.4l5.3-13.6h26.9L51.8 65h14.4L40.5 0H25.7zm-1.4 39.3l8.8-22.8 8.8 22.8H24.3z"
        className="fill-[#181818] dark:fill-white"
      />
    </svg>
  ),
};
