import React, { useRef, useEffect, useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvestmentAnalysisPanel } from '../investment-analysis-panel';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(480); // Default width

  // Load saved width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem('ria-sidebar-width');
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
    }
  }, []);

  // Save width to localStorage when it changes
  useEffect(() => {
    if (sidebarWidth >= 320 && sidebarWidth <= 800) {
      localStorage.setItem('ria-sidebar-width', sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 320), 800);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={sidebarRef}
      className={cn(
        'ria-sidebar',
        isOpen ? 'open' : '',
        isResizing ? 'resizing' : ''
      )}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div 
        className="ria-resize-handle"
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      />
      <div className="ria-header">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-slate-50" />
          <h2>DealWise - The Rental Investment Analyzer</h2>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="ria-content overflow-y-auto">
        <InvestmentAnalysisPanel />
      </div>
    </div>
  );
} 