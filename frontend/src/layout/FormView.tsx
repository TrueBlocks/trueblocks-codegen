import { Form, FormProps } from '@components';
import { Container, Tabs } from '@mantine/core';

export interface Tab {
  label: string;
  fields: FormProps['fields'];
}

export const FormView = ({
  tabs,
  title,
  description,
  onSubmit,
  onChange,
}: {
  tabs: Tab[];
  title?: string;
  description?: string;
  onSubmit: FormProps['onSubmit'];
  onChange?: FormProps['onChange'];
}) => {
  return (
    <Container
      size="md"
      mt="xl"
      style={{
        backgroundColor: '#1a1a1a',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <Tabs defaultValue="tab-0">
        <Tabs.List>
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index} value={`tab-${index}`}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map((tab, index) => (
          <Tabs.Panel key={index} value={`tab-${index}`}>
            <Form
              title={title}
              description={description}
              fields={tab.fields}
              onSubmit={onSubmit}
              onChange={onChange}
              submitText="Save"
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  );
};
