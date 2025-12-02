import React, { memo } from "react";
import { ExpertiseChipProps } from "@/types/domain/feed";

const ExpertiseChip = memo<ExpertiseChipProps>(({ expertise }) => {
  return (
    <span className="inline-block bg-blue-50 text-primary-cyan text-[10px] px-2 py-1 rounded-full border border-blue-200">
      {expertise}
    </span>
  );
});

ExpertiseChip.displayName = "ExpertiseChip";

export default ExpertiseChip;
