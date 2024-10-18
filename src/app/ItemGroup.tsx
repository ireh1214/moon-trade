// ItemGroup.tsx
import React from "react";
import ItemSelector from "./ItemSelector";

interface ItemGroupProps {
  title: string;
  items: { name: string; maxQuantity: number; price: number }[];
  quantities: { [key: string]: number };
  regionalPrices: { [key: string]: number };
  onQuantityChange: (name: string, quantity: number) => void;
  onMaxChange: (name: string, maxQuantity: number, isChecked: boolean) => void;
  onRegionalPriceChange: (name: string, value: string) => void;
}

const ItemGroup: React.FC<ItemGroupProps> = ({
  title,
  items,
  quantities,
  regionalPrices,
  onQuantityChange,
  onMaxChange,
  onRegionalPriceChange
}) => {
  return (
    <section>
      <h3>{title}</h3>
      {items.map((item) => (
        <ItemSelector
          key={item.name}
          item={item}
          quantity={quantities[item.name]}
          regionalPrice={regionalPrices[item.name]}
          onQuantityChange={onQuantityChange}
          onMaxChange={onMaxChange}
          onRegionalPriceChange={onRegionalPriceChange}
        />
      ))}
    </section>
  );
};

export default ItemGroup;
