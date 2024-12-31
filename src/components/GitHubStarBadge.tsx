import axios from "axios";
import { useEffect, useState } from "react";
import Icon from "./Icon";

interface Props {
  className?: string;
}

const GitHubStarBadge = (props: Props) => {
  const { className } = props;
  const [stars, setStars] = useState(0);
  const [isRequesting, setIsRequesting] = useState(true);

  useEffect(() => {
    const getRepoStarCount = async () => {
      let starCount = 0;
      try {
        const { data } = await axios.get(`https://api.github.com/repos/sqlchat/sqlchat`, {
          headers: {
            Accept: "application/vnd.github.v3.star+json",
            Authorization: "",
          },
        });
        starCount = data.stargazers_count as number;
      } catch (error) {
        // do nth
      }

      setStars(starCount);
      setIsRequesting(false);
    };

    getRepoStarCount();
  }, []);

  return (
    <a
      className={`${
        className || ""
      } border dark:border-zinc-600 rounded flex flex-row justify-start items-center text-black dark:text-gray-300 text-xs bg-white dark:bg-zinc-800 shadow-inner overflow-clip hover:opacity-80`}
      href="https://github.com/sqlchat/sqlchat"
      target="_blank"
      aria-label="Star SQL Chat on GitHub"
    >
      <span className="pr-1 pl-1.5 py-0.5 h-full flex flex-row justify-center items-center bg-gray-100 dark:bg-zinc-700 border-r dark:border-zinc-600 font-medium">
        <Icon.IoLogoGithub className="w-4 h-auto mr-0.5" />
        <span className="mt-px">Star</span>
      </span>
      <div className="h-full block px-2 mt-px font-medium">
        {isRequesting ? <Icon.BiLoaderAlt className="w-3 h-auto animate-spin opacity-70" /> : stars}
      </div>
    </a>
  );
};

export default GitHubStarBadge;
