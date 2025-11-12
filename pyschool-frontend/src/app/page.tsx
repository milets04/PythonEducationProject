"use client";

import React from "react";
import Logs, { TopicVersion } from "@/ui/components/organisms/logs";

const topicHistory: TopicVersion[] = [
  { id: 31, createdAt: "2025-11-10 21:35:16.496" },
  { id: 25, createdAt: "2025-11-10 21:06:21.690" }, 
];
export default function Page() {
  return (
    <div>
      <Logs versions={topicHistory} />
    </div>
  );
}