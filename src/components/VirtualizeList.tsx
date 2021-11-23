import { useRef, useState, useMemo, useCallback, useEffect } from "react";

function isVisible({
  top,
  offset,
  height,
}: {
  top: number;
  offset: number;
  height: number;
}): boolean {
  return top + offset + height >= 0 && top - offset <= window.innerHeight;
}

function arrayGenerator<T>(length: number, fill: T): T[] {
  return [...Array(length)].map(() => fill);
}

interface VirtualizeItemProps {
  [key: string]: any;
}

export interface VirtualizeListProps<T extends VirtualizeItemProps> {
  style?: React.CSSProperties;
  viewHeight: number;
  items: T[];
  itemStyle?: React.CSSProperties;
  itemGap?: number;
  itemHeight: number;
  render: (item: T) => React.ReactNode;
}

const VirtualizeList = ({
  style,
  viewHeight,
  items,
  itemStyle,
  itemGap = 0,
  itemHeight,
  render,
}: VirtualizeListProps<VirtualizeItemProps>) => {
  const itemList = useMemo(
    () => arrayGenerator(items.length, false),
    [items.length]
  );
  const containerHeight = useMemo(() => {
    const itemHeights = itemHeight * items.length;
    const gapSize = itemGap * items.length + itemGap;

    return itemHeights + gapSize;
  }, [items.length, itemGap, itemHeight]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLLIElement[] | null[]>([]);

  const [itemVisible, setItemVisible] = useState(itemList);

  const isInViewport = useCallback(() => {
    const cardsVisibility = items.map((_, i) => {
      const item = itemRefs.current[i];
      if (item) {
        const { top, height } = item.getBoundingClientRect();
        return isVisible({ top, height, offset: itemHeight });
      }
      return false;
    });

    setItemVisible(cardsVisibility);
  }, [itemHeight, items]);

  useEffect(() => {
    const isViewListener = isInViewport;
    containerRef.current?.addEventListener("scroll", isViewListener, false);
    return () => {
      containerRef.current?.removeEventListener(
        "scroll",
        isViewListener,
        false
      );
    };
  }, [isInViewport]);

  useEffect(() => {
    isInViewport();
  }, [isInViewport]);

  return (
    <div
      ref={containerRef}
      className={"virtualize-list"}
      style={{ ...style, height: `${viewHeight}px`, overflow: "scroll" }}
    >
      <ul style={{ height: `${containerHeight}px` }}>
        {items.map((item, index) => (
          <li
            ref={(ref) => (itemRefs.current[index] = ref)}
            key={index}
            style={{
              ...itemStyle,
              height: `${itemHeight}px`,
              margin: `${itemGap}px 0`,
              listStyle: "none",
            }}
          >
            {itemVisible[index] && render(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VirtualizeList;
