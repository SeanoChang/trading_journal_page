"use client";

import { Button, useDisclosure, Chip, Divider, addToast, Skeleton } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import type { ExchangeApiKey } from "@/types/exchange";
 
import ExchangeKeyCard from "@/components/exchanges/ExchangeKeyCard";
import ExchangeKeyModal from "@/components/exchanges/ExchangeKeyModal";

export default function ExchangesPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingKey, setEditingKey] = useState<ExchangeApiKey | null>(null);

  const [apiKeys, setApiKeys] = useState<ExchangeApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const isOperating = saving || deleting !== null;

  const [formData, setFormData] = useState({
    exchange: "",
    name: "",
    apiKey: "",
    secretKey: "",
  });

  const fetchExchanges = async (isInitialLoad = false) => {
    try {
      const response = await fetch("/api/exchanges");
      const data = await response.json();
      console.log("Fetched exchanges data:", data);
      if (data.exchanges) {
        setApiKeys(data.exchanges);
      } else {
        setApiKeys([]);
      }
    } catch (error) {
      console.error("Error fetching exchanges:", error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchExchanges(true);
  }, []);

  const handleAddKey = () => {
    setEditingKey(null);
    setFormData({ exchange: "", name: "", apiKey: "", secretKey: "" });
    onOpen();
  };

  const handleEditKey = (key: ExchangeApiKey) => {
    setEditingKey(key);
    setFormData({
      exchange: key.exchange,
      name: key.name,
      // Editing only updates metadata here; sensitive values aren't retrievable from API
      apiKey: "",
      secretKey: "",
    });
    onOpen();
  };

  const handleSaveKey = async () => {
    setSaving(true);
    
    if (!editingKey) {
      // Add new exchange API key
      try {
        const response = await fetch("/api/exchanges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exchangeName: formData.exchange,
            name: formData.name,
            apiKey: formData.apiKey,
            secretKey: formData.secretKey,
          }),
        });

        if (response.ok) {
          // Refresh the list after successful creation
          await fetchExchanges();
          addToast({
            title: "Success!",
            description: "Exchange API key added successfully",
          });
          onOpenChange();
        } else {
          const errorData = await response.json();
          console.error("Error creating exchange:", errorData);
          addToast({
            title: "Error",
            description: errorData.error || "Failed to add exchange API key",
          });
        }
      } catch (err) {
        console.error("Error creating exchange:", err);
        addToast({
          title: "Error",
          description: "An unexpected error occurred",
        });
      }
    } else {
      // For now, we don't support updating secrets via UI edit; could add PUT later
      // Keep a minimal UX: close modal without changing stored secrets
      onOpenChange();
    }
    
    setSaving(false);
  };

  const handleDeleteKey = async (id: string) => {
    setDeleting(id);
    
    try {
      const response = await fetch("/api/exchanges", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exchangeName: id }),
      });

      if (response.ok) {
        // Refresh the list after successful deletion
        await fetchExchanges();
        addToast({
          title: "Success!",
          description: "Exchange API key deleted successfully",
        });
      } else {
        const errorData = await response.json();
        console.error("Error deleting exchange:", errorData);
        addToast({
          title: "Error",
          description: errorData.error || "Failed to delete exchange API key",
        });
      }
    } catch (err) {
      console.error("Error deleting exchange:", err);
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setDeleting(null);
    }
  };

  const toggleKeyStatus = (id: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === id ? { ...key, isActive: !key.isActive } : key,
      ),
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-5xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        {/* Page header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Exchange API Keys
              </h1>
              <p className="mt-1 text-sm text-default-500">
                Manage stored API credentials with a clean, simple layout.
              </p>
            </div>
            <Button
              color="primary"
              startContent={<FiPlus />}
              onPress={handleAddKey}
              isDisabled={isOperating}
            >
              Add API Key
            </Button>
          </div>
        </header>

        {/* API keys section */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-5 md:px-6 py-4 md:py-5 flex items-center justify-between">
            <h2 className="text-base font-medium">API Keys</h2>
            <Chip variant="flat" size="sm">
              {apiKeys.length} total
            </Chip>
          </div>
          <Divider className="m-0" />
          <div>
            {loading ? (
              <div className="px-5 md:px-6 py-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="w-24 h-5 rounded mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="w-16 h-3 rounded" />
                        <Skeleton className="w-20 h-3 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Skeleton className="w-16 h-8 rounded" />
                      <Skeleton className="w-8 h-8 rounded" />
                      <Skeleton className="w-8 h-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : apiKeys.length > 0 ? (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {apiKeys.map((key) => (
                  <ExchangeKeyCard
                    key={key.id}
                    item={key}
                    isOperating={isOperating}
                    deletingId={deleting}
                    onToggleStatus={toggleKeyStatus}
                    onEdit={handleEditKey}
                    onDelete={handleDeleteKey}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-16 text-center">
                <p className="text-default-500">
                  No API keys yet. Add your first exchange to get started.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Add/Edit Modal */}
        <ExchangeKeyModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          editingKey={editingKey}
          formData={formData}
          onFormChange={(next) => setFormData(next)}
          onSave={handleSaveKey}
          saving={saving}
          isOperating={isOperating}
        />
      </main>
    </div>
  );
}
