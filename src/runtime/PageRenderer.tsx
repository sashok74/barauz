import { Box, Typography, Grid, Paper } from '@mui/material';
import type { PageSchema } from '../dsl/types';
import { TableRenderer } from './TableRenderer';
import { FormRenderer } from './FormRenderer';
import { GanttRenderer } from './GanttRenderer';

interface PageRendererProps {
  schema: PageSchema;
}

export function PageRenderer({ schema }: PageRendererProps) {
  const { title, layout, blocks } = schema;

  const renderBlock = (block: PageSchema['blocks'][number], index: number) => {
    const key = `${block.type}-${block.id}-${index}`;

    switch (block.type) {
      case 'Table':
        return <TableRenderer key={key} schema={block} />;
      case 'Form':
        return <FormRenderer key={key} schema={block} />;
      case 'Gantt':
        return <GanttRenderer key={key} schema={block} />;
      default:
        return null;
    }
  };

  if (layout.type === 'single') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {blocks.map((block, index) => (
          <Box key={index} mb={2}>
            {renderBlock(block, index)}
          </Box>
        ))}
      </Box>
    );
  }

  if (layout.type === 'split') {
    const ratio = layout.ratio || [50, 50];
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {blocks.map((block, index) => (
            <Grid item xs={12} md={ratio[index] || 50} key={index}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                {renderBlock(block, index)}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return null;
}
