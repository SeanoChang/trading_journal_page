"use client";
import { Tabs, Tab } from "@heroui/react";

type FilterKey = "all" | "bitcoin" | "ethereum" | "alts";

export default function Filters({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (v: FilterKey) => void;
}) {
  return (
    <div className="w-full flex items-center justify-between">
      <Tabs
        aria-label="Filter news"
        selectedKey={value}
        onSelectionChange={(k) => onChange(k as FilterKey)}
        color="secondary"
        variant="underlined"
        radius="sm"
        classNames={{
          tabList: "gap-6",
          tab: "data-[selected=true]:font-semibold",
        }}
      >
        <Tab key="all" title="All" />
        <Tab key="bitcoin" title="Bitcoin" />
        <Tab key="ethereum" title="Ethereum" />
        <Tab key="alts" title="Alts" />
      </Tabs>
    </div>
  );
}
