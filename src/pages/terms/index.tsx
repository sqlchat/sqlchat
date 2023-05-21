import MarkdownRenderer from "@/components/MarkdownRenderer";
import { NextPage } from "next";

const PrivacyPage: NextPage = () => {
  return <MarkdownRenderer url="/terms.md" />;
};

export default PrivacyPage;
