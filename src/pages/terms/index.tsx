import { NextPage } from "next";
import Head from "next/head";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const PrivacyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terms</title>
      </Head>

      <MarkdownRenderer url="/terms.md" />
    </>
  );
};

export default PrivacyPage;
