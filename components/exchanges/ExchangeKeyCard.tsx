"use client";

import { Button, Chip } from "@heroui/react";
import { FiEdit3, FiTrash2, FiKey } from "react-icons/fi";
import type { ExchangeApiKey } from "@/types/exchange";

type Props = {
  item: ExchangeApiKey;
  isOperating: boolean;
  deletingId: string | null;
  onToggleStatus: (id: string) => void;
  onEdit: (item: ExchangeApiKey) => void;
  onDelete: (id: string) => void;
};

export default function ExchangeKeyCard({
  item,
  isOperating,
  deletingId,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) {
  return (
    <li className="px-5 md:px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-base truncate">{item.name || item.exchange}</h3>
              <p className="text-sm text-default-500 capitalize">{item.exchange}</p>
            </div>
            <Chip size="sm" color={item.isActive ? "success" : "default"} variant="flat">
              {item.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-default-600">
            <span className="inline-flex items-center gap-1.5">
              <FiKey className="h-3 w-3" />
              <span className="uppercase tracking-wide text-[11px] text-default-500">API Key</span>
              <code className="ml-1 rounded bg-default-100 dark:bg-default-800 px-1.5 py-0.5 font-mono text-[11px]">
                {item.apiKey || "***"}
              </code>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiKey className="h-3 w-3" />
              <span className="uppercase tracking-wide text-[11px] text-default-500">Secret</span>
              <code className="ml-1 rounded bg-default-100 dark:bg-default-800 px-1.5 py-0.5 font-mono text-[11px]">
                ******
              </code>
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <Button
            size="sm"
            variant="light"
            onPress={() => onToggleStatus(item.id)}
            isDisabled={isOperating}
          >
            {item.isActive ? "Disable" : "Enable"}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onEdit(item)}
            aria-label="Edit"
            isDisabled={isOperating}
          >
            <FiEdit3 className="w-3 h-3" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onDelete(item.id)}
            aria-label="Delete"
            isLoading={deletingId === item.id}
            isDisabled={isOperating && deletingId !== item.id}
          >
            <FiTrash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </li>
  );
}

