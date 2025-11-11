import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import type { GanttBlock } from '../dsl/types';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../data/queryClient';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  depends?: string[];
}

interface GanttRendererProps {
  schema: GanttBlock;
}

export function GanttRenderer({ schema }: GanttRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);

  const { data: tasks } = useQuery({
    queryKey: [schema.dataSource.key],
    queryFn: () =>
      apiRequest<{ tasks: GanttTask[] }>({
        method: schema.dataSource.method,
        path: schema.dataSource.path,
      }),
  });

  useEffect(() => {
    if (!containerRef.current || !tasks?.tasks) return;

    const items = new DataSet(
      tasks.tasks.map((task) => ({
        id: task.id,
        content: task.name,
        start: new Date(task.start),
        end: new Date(task.end),
      }))
    );

    const options = {
      editable: {
        updateTime: true,
        updateGroup: false,
      },
      stack: false,
      orientation: 'top',
      margin: {
        item: 10,
      },
      onMove: (item: { id: string; start: Date; end: Date }, callback: (item: unknown) => void) => {
        console.log('Task moved:', item);
        // In real implementation, call API to update task
        callback(item);
      },
    };

    if (timelineRef.current) {
      timelineRef.current.destroy();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    timelineRef.current = new Timeline(containerRef.current, items, options as any);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [tasks]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    <Box data-testid={schema.id as any}>
      {schema.title && (
        <Typography variant="h6" gutterBottom>
          {schema.title}
        </Typography>
      )}
      <Box
        ref={containerRef}
        sx={{
          height: 400,
          border: '1px solid #ccc',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
