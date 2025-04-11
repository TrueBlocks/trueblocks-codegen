import React, { ReactNode } from 'react';

import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';

export interface FormField {
  name: string;
  value: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  rightSection?: ReactNode;
  hint?: string;
}

interface FormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
  loading?: boolean;
  submitText?: string;
}

export const Form: React.FC<FormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  onBack,
  loading = false,
  submitText = 'Next',
}) => {
  return (
    <Stack>
      <Title order={3}>{title}</Title>
      {description && <Text>{description}</Text>}
      <form onSubmit={onSubmit}>
        <Stack>
          {fields.map((field) => (
            <div key={field.name}>
              <TextInput
                label={field.label}
                placeholder={field.placeholder}
                withAsterisk={field.required}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.error}
                rightSection={field.rightSection}
              />
              {field.hint && (
                <Text size="sm" c="dimmed">
                  {field.hint}
                </Text>
              )}
            </div>
          ))}
          <Group justify="flex-end" mt="md">
            {onBack && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
              >
                Back
              </Button>
            )}
            <Button type="submit" loading={loading}>
              {submitText}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};
