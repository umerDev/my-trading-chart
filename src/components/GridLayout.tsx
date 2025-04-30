
import React, { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { MoveVertical } from 'lucide-react';

interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: React.ReactNode;
}

interface GridLayoutProps {
  items: GridItem[];
  cols?: number;
  rowHeight?: number;
  gap?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({ 
  items,
  cols = 12,
  rowHeight = 50,
  gap = 10
}) => {
  const [layout, setLayout] = useState<GridItem[]>(items);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<GridItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  
  const handleDragStart = useCallback((e: React.MouseEvent, item: GridItem, fromHandle: boolean = false) => {
    // Only start drag if it's from a designated handle or allowed area
    if (!fromHandle && e.target instanceof HTMLElement) {
      // Check if the click is on a button, input, or other interactive elements
      const isInteractive = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.closest('.trade-component-header button') ||
        e.target.closest('.chart-container') ||
        e.target.classList.contains('non-draggable');
      
      if (isInteractive) {
        return;
      }
    }
    
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedItem(item);
    setDragPos({
      x: e.clientX,
      y: e.clientY
    });
    setIsDragging(true);
    toast("Component grabbed", {
      description: "Drag and drop to reposition",
    });
  }, []);
  
  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedItem) return;
    
    setDragPos({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDragging, draggedItem]);
  
  const handleDragEnd = useCallback(() => {
    if (!draggedItem || !gridRef.current) return;
    
    const containerRect = gridRef.current.getBoundingClientRect();
    
    const colWidth = (containerRect.width - (cols - 1) * gap) / cols;
    const x = Math.round((dragPos.x - containerRect.left - dragOffset.x) / (colWidth + gap));
    const y = Math.round((dragPos.y - containerRect.top - dragOffset.y) / (rowHeight + gap));
    
    const newX = Math.max(0, Math.min(cols - draggedItem.w, x));
    const maxRows = Math.floor((containerRect.height - draggedItem.h * rowHeight) / (rowHeight + gap)) + 1;
    const newY = Math.max(0, Math.min(maxRows - 1, y));
    
    // Check if the position has changed
    if (newX !== draggedItem.x || newY !== draggedItem.y) {
      const newLayout = layout.map(item => 
        item.id === draggedItem.id ? { ...item, x: newX, y: newY } : item
      );
      setLayout(newLayout);
      toast("Component repositioned", {
        description: "The layout has been updated",
      });
    }
    
    setIsDragging(false);
    setDraggedItem(null);
  }, [isDragging, draggedItem, dragPos, dragOffset, layout, cols, rowHeight, gap]);
  
  const getItemStyle = (item: GridItem) => {
    const containerRect = gridRef.current?.getBoundingClientRect();
    if (!containerRect) return {};
    
    const colWidth = (containerRect.width - (cols - 1) * gap) / cols;
    const width = item.w * colWidth + (item.w - 1) * gap;
    const height = item.h * rowHeight + (item.h - 1) * gap;
    
    // If this is the dragged item, return absolute positioning
    if (isDragging && draggedItem && item.id === draggedItem.id) {
      return {
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        left: `${dragPos.x - dragOffset.x}px`,
        top: `${dragPos.y - dragOffset.y}px`,
        zIndex: 100,
        opacity: 0.8,
        pointerEvents: 'none',
      };
    }
    
    // Regular grid positioning
    const left = item.x * (colWidth + gap);
    const top = item.y * (rowHeight + gap);
    
    return {
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
      transition: 'all 0.2s ease',
    };
  };
  
  return (
    <div 
      id="grid-container"
      ref={gridRef}
      className="relative w-full h-full"
      onMouseMove={(e) => handleDragMove(e)}
      onMouseUp={() => handleDragEnd()}
      onMouseLeave={() => handleDragEnd()}
    >
      {layout.map((item) => (
        <div
          key={item.id}
          className={`grid-item ${isDragging && draggedItem?.id === item.id ? 'z-50' : ''}`}
          style={getItemStyle(item as any) as React.CSSProperties}
          onMouseDown={(e) => handleDragStart(e, item)}
        >
          <div className="relative h-full">
            {/* Drag handle at top of component */}
            <div 
              className="absolute top-0 right-0 p-1 z-10 cursor-move bg-muted/50 rounded-bl opacity-0 hover:opacity-100 transition-opacity"
              onMouseDown={(e) => handleDragStart(e, item, true)}
            >
              <MoveVertical size={16} />
            </div>
            
            {/* Component content */}
            <div className="h-full">
              {item.component}
            </div>
          </div>
        </div>
      ))}
      
      {isDragging && draggedItem && (
        <div 
          className="grid-placeholder" 
          style={getItemStyle({
            ...draggedItem,
            x: Math.round((dragPos.x - (gridRef.current?.getBoundingClientRect().left || 0) - dragOffset.x) / ((gridRef.current?.getBoundingClientRect().width || 0) - (cols - 1) * gap) / cols + gap),
            y: Math.round((dragPos.y - (gridRef.current?.getBoundingClientRect().top || 0) - dragOffset.y) / (rowHeight + gap))
          } as any) as React.CSSProperties} 
        />
      )}
    </div>
  );
};

export default GridLayout;
