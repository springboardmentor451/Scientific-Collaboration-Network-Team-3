import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import tailwindConfig from '../../../tailwind.config.js';

export default function CollaborationNetworkGraph({ data }) {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const colors = tailwindConfig.theme.extend.colors;

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (fgRef.current && dimensions.width) {
      fgRef.current.d3Force('charge').strength(-200);
      fgRef.current.zoomToFit(400, 20);
    }
  }, [data, dimensions]);

  // Default mock data if none provided
  const graphData = data || {
    nodes: [
      { id: '1', name: 'Dr. Aris Thorne', group: 1 },
      { id: '2', name: 'Prof. Elena Rostova', group: 1 },
      { id: '3', name: 'Dr. James Chen', group: 2 },
      { id: '4', name: 'Dr. Sarah J.', group: 1 },
      { id: '5', name: 'Dr. K. Patel', group: 2 }
    ],
    links: [
      { source: '1', target: '2' },
      { source: '1', target: '3' },
      { source: '1', target: '4' },
      { source: '2', target: '5' },
      { source: '4', target: '5' }
    ]
  };

  return (
    <div ref={containerRef} className="w-full h-[300px] bg-surface-container-low rounded-lg border border-outline-variant/50 relative overflow-hidden flex items-center justify-center">
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={node => node.group === 1 ? colors['primary-container'] : colors['on-primary-container']}
          nodeRelSize={6}
          linkColor={() => colors['outline-variant']}
          linkWidth={1.5}
          backgroundColor="transparent"
        />
      )}
    </div>
  );
}
