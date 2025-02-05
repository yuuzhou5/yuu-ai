import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

import SplitText from "./ui/split-text";

export const Overview = () => {
  const { data: session, status } = useSession();

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex gap-2 flex-col leading-relaxed text-center max-w-xl">
        {status !== "loading" && session?.user?.name && (
          <>
            <SplitText
              text={`Olá, ${session.user.name}!`}
              className="text-2xl font-semibold text-center"
              delay={40}
              animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.2}
              rootMargin="-50px"
            />

            <p className="text-muted-foreground">Como posso te ajudar?</p>
          </>
        )}
      </div>
    </motion.div>
  );
};
