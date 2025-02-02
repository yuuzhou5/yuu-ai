export default function ChatInitialMessage() {
  return (
    <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
      <h1 className="font-bold">Welcome to this example app.</h1>
      <p className="text-muted-foreground text-sm">
        This is a simple Next.JS example application created using{" "}
        <a
          href="https://github.com/jakobhoeg/shadcn-chat"
          className="font-bold inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
        >
          shadcn-chat
          <svg
            aria-hidden="true"
            height="7"
            viewBox="0 0 6 6"
            width="7"
            className="opacity-70"
          >
            <path
              d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>{" "}
        components. It uses{" "}
        <a
          href="https://sdk.vercel.ai/"
          className="font-bold inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
        >
          Vercel AI SDK
          <svg
            aria-hidden="true"
            height="7"
            viewBox="0 0 6 6"
            width="7"
            className="opacity-70"
          >
            <path
              d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>{" "}
        for the AI integration. Build chat interfaces like this at lightspeed
        with shadcn-chat.
      </p>
      <p className="text-muted-foreground text-sm">
        Make sure to also checkout the shadcn-chat support component at the
        bottom right corner.
      </p>
    </div>
  );
}
