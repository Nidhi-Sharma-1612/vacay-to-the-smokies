import Script from "next/script";

const AKIA_SRC = "https://sys.akia.ai/website_chat_js/f664fb45-8cd7-42b8-81f2-809c478571b4/chat.js";

/** Akia guest chat widget (embed code supplied by the owner). Loads after the page so it never slows first paint. */
export function AkiaChat() {
  return (
    <>
      <Script src={AKIA_SRC} strategy="afterInteractive" />
      <a href="https://www.akia.com/powered-by-akia?hotel_name=Vacay%20to%20the%20Smokies" rel="dofollow" style={{ display: "none" }}>
        Chat with us
      </a>
      <noscript>
        <a href="https://www.akia.com/enable-javascript" rel="dofollow">
          Chat with us
        </a>
      </noscript>
    </>
  );
}
