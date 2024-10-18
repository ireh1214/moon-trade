// ItemSelector.tsx
import React from "react";

interface ItemSelectorProps {
  item: { name: string; maxQuantity: number; price: number };
  quantity: number;
  regionalPrice: number;
  onQuantityChange: (name: string, quantity: number) => void;
  onMaxChange: (name: string, maxQuantity: number, isChecked: boolean) => void;
  onRegionalPriceChange: (name: string, value: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  item,
  quantity,
  regionalPrice,
  onQuantityChange,
  onMaxChange,
  onRegionalPriceChange
}) => {
  return (
    <div>
      <label>{item.name} : </label>
      <select
        value={quantity}
        onChange={(e) => onQuantityChange(item.name, Number(e.target.value))}
      >
        {[...Array(item.maxQuantity + 1).keys()].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      {/* 최대 체크박스 */}
      <label>
        <input
          type="checkbox"
          onChange={(e) =>
            onMaxChange(item.name, item.maxQuantity, e.target.checked)
          }
        />
        최대
      </label>
      <input
        type="number"
        value={regionalPrice || ""}
        onChange={(e) => onRegionalPriceChange(item.name, e.target.value)}
        placeholder="마을별 시세"
      />
    </div>
  );
};

export default ItemSelector;
