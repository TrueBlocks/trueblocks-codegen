import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Fieldset,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { EventsEmit } from 'wailsjs/runtime/runtime';

export interface FormField {
  name?: string;
  value?: string | number | boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  rightSection?: ReactNode;
  hint?: string;
  visible?: boolean | ((formData: Record<string, unknown>) => boolean);
  objType?: string;
  type?:
    | 'text'
    | 'number'
    | 'password'
    | 'checkbox'
    | 'radio'
    | 'button'
    | 'textarea'
    | 'select';
  fields?: FormField[];
  isButtonGroup?: boolean;
  buttonAlignment?: 'left' | 'center' | 'right';
  customRender?: ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  sameLine?: boolean;
}

export interface FormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onSubmit: (e: FormEvent) => void;
  onBack?: () => void;
  onCancel?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  submitText?: string;
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
  initMode?: 'display' | 'edit' | 'wizard';
}

export const Form = ({
  title,
  description,
  fields,
  onSubmit,
  onBack,
  onCancel,
  onChange,
  submitText = 'Next',
  submitButtonRef,
  initMode = 'display',
}: FormProps) => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'display' | 'edit' | 'wizard'>(initMode);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const hasFocused = useRef(false);
  let firstEditableFieldRef: HTMLInputElement | null = null;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hasFocused.current && fields.length > 0 && firstInputRef.current) {
      firstInputRef.current.focus();
      hasFocused.current = true;
    }
  }, [fields]);

  useHotkeys(
    'mod+a',
    (e) => {
      const activeElement = document.activeElement as HTMLInputElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        activeElement.select();
        e.preventDefault();
      }
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    'enter',
    (e) => {
      EventsEmit('statusbar:log', 'Enter key pressed');
      const activeElement = document.activeElement as HTMLInputElement;
      if (mode === 'display') {
        e.preventDefault();
        setMode('edit');
        return;
      }
      if (mode === 'edit') {
        e.preventDefault();
        const submitButton =
          submitButtonRef?.current ||
          (activeElement
            ?.closest('form')
            ?.querySelector('button[type="submit"]') as HTMLButtonElement);
        if (submitButton) {
          submitButton.focus();
          submitButton.click();
        }
        return;
      }
      if (
        activeElement &&
        activeElement.tagName === 'INPUT' &&
        activeElement.closest('form')
      ) {
        e.preventDefault();
        const form = activeElement.closest('form') as HTMLFormElement;
        if (form) {
          const submitButton = form.querySelector(
            'button[type="submit"]',
          ) as HTMLButtonElement;
          if (submitButton) {
            submitButton.click();
          }
        }
      }
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    'esc',
    (e) => {
      e.preventDefault();
      if (mode === 'edit') {
        setMode('display');
      }
      onCancel?.();
    },
    { enableOnFormTags: true },
  );

  const handleEdit = () => {
    setMode('edit');
    if (firstEditableFieldRef) {
      firstEditableFieldRef.focus();
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMode('display');
    onSubmit(e);
  };

  const preprocessFields = (fields: FormField[]): FormField[] => {
    const acceptedFields: FormField[] = [];
    let currentGroup: FormField[] = [];

    fields.forEach((field, index) => {
      if (field.fields && field.fields.length > 0) {
        field.fields = preprocessFields(field.fields);
        acceptedFields.push(field);
        return;
      }

      if (currentGroup.length === 0 || field.sameLine) {
        currentGroup.push(field);
      }

      const nextField = fields[index + 1];
      if (!nextField || !nextField.sameLine) {
        if (currentGroup.length > 1) {
          acceptedFields.push(multiFieldLine(currentGroup, onChange));
        } else if (currentGroup[0]) {
          acceptedFields.push(currentGroup[0]);
          if (!firstEditableFieldRef && !currentGroup[0].readOnly) {
            firstEditableFieldRef = firstInputRef.current;
          }
        }
        currentGroup = [];
      }
    });

    return acceptedFields;
  };

  fields = preprocessFields(fields);

  const renderField = (field: FormField, index: number) => {
    if (field.fields && field.fields.length > 0) {
      return (
        <Fieldset key={field.label || index}>
          {field.label && <legend>{field.label}</legend>}
          <Stack>
            {field.fields.map((nestedField, nestedIndex) =>
              renderField(nestedField, nestedIndex),
            )}
          </Stack>
        </Fieldset>
      );
    }

    if (field.customRender) {
      return <div key={field.name || index}>{field.customRender}</div>;
    }

    if (mode === 'display') {
      return (
        <div key={field.name || index}>
          <Text size="sm" fw={500}>
            {field.label}: {field.value || 'N/A'}
          </Text>
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <div key={field.name || index}>
          <label>
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) =>
                field.onChange?.({
                  ...e,
                  target: {
                    ...e.target,
                    value: e.target.checked ? 'true' : 'false',
                  },
                })
              }
              name={field.name}
              readOnly={field.readOnly}
              disabled={field.readOnly}
              tabIndex={field.readOnly ? -1 : 0}
            />
            {field.label}
          </label>
          {field.hint && (
            <Text size="sm" c="dimmed">
              {field.hint}
            </Text>
          )}
          {!loading && field.error && (
            <Text size="sm" c="red">
              {field.error}
            </Text>
          )}
        </div>
      );
    }

    return (
      <div key={field.name || index}>
        <TextInput
          ref={index === 0 ? firstInputRef : undefined}
          label={field.label}
          placeholder={field.placeholder}
          withAsterisk={field.required}
          value={field.value as string}
          onChange={field.readOnly ? undefined : field.onChange || onChange}
          error={
            (!loading && field.error) ||
            (field.required && !field.value && `${field.label} is required`)
          }
          rightSection={field.rightSection}
          onBlur={field.onBlur}
          name={field.name}
          readOnly={field.readOnly}
          disabled={field.readOnly}
          tabIndex={field.readOnly ? -1 : 0}
        />
        {field.hint && (
          <Text size="sm" c="dimmed">
            {field.hint}
          </Text>
        )}
      </div>
    );
  };

  return (
    <Stack>
      {title && <Title order={3}>{title}</Title>}
      {description && <Text>{description}</Text>}
      <form onSubmit={mode === 'wizard' ? onSubmit : handleSave}>
        <Stack>
          {fields.map((field, index) => renderField(field, index))}
          <Group justify="flex-end" mt="md">
            {mode === 'display' && (
              <Button tabIndex={0} variant="outline" onClick={handleEdit}>
                Edit
              </Button>
            )}
            {mode === 'edit' && (
              <>
                <Button tabIndex={0} variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  tabIndex={0}
                  ref={submitButtonRef as React.RefObject<HTMLButtonElement>}
                >
                  Save
                </Button>
              </>
            )}
            {mode === 'wizard' && (
              <>
                {onBack && (
                  <Button tabIndex={0} variant="outline" onClick={onBack}>
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  tabIndex={0}
                  ref={submitButtonRef as React.RefObject<HTMLButtonElement>}
                >
                  {submitText}
                </Button>
              </>
            )}
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export const multiFieldLine = (
  fields: (FormField & { flex?: number })[],
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
): FormField => ({
  customRender: (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {fields.map((field) => (
        <TextInput
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          withAsterisk={field.required}
          value={field.value as string}
          onChange={field.readOnly ? undefined : field.onChange || onChange}
          error={field.error}
          rightSection={field.rightSection}
          onBlur={field.onBlur}
          name={field.name}
          readOnly={field.readOnly}
          style={{
            flex: field.flex || 1,
          }}
        />
      ))}
    </div>
  ),
});
