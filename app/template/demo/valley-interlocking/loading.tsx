"use client";

import { useEffect } from "react";
import { useViPageLoading } from "@/components/templates/demos/valley-interlocking/ViPageLoadingProvider";

export default function ValleyInterlockingLoading() {
  const { show } = useViPageLoading();

  useEffect(() => {
    show();
  }, [show]);

  return null;
}
