import { useSession } from "next-auth/react";

const PricingView = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-white dark:bg-zinc-800">
      <div className="whitespace-pre-wrap mx-auto max-w-7xl lg:flex lg:items-center lg:justify-between">
        {JSON.stringify(session, null, "\t")}
      </div>
    </div>
  );
};

export default PricingView;
