"use client";

import { Card, CardBody, CardHeader, Switch, Select, SelectItem, Button, Divider } from "@heroui/react";
import { FiUser, FiLock, FiMoon, FiBell, FiDatabase } from "react-icons/fi";
import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultExchange, setDefaultExchange] = useState("binance");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your account preferences and trading configuration</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader className="flex gap-3">
          <FiUser className="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Account</p>
            <p className="text-small text-slate-500">Manage your account settings</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-slate-500">Receive updates about your trades</p>
            </div>
            <Switch 
              isSelected={notifications}
              onValueChange={setNotifications}
              startContent={<FiBell />}
            />
          </div>
        </CardBody>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader className="flex gap-3">
          <FiMoon className="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Appearance</p>
            <p className="text-small text-slate-500">Customize your interface</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Dark mode</p>
              <p className="text-sm text-slate-500">Switch between light and dark themes</p>
            </div>
            <Switch 
              isSelected={darkMode}
              onValueChange={setDarkMode}
              startContent={<FiMoon />}
            />
          </div>
        </CardBody>
      </Card>

      {/* Trading Settings */}
      <Card>
        <CardHeader className="flex gap-3">
          <FiDatabase className="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Trading</p>
            <p className="text-small text-slate-500">Configure your trading preferences</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Default Exchange</p>
            <Select
              selectedKeys={[defaultExchange]}
              onSelectionChange={(keys) => setDefaultExchange(Array.from(keys)[0] as string)}
              className="max-w-xs"
            >
              <SelectItem key="binance">Binance</SelectItem>
              <SelectItem key="coinbase">Coinbase</SelectItem>
              <SelectItem key="kraken">Kraken</SelectItem>
              <SelectItem key="bybit">Bybit</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader className="flex gap-3">
          <FiLock className="h-5 w-5" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Privacy & Security</p>
            <p className="text-small text-slate-500">Manage your security settings</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="bordered" className="w-fit">
            Change Password
          </Button>
          <Button variant="bordered" color="danger" className="w-fit">
            Delete Account
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}