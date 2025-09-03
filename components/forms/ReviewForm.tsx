"use client";
import { useState } from "react";
import { Input, Button, Checkbox } from "@heroui/react";

interface Trade {
  id: string;
  pair: string;
  direction: string;
  date: string;
  status: string;
}

interface Execution {
  avgEntry?: number;
  avgExit?: number;
  realizedR?: number;
  stuckToPlan?: boolean;
}

interface ReviewFormProps {
  trade: Trade;
  onSubmit: (execution: Execution) => void;
}

export default function ReviewForm({ trade, onSubmit }: ReviewFormProps) {
  const [avgEntry, setAvgEntry] = useState<string>("");
  const [avgExit, setAvgExit] = useState<string>("");
  const [realizedR, setRealizedR] = useState<string>("");
  const [stuckToPlan, setStuckToPlan] = useState<boolean>(false);

  const handleSubmit = () => {
    const execution: Execution = {
      avgEntry: avgEntry ? parseFloat(avgEntry) : undefined,
      avgExit: avgExit ? parseFloat(avgExit) : undefined,
      realizedR: realizedR ? parseFloat(realizedR) : undefined,
      stuckToPlan,
    };
    onSubmit(execution);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Reviewing: {trade.pair} • {trade.direction.toUpperCase()}
      </div>

      <Input
        label="Average Entry Price"
        type="number"
        step="any"
        value={avgEntry}
        onValueChange={setAvgEntry}
        placeholder="Enter avg entry price"
      />

      <Input
        label="Average Exit Price"
        type="number"
        step="any"
        value={avgExit}
        onValueChange={setAvgExit}
        placeholder="Enter avg exit price"
      />

      <Input
        label="Realized R"
        type="number"
        step="any"
        value={realizedR}
        onValueChange={setRealizedR}
        placeholder="Enter realized R value"
      />

      <Checkbox isSelected={stuckToPlan} onValueChange={setStuckToPlan}>
        Stuck to original plan
      </Checkbox>

      <Button
        color="primary"
        onPress={handleSubmit}
        isDisabled={!avgEntry && !avgExit && !realizedR}
        fullWidth
      >
        Submit Review
      </Button>
    </div>
  );
}
