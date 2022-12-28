import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const TradingRecord = (): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-xl md:text-4xl lg:text-6xl text-stone-800">
          My Trading Records
        </h1>
      </motion.div>
    </div>
  );
};

export default TradingRecord;
