"use client";
import { useState, useEffect } from "react";
import type { OrderStatus as PrismaOrderStatus, Side as PrismaSide, WinLoss as PrismaWinLoss } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  DatePicker,
  TimeInput,
  Tabs,
  Tab,
} from "@heroui/react";
import { motion } from "framer-motion";
import { FiClock, FiTrendingUp, FiTrendingDown, FiCalendar, FiTarget, FiShield } from "react-icons/fi";

type OrderStatus = PrismaOrderStatus;
type Side = PrismaSide;
type WinLoss = PrismaWinLoss | null;

type Trade = {
  id: string;
  pair: string;
  orderStatus: OrderStatus;
  side: Side;
  takeProfit?: number;
  stopLoss?: number;
  entryPrice?: number;
  exitPrice?: number;
  entryTime?: string;
  exitTime?: string;
  pnl?: number;
  winLoss?: WinLoss;
  createdAt: string;
};

type ViewMode = "weekly" | "daily";
type DayTrades = {
  date: string;
  trades: Trade[];
};

const POPULAR_PAIRS = [
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT", 
  "XRPUSDT", "DOGEUSDT", "MATICUSDT", "AVAXUSDT", "DOTUSDT"
];

export default function TradesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [pair, setPair] = useState("BTCUSDT");
  const [side, setSide] = useState<Side>("BUY");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("EXECUTED");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  // Form states for plan ahead
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  
  // Form states for executed trades
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [entryDate, setEntryDate] = useState(null);
  const [entryTime, setEntryTime] = useState(null);
  const [exitDate, setExitDate] = useState(null);
  const [exitTime, setExitTime] = useState(null);
  // Open order planned execution
  const [openDate, setOpenDate] = useState(null);
  const [openTime, setOpenTime] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  const submitTrade = () => {
    if (orderStatus === "PLAN_AHEAD") {
      if (!pair || !takeProfit || !stopLoss || !limitPrice) return;
      
      const newTrade: Trade = {
        id: crypto.randomUUID?.() ?? String(Math.random()),
        pair,
        orderStatus,
        side,
        takeProfit: parseFloat(takeProfit),
        stopLoss: parseFloat(stopLoss),
        entryPrice: parseFloat(limitPrice), // Store limit price as entry price for plan ahead
        createdAt: new Date().toISOString(),
      };
      
      setTrades(prev => [newTrade, ...prev]);
      setTakeProfit("");
      setStopLoss("");
      setLimitPrice("");
    } else if (orderStatus === "OPEN") {
      if (!pair || !takeProfit || !stopLoss || !limitPrice || !openDate || !openTime) return;

      const newTrade: Trade = {
        id: crypto.randomUUID?.() ?? String(Math.random()),
        pair,
        orderStatus,
        side,
        takeProfit: parseFloat(takeProfit),
        stopLoss: parseFloat(stopLoss),
        entryPrice: parseFloat(limitPrice),
        entryTime: `${openDate}T${openTime}`,
        createdAt: new Date().toISOString(),
      };

      setTrades(prev => [newTrade, ...prev]);
      setTakeProfit("");
      setStopLoss("");
      setLimitPrice("");
      setOpenDate(null);
      setOpenTime(null);
    } else {
      if (!pair || !entryPrice || !exitPrice || !entryDate || !entryTime || !exitDate || !exitTime) return;
      
      const entry = parseFloat(entryPrice);
      const exit = parseFloat(exitPrice);
      let pnl = 0;
      let winLoss: WinLoss = null;
      
      if (side === "BUY") {
        pnl = exit - entry;
      } else {
        pnl = entry - exit;
      }
      
      if (pnl > 0) winLoss = "WIN";
      else if (pnl < 0) winLoss = "LOSS";
      else winLoss = "BREAKEVEN";
      
      const newTrade: Trade = {
        id: crypto.randomUUID?.() ?? String(Math.random()),
        pair,
        orderStatus,
        side,
        entryPrice: entry,
        exitPrice: exit,
        entryTime: entryDate && entryTime ? `${entryDate}T${entryTime}` : new Date().toISOString(),
        exitTime: exitDate && exitTime ? `${exitDate}T${exitTime}` : new Date().toISOString(),
        pnl,
        winLoss,
        createdAt: new Date().toISOString(),
      };
      
      setTrades(prev => [newTrade, ...prev]);
      setEntryPrice("");
      setExitPrice("");
      setEntryDate(null);
      setEntryTime(null);
      setExitDate(null);
      setExitTime(null);
    }
  };

  const calculateWinRate = () => {
    const executedTrades = trades.filter(t => t.orderStatus === "EXECUTED" && t.winLoss);
    if (executedTrades.length === 0) return 0;
    const wins = executedTrades.filter(t => t.winLoss === "WIN").length;
    return Math.round((wins / executedTrades.length) * 100);
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const todayString = new Date().toDateString();

  const getTradesForDay = (date: Date) => {
    const dayString = date.toDateString();
    return trades.filter(trade => 
      new Date(trade.createdAt).toDateString() === dayString
    );
  };

  const getDayTradesData = (): DayTrades[] => {
    if (viewMode === "weekly") return [];
    
    const dayTrades: { [key: string]: Trade[] } = {};
    trades.forEach(trade => {
      const day = new Date(trade.createdAt).toDateString();
      if (!dayTrades[day]) dayTrades[day] = [];
      dayTrades[day].push(trade);
    });
    
    return Object.entries(dayTrades)
      .map(([date, trades]) => ({ date, trades }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        label: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
      });
    }
    return slots;
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours + minutes / 60) * 60; // 60px per hour
  };

  const getTradePosition = (trade: Trade) => {
    const time = trade.entryTime || trade.createdAt;
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (hours + minutes / 60) * 60; // 60px per hour
  };

  const getSelectedDayTrades = () => {
    const dayString = selectedDate.toDateString();
    return trades.filter(trade => 
      new Date(trade.createdAt).toDateString() === dayString
    );
  };

  const openDayModal = (dayString: string) => {
    setSelectedDay(dayString);
    onOpen();
  };

  const selectedDayTrades = selectedDay ? trades.filter(t => 
    new Date(t.createdAt).toDateString() === selectedDay
  ) : [];

  const previousWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(prev);
  };

  const nextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(next);
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-default-500">Loading trades…</div>;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0b16] text-slate-800 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-8 md:py-10">
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Trading Journal</h1>
          <p className="text-sm text-default-500">Log your trades and track your win rate. Focus on improving your trading strategy.</p>
        </header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Trading Interface */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="pb-4">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl font-semibold">Log Trade</h2>
                  <div className="flex items-center gap-2">
                    <Chip variant="flat" size="sm">{orderStatus.replace('_', ' ')}</Chip>
                    <Chip variant="flat" size="sm" color="primary">{calculateWinRate()}% WR</Chip>
                  </div>
                </div>
              </div>
              <div className="pt-0 space-y-6">
                {/* Pair Selection */}
                <div>
                  <label className="text-sm font-medium text-default-600 mb-2 block">Trading Pair</label>
                  <Autocomplete
                    allowsCustomValue
                    inputValue={pair}
                    onInputChange={setPair}
                    onSelectionChange={(key) => key && setPair(String(key))}
                    size="lg"
                    defaultItems={POPULAR_PAIRS.map((p) => ({ id: p, label: p }))}
                    placeholder="Type or select a pair (e.g. BTCUSDT)"
                  >
                    {(item) => <AutocompleteItem key={item.id}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                </div>

                {/* Order Status & Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-default-600 mb-2 block">Order Type</label>
                    <Tabs
                      selectedKey={orderStatus}
                      onSelectionChange={(key) => setOrderStatus(key as OrderStatus)}
                      size="sm"
                    >
                      <Tab key="PLAN_AHEAD" title="Plan Ahead" />
                      <Tab key="OPEN" title="Open" />
                      <Tab key="EXECUTED" title="Executed" />
                    </Tabs>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-default-600 mb-2 block">Side</label>
                    <Tabs
                      selectedKey={side}
                      onSelectionChange={(key) => setSide(key as Side)}
                      size="sm"
                      color={side === "BUY" ? "success" : "danger"}
                    >
                      <Tab key="SELL" title="Sell" />
                      <Tab key="BUY" title="Buy" />
                    </Tabs>
                  </div>
                </div>

                {/* Conditional Fields Based on Order Status */}
                {orderStatus === "PLAN_AHEAD" ? (
                  <div className="space-y-4">
                    <Input
                      label="Limit Order Price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={limitPrice}
                      onValueChange={setLimitPrice}
                      size="lg"
                      endContent={<span className="text-sm text-default-400">USDT</span>}
                      classNames={{
                        input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Take Profit"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={takeProfit}
                        onValueChange={setTakeProfit}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                      <Input
                        label="Stop Loss"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={stopLoss}
                        onValueChange={setStopLoss}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                    </div>
                  </div>
                ) : orderStatus === "OPEN" ? (
                  <div className="space-y-4">
                    <Input
                      label="Limit Order Price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={limitPrice}
                      onValueChange={setLimitPrice}
                      size="lg"
                      endContent={<span className="text-sm text-default-400">USDT</span>}
                      classNames={{
                        input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Take Profit"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={takeProfit}
                        onValueChange={setTakeProfit}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                      <Input
                        label="Stop Loss"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={stopLoss}
                        onValueChange={setStopLoss}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-default-600">Planned Execution Time</label>
                      <div className="flex gap-2">
                        <DatePicker value={openDate} onChange={setOpenDate} size="sm" className="flex-1" />
                        <TimeInput value={openTime} onChange={setOpenTime} size="sm" className="flex-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Entry Price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={entryPrice}
                        onValueChange={setEntryPrice}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                      <Input
                        label="Exit Price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={exitPrice}
                        onValueChange={setExitPrice}
                        size="lg"
                        endContent={<span className="text-sm text-default-400">USDT</span>}
                        classNames={{
                          input: "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-default-600">Entry Date & Time</label>
                        <div className="flex gap-2">
                          <DatePicker
                            value={entryDate}
                            onChange={setEntryDate}
                            size="sm"
                            className="flex-1"
                          />
                          <TimeInput
                            value={entryTime}
                            onChange={setEntryTime}
                            size="sm"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-default-600">Exit Date & Time</label>
                        <div className="flex gap-2">
                          <DatePicker
                            value={exitDate}
                            onChange={setExitDate}
                            size="sm"
                            className="flex-1"
                          />
                          <TimeInput
                            value={exitTime}
                            onChange={setExitTime}
                            size="sm"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  size="lg"
                  color={side === "BUY" ? "success" : "danger"}
                  variant="solid"
                  onPress={submitTrade}
                  className="w-full"
                  startContent={side === "BUY" ? <FiTrendingUp /> : <FiTrendingDown />}
                  isDisabled={
                    orderStatus === "PLAN_AHEAD" 
                      ? !takeProfit || !stopLoss || !limitPrice
                      : !entryPrice || !exitPrice || !entryDate || !entryTime || !exitDate || !exitTime
                  }
                >
                  {orderStatus === "PLAN_AHEAD" ? "Save Plan" : "Log Trade"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Calendar View */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-[500px] flex flex-col">
              <div className="pb-4">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold">{viewMode === "weekly" ? "Weekly" : "Daily"} View</h2>
                  <div className="flex items-center gap-2">
                    <Tabs
                      selectedKey={viewMode}
                      onSelectionChange={(key) => setViewMode(key as ViewMode)}
                      size="sm"
                    >
                      <Tab key="weekly" title="Weekly" />
                      <Tab key="daily" title="Daily" />
                    </Tabs>
                  </div>
                </div>
              </div>
              <div className="pt-0 flex-1 overflow-hidden">
                {viewMode === "weekly" ? (
                  <div className="h-full flex flex-col">
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div 
                        className="p-1 rounded hover:bg-default-100 cursor-pointer text-default-500 hover:text-default-700"
                        onClick={previousWeek}
                      >
                        ←
                      </div>
                      <Chip variant="flat" size="sm" startContent={<FiCalendar className="w-3 h-3" />}>
                        {currentWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Chip>
                      <div 
                        className="p-1 rounded hover:bg-default-100 cursor-pointer text-default-500 hover:text-default-700"
                        onClick={nextWeek}
                      >
                        →
                      </div>
                    </div>
                    <div className="flex-1 relative min-h-0">
                      {/* Top blur gradient */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-slate-900 to-transparent z-10 pointer-events-none opacity-0 transition-opacity duration-200" id="top-blur"></div>
                      
                      {/* Bottom blur gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" id="bottom-blur"></div>
                      
                      <div 
                        className="h-full overflow-y-scroll" 
                        style={{ 
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          maxHeight: '100%'
                        }}
                        onScroll={(e) => {
                          const target = e.target as HTMLDivElement;
                          const topBlur = document.getElementById('top-blur');
                          const bottomBlur = document.getElementById('bottom-blur');
                          
                          if (topBlur && bottomBlur) {
                            // Show top blur if scrolled down
                            topBlur.style.opacity = target.scrollTop > 0 ? '1' : '0';
                            
                            // Show bottom blur if not at bottom
                            const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
                            bottomBlur.style.opacity = isAtBottom ? '0' : '1';
                          }
                        }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        <div className="space-y-2 py-1" style={{ minHeight: '600px' }}>
                    {weekDays.map((day) => {
                      const dayTrades = getTradesForDay(day);
                      const isToday = day.toDateString() === todayString;
                      
                      return (
                        <motion.div
                          key={day.toDateString()}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`rounded-lg border p-3 transition-colors cursor-pointer hover:bg-default-50 ${
                            isToday 
                              ? "border-primary bg-primary/5 dark:bg-primary/10" 
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                          onClick={() => dayTrades.length > 0 && openDayModal(day.toDateString())}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                              </span>
                              {isToday && <Chip size="sm" variant="flat" color="primary">Today</Chip>}
                            </div>
                            <Chip size="sm" variant="flat" className="text-xs">
                              {dayTrades.length}
                            </Chip>
                          </div>
                          
                          <div className="space-y-1">
                            {dayTrades.slice(0, 3).map((trade) => (
                              <div key={trade.id} className="text-xs text-default-600 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {trade.side === "BUY" ? 
                                    <FiTrendingUp className="w-3 h-3 text-emerald-500" /> : 
                                    <FiTrendingDown className="w-3 h-3 text-rose-500" />
                                  }
                                  <span>{trade.pair}</span>
                                  {trade.winLoss && (
                                    <Chip 
                                      size="sm" 
                                      variant="flat" 
                                      color={trade.winLoss === "WIN" ? "success" : trade.winLoss === "LOSS" ? "danger" : "warning"}
                                      className="text-xs"
                                    >
                                      {trade.winLoss[0]}
                                    </Chip>
                                  )}
                                </div>
                                <span className="font-mono text-xs">
                                  {trade.orderStatus === "EXECUTED" 
                                    ? trade.pnl?.toFixed(2) 
                                    : trade.orderStatus === "OPEN" ? "Open" : "Plan"}
                                </span>
                              </div>
                            ))}
                            {dayTrades.length > 3 && (
                              <div className="text-xs text-default-400">+{dayTrades.length - 3} more (click to view)</div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 relative" style={{ 
                      overflowY: 'scroll', 
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}>
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                    {/* Date Selector */}
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-slate-900 z-10 pb-2">
                      <div 
                        className="p-1 rounded hover:bg-default-100 cursor-pointer text-default-500 hover:text-default-700"
                        onClick={() => {
                          const prev = new Date(selectedDate);
                          prev.setDate(prev.getDate() - 1);
                          setSelectedDate(prev);
                        }}
                      >
                        ←
                      </div>
                      <h3 className="font-medium">
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </h3>
                      <div 
                        className="p-1 rounded hover:bg-default-100 cursor-pointer text-default-500 hover:text-default-700"
                        onClick={() => {
                          const next = new Date(selectedDate);
                          next.setDate(next.getDate() + 1);
                          setSelectedDate(next);
                        }}
                      >
                        →
                      </div>
                    </div>
                    
                    {/* Time Grid */}
                    <div className="relative" style={{ height: '1440px' }}> {/* 24 hours * 60px */}
                      {/* Time Labels and Grid Lines */}
                      {generateTimeSlots().map((slot) => (
                        <div
                          key={slot.hour}
                          className="absolute w-full flex items-start border-b border-slate-100 dark:border-slate-800"
                          style={{ top: `${slot.hour * 60}px`, height: '60px' }}
                        >
                          <div className="w-16 text-xs text-default-500 py-1 px-2 bg-slate-50 dark:bg-slate-800/50">
                            {slot.label}
                          </div>
                          <div className="flex-1 h-full relative">
                            {/* Half-hour line */}
                            <div className="absolute w-full border-b border-slate-50 dark:border-slate-700" style={{ top: '30px' }}></div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Current Time Line */}
                      {selectedDate.toDateString() === new Date().toDateString() && (
                        <div
                          className="absolute w-full flex items-center z-20"
                          style={{ top: `${getCurrentTimePosition()}px` }}
                        >
                          <div className="w-16"></div>
                          <div className="flex-1 flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                            <div className="flex-1 h-0.5 bg-red-500"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Trade Events */}
                      {getSelectedDayTrades().map((trade) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute left-16 right-2 z-10"
                          style={{ 
                            top: `${getTradePosition(trade)}px`,
                            height: '24px'
                          }}
                        >
                          <div className={`
                            flex items-center gap-2 h-full px-2 rounded text-xs font-medium
                            ${trade.side === "BUY" 
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-l-2 border-emerald-500"
                              : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-l-2 border-rose-500"
                            }
                          `}>
                            {trade.side === "BUY" ? 
                              <FiTrendingUp className="w-3 h-3" /> : 
                              <FiTrendingDown className="w-3 h-3" />
                            }
                            <span>{trade.pair}</span>
                            {trade.orderStatus === "EXECUTED" && trade.pnl && (
                              <span className="font-mono">
                                {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                              </span>
                            )}
                            {trade.winLoss && (
                              <Chip 
                                size="sm" 
                                variant="flat" 
                                color={trade.winLoss === "WIN" ? "success" : trade.winLoss === "LOSS" ? "danger" : "warning"}
                                className="text-xs h-4"
                              >
                                {trade.winLoss[0]}
                              </Chip>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Trades */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          variants={containerVariants}
          className="mt-8 md:mt-10"
        >
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="pb-4">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold">Recent Trades</h2>
                <Chip variant="flat" size="sm">{trades.length} total</Chip>
              </div>
            </div>
            <div className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-default-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 pr-4">Time</th>
                      <th className="py-3 pr-4">Pair</th>
                      <th className="py-3 pr-4">Side</th>
                      <th className="py-3 pr-4">Type</th>
                      <th className="py-3 pr-4">Entry/TP</th>
                      <th className="py-3 pr-4">Exit/SL</th>
                      <th className="py-3 pr-4">P&L</th>
                      <th className="py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 10).map((trade) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-default-600">
                            <FiClock className="w-3 h-3" />
                            {new Date(trade.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-medium">{trade.pair}</td>
                        <td className="py-3 pr-4">
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color={trade.side === "BUY" ? "success" : "danger"}
                          >
                            {trade.side}
                          </Chip>
                        </td>
                        <td className="py-3 pr-4">
                          <Chip size="sm" variant="flat">
                            {trade.orderStatus === "EXECUTED" ? "Exec" : trade.orderStatus === "OPEN" ? "Open" : "Plan"}
                          </Chip>
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {trade.orderStatus === "EXECUTED" 
                            ? trade.entryPrice?.toFixed(2) 
                            : trade.takeProfit?.toFixed(2)
                          }
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {trade.orderStatus === "EXECUTED" 
                            ? trade.exitPrice?.toFixed(2) 
                            : trade.stopLoss?.toFixed(2)
                          }
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          {trade.orderStatus === "EXECUTED" 
                            ? `$${trade.pnl?.toFixed(2)}` 
                            : "-"
                          }
                        </td>
                        <td className="py-3">
                          {trade.winLoss ? (
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color={
                                trade.winLoss === "WIN" ? "success" : 
                                trade.winLoss === "LOSS" ? "danger" : "warning"
                              }
                            >
                              {trade.winLoss}
                            </Chip>
                          ) : (
                            <Chip size="sm" variant="flat">
                              {trade.orderStatus === "PLAN_AHEAD" ? "PLAN" : trade.orderStatus === "OPEN" ? "OPEN" : "-"}
                            </Chip>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {trades.length === 0 && (
                  <div className="py-12 text-center text-default-500">
                    <FiTrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No trades yet. Log your first trade above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Daily Timeline Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Daily Timeline
                  <p className="text-sm text-default-500">
                    {selectedDay && new Date(selectedDay).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    {selectedDayTrades.map((trade, index) => (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-default-100 dark:bg-default-800 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {trade.side === "BUY" ? 
                              <FiTrendingUp className="w-4 h-4 text-emerald-500" /> : 
                              <FiTrendingDown className="w-4 h-4 text-rose-500" />
                            }
                            <span className="font-medium">{trade.pair}</span>
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color={trade.side === "BUY" ? "success" : "danger"}
                            >
                              {trade.side}
                            </Chip>
                          </div>
                          <div className="text-sm text-default-600">
                            {trade.orderStatus === "EXECUTED" ? (
                              <div className="flex items-center gap-4">
                                <span>Entry: ${trade.entryPrice?.toFixed(2)}</span>
                                <span>Exit: ${trade.exitPrice?.toFixed(2)}</span>
                                <span className={`font-medium ${
                                  trade.pnl && trade.pnl > 0 ? 'text-success' : 
                                  trade.pnl && trade.pnl < 0 ? 'text-danger' : ''
                                }`}>
                                  P&L: ${trade.pnl?.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <FiTarget className="w-3 h-3" />
                                  TP: ${trade.takeProfit?.toFixed(2)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiShield className="w-3 h-3" />
                                  SL: ${trade.stopLoss?.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-default-500">
                            {new Date(trade.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {trade.winLoss && (
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color={
                                trade.winLoss === "WIN" ? "success" : 
                                trade.winLoss === "LOSS" ? "danger" : "warning"
                              }
                            >
                              {trade.winLoss}
                            </Chip>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
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
