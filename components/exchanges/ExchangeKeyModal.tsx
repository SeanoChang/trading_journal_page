"use client";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import type { ExchangeApiKey } from "@/types/exchange";
import { exchanges } from "@/types/exchange";

type FormData = {
  exchange: string;
  name: string;
  apiKey: string;
  secretKey: string;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingKey: ExchangeApiKey | null;
  formData: FormData;
  onFormChange: (next: FormData) => void;
  onSave: () => void | Promise<void>;
  saving: boolean;
  isOperating: boolean;
};

export default function ExchangeKeyModal({
  isOpen,
  onOpenChange,
  editingKey,
  formData,
  onFormChange,
  onSave,
  saving,
  isOperating,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editingKey ? "Edit API Key" : "Add API Key"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <Select
                  label="Exchange"
                  selectedKeys={formData.exchange ? [formData.exchange] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    onFormChange({ ...formData, exchange: selectedKey });
                  }}
                >
                  {exchanges.map((exchange) => (
                    <SelectItem key={exchange.key}>{exchange.name}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Name Tag"
                  type="text"
                  value={formData.name}
                  onValueChange={(value) =>
                    onFormChange({ ...formData, name: value })
                  }
                />
                {!editingKey && (
                  <>
                    <Input
                      label="API Key"
                      type="text"
                      autoComplete="new-password"
                      value={formData.apiKey}
                      onValueChange={(value) =>
                        onFormChange({ ...formData, apiKey: value })
                      }
                    />
                    <Input
                      label="Secret Key"
                      type="password"
                      autoComplete="new-password"
                      value={formData.secretKey}
                      onValueChange={(value) =>
                        onFormChange({ ...formData, secretKey: value })
                      }
                    />
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} disabled={isOperating}>
                Cancel
              </Button>
              <Button color="primary" onPress={onSave} isLoading={saving}>
                {editingKey ? "Done" : "Add"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

