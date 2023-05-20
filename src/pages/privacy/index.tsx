import MarkdownRenderer from "@/components/MarkdownRenderer";
import { NextPage } from "next";

const PrivacyPage: NextPage = () => {
  return <MarkdownRenderer url="/privacy.md" />;
};

export default PrivacyPage;
