import { NextPage } from "next";
import Head from "next/head";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const PrivacyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy</title>
      </Head>

      <MarkdownRenderer url="/privacy.md" />
    </>
  );
};

export default PrivacyPage;
