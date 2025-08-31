"use client";

import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@heroui/react";
import { FiPlus, FiEdit3, FiTrash2, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useEffect } from "react";

interface ExchangeApiKey {
  id: string;
  name: string;
  exchange: string;
  apiKey: string;
  secretKey: string;
  isActive: boolean;
}

export default function ExchangesPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<ExchangeApiKey | null>(null);
  
  const [apiKeys, setApiKeys] = useState<ExchangeApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    exchange: "",
    apiKey: "",
    secretKey: ""
  });

  const fetchExchanges = async () => {
    try {
      const response = await fetch('/api/exchanges');
      const data = await response.json();
      if (data.exchanges) {
        setApiKeys(data.exchanges);
      }
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const toggleSecretVisibility = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddKey = () => {
    setEditingKey(null);
    setFormData({ name: "", exchange: "", apiKey: "", secretKey: "" });
    onOpen();
  };

  const handleEditKey = (key: ExchangeApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      exchange: key.exchange,
      apiKey: key.apiKey,
      secretKey: key.secretKey
    });
    onOpen();
  };

  const handleSaveKey = async () => {
    if (editingKey) {
      // Handle editing existing key (you may want to implement update logic)
      setApiKeys(prev => prev.map(key => 
        key.id === editingKey.id 
          ? { ...key, ...formData }
          : key
      ));
    } else {
      // Add new exchange API key
      try {
        const response = await fetch('/api/exchanges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            exchangeName: formData.exchange, 
            apiKey: formData.apiKey, 
            secretKey: formData.secretKey 
          }),
        });
        
        if (response.ok) {
          // Refresh the list after successful creation
          await fetchExchanges();
        } else {
          const errorData = await response.json();
          console.error('Error creating exchange:', errorData);
        }
      } catch (err) {
        console.error('Error creating exchange:', err);
      }
    }
    onOpenChange();
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const toggleKeyStatus = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ));
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <header className="mb-8 md:mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Exchange API Keys</h1>
              <p className="text-sm text-default-500">Manage your exchange API credentials for automated trading</p>
            </div>
            <Button
              color="primary"
              startContent={<FiPlus />}
              onPress={handleAddKey}
            >
              Add API Key
            </Button>
          </div>
        </header>

        {/* API Keys List */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="pb-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <Chip variant="flat" size="sm">{apiKeys.length} total</Chip>
            </div>
          </div>
          <div className="pt-0">
            {loading ? (
              <div className="py-12 text-center text-default-500">
                <p>Loading exchanges...</p>
              </div>
            ) : apiKeys.length > 0 ? (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{key.exchange}</h3>
                          <Chip 
                            size="sm" 
                            color={key.isActive ? "success" : "default"}
                            variant="flat"
                          >
                            {key.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-default-600">
                            <FiKey className="h-3 w-3" />
                            <span>API Key:</span>
                            <code className="text-xs bg-default-100 dark:bg-default-800 px-2 py-1 rounded font-mono">
                              {showSecrets[key.id] ? key.apiKey : key.apiKey}
                            </code>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => toggleSecretVisibility(key.id)}
                            >
                              {showSecrets[key.id] ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-default-600">
                            <FiKey className="h-3 w-3" />
                            <span>Secret:</span>
                            <code className="text-xs bg-default-100 dark:bg-default-800 px-2 py-1 rounded font-mono">
                              {showSecrets[key.id] ? key.secretKey : "***hidden***"}
                            </code>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => toggleKeyStatus(key.id)}
                        >
                          {key.isActive ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEditKey(key)}
                        >
                          <FiEdit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDeleteKey(key.id)}
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-default-500">
                <FiKey className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No API keys configured yet. Add your first exchange API key to get started.</p>
              </div>
            )}
          </div>
        </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingKey ? "Edit API Key" : "Add New API Key"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="e.g., Main Trading Account"
                    value={formData.name}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  />
                  <Input
                    label="Exchange"
                    placeholder="e.g., Binance, Coinbase"
                    value={formData.exchange}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, exchange: value }))}
                  />
                  <Input
                    label="API Key"
                    placeholder="Your exchange API key"
                    type="text"
                    autoComplete="new-password"
                    value={formData.apiKey}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, apiKey: value }))}
                  />
                  <Input
                    label="Secret Key"
                    type="password"
                    placeholder="Your exchange secret key"
                    autoComplete="new-password"
                    value={formData.secretKey}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, secretKey: value }))}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveKey}>
                  {editingKey ? "Update" : "Add"} API Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </main>
    </div>
  );
}