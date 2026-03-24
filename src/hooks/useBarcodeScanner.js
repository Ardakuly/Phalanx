import { useEffect, useRef } from 'react';

export function useBarcodeScanner(onScan) {
  const barcodeBuffer = useRef("");
  const timeoutRef = useRef(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (document.activeElement) {
        const tagName = document.activeElement.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          return;
        }
      }

      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length > 0) {
          onScanRef.current(barcodeBuffer.current);
          barcodeBuffer.current = "";
        }
        return;
      }

      if (e.key.length !== 1) {
        return;
      }

      barcodeBuffer.current += e.key;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Clear buffer after a short timeout (e.g. 100ms) because scanners are very fast
      timeoutRef.current = setTimeout(() => {
        barcodeBuffer.current = "";
      }, 100); 
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}
