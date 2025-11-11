import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { FormBlock, FormField } from '../dsl/types';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../data/queryClient';
import jsonLogic from 'json-logic-js';

interface LookupOption {
  id: string;
  name: string;
}

interface FormRendererProps {
  schema: FormBlock;
}

function buildZodSchema(fields: FormField[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny = z.any();

    if (field.component === 'Number') {
      fieldSchema = z.number();
    } else if (field.component === 'Checkbox') {
      fieldSchema = z.boolean();
    } else {
      fieldSchema = z.string();
    }

    if (field.required) {
      if (field.component === 'Number') {
        // fieldSchema remains as is for Number
      } else if (field.component === 'Checkbox') {
        // fieldSchema remains as is for Checkbox
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        fieldSchema = (fieldSchema as any).min(1, 'This field is required');
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.name] = fieldSchema;
  }

  return z.object(shape);
}

export function FormRenderer({ schema }: FormRendererProps) {
  const zodSchema = buildZodSchema(schema.fields);
  const [lookupData, setLookupData] = useState<Record<string, LookupOption[]>>({});

  const { data: initialData } = useQuery({
    queryKey: [schema.dataSource.key],
    queryFn: () =>
      apiRequest<Record<string, unknown>>({
        method: schema.dataSource.method,
        path: schema.dataSource.path,
      }),
  });

  // Load lookup data for fields with string options
  useEffect(() => {
    const loadLookups = async () => {
      const lookupsToLoad = schema.fields.filter(
        (field) => typeof field.options === 'string'
      );

      const lookupPromises = lookupsToLoad.map(async (field) => {
        const lookupKey = field.options as string;
        try {
          const data = await apiRequest<LookupOption[]>({
            method: 'GET',
            path: `/api/lookups/${lookupKey}`,
          });
          return { key: lookupKey, data };
        } catch (error) {
          console.error(`Failed to load lookup ${lookupKey}:`, error);
          return { key: lookupKey, data: [] };
        }
      });

      const results = await Promise.all(lookupPromises);
      const newLookupData: Record<string, LookupOption[]> = {};
      results.forEach(({ key, data }) => {
        newLookupData[key] = data;
      });
      setLookupData(newLookupData);
    };

    void loadLookups();
  }, [schema.fields]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const formValues = watch();

  const getDisabledFields = (): string[] => {
    if (!schema.logic) return [];

    const disabledFields: string[] = [];

    for (const rule of schema.logic) {
      try {
        const condition = JSON.parse(rule.when) as unknown;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        const result = jsonLogic.apply(condition as any, { form: formValues } as any);

        if (result) {
          for (const action of rule.then) {
            if (action.disable) {
              disabledFields.push(...action.disable);
            }
          }
        }
      } catch (error) {
        console.error('Error evaluating logic rule:', error);
      }
    }

    return disabledFields;
  };

  const disabledFields = getDisabledFields();

  const onSubmit = (data: Record<string, unknown>) => {
    console.log('Form submitted:', data);
  };

  const renderField = (field: FormField) => {
    const isDisabled = disabledFields.includes(field.name);
    const key = `field-${field.name}`;

    switch (field.component) {
      case 'Text':
        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                fullWidth
                disabled={isDisabled}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                data-testid={`field-${field.name}` as any}
              />
            )}
          />
        );

      case 'Number':
        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={field.label}
                type="number"
                fullWidth
                disabled={isDisabled}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message as string}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                data-testid={`field-${field.name}` as any}
              />
            )}
          />
        );

      case 'Select': {
        // Get options from either array or lookup data
        const options = Array.isArray(field.options)
          ? field.options.map((opt) => ({ id: String(opt), name: String(opt) }))
          : typeof field.options === 'string'
            ? lookupData[field.options] || []
            : [];

        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  {...controllerField}
                  label={field.label}
                  error={!!errors[field.name]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                  data-testid={`field-${field.name}` as any}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        );
      }

      case 'Checkbox':
        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...controllerField}
                    checked={!!controllerField.value}
                    disabled={isDisabled}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                    data-testid={`field-${field.name}` as any}
                  />
                }
                label={field.label}
              />
            )}
          />
        );

      case 'Date':
        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...controllerField}
                  label={field.label}
                  disabled={isDisabled}
                  slotProps={
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    {
                      textField: {
                        fullWidth: true,
                        error: !!errors[field.name],
                        helperText: errors[field.name]?.message as string,
                        'data-testid': `field-${field.name}`,
                      },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any
                  }
                />
              </LocalizationProvider>
            )}
          />
        );

      case 'Autocomplete': {
        // Get options from either array or lookup data
        const options = Array.isArray(field.options)
          ? field.options.map((opt) => ({ id: String(opt), name: String(opt) }))
          : typeof field.options === 'string'
            ? lookupData[field.options] || []
            : [];

        return (
          <Controller
            key={key}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Autocomplete
                {...controllerField}
                options={options}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return (option as LookupOption).name;
                }}
                disabled={isDisabled}
                onChange={(_, value) =>
                  controllerField.onChange(value ? (value as LookupOption).id : '')
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message as string}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                    data-testid={`field-${field.name}` as any}
                  />
                )}
              />
            )}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    <Box data-testid={schema.id as any}>
      {schema.title && (
        <Typography variant="h6" gutterBottom>
          {schema.title}
        </Typography>
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ '& > *': { mb: 2 } }}>
        {schema.fields.map((field) => renderField(field))}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
        <Button type="submit" variant="contained" data-testid={`${schema.id}-submit` as any}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
