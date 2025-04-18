import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { GetOrgPreferences, Logger, SetOrgPreferences } from '@app';
import { types } from '@models';
import { EventsEmit } from 'wailsjs/runtime/runtime';

import { FormView } from '../layout/FormView';

export const SettingsOrg = () => {
  const [formData, setFormData] = useState<types.OrgPreferences>({});

  useEffect(() => {
    GetOrgPreferences().then((data) => {
      setFormData(data);
    });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    SetOrgPreferences(formData).then(() => {});
    EventsEmit(
      'statusbar:log',
      `your edits were saved: ${JSON.stringify(formData)}`,
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    Logger(`Field changed: ${name}, New value: ${JSON.stringify(value)}`);
  };

  const tabs = [
    {
      label: 'Organization',
      fields: [
        {
          name: 'developerName',
          value: formData['developerName'] || '',
          label: 'Organization Name',
          placeholder: 'Enter your organization name',
          required: true,
        },
        {
          name: 'supportUrl',
          value: formData['supportUrl'] || '',
          label: 'Support',
          placeholder: 'Enter your organization support url',
          required: true,
        },
        {
          label: 'Options',
          fields: [
            {
              name: 'language',
              value: formData['language'] || '',
              label: 'Language',
              placeholder: 'Enter your language',
              required: true,
            },
            {
              name: 'theme',
              value: formData['theme'] || '',
              label: 'Theme',
              placeholder: 'Enter your theme',
              required: true,
              sameLine: true,
            },
            {
              name: 'telemetry',
              value: formData['telemetry'] || '',
              label: 'Telemetry',
              placeholder: 'Enter your telemetry',
              sameLine: true,
            },
            {
              name: 'logLevel',
              value: formData['logLevel'] || '',
              label: 'Log Level',
              placeholder: 'Enter your log level',
              required: true,
            },
            {
              name: 'experimental',
              value: formData['experimental'] || '',
              label: 'Experimental',
              placeholder: 'Enter your experimental',
              sameLine: true,
            },
            {
              name: 'version',
              value: formData['version'] || '',
              label: 'Version',
              placeholder: 'Enter your version',
              required: true,
              readOnly: true,
              sameLine: true,
            },
          ],
        },
      ],
    },
  ];

  return (
    <FormView
      title="Edit / Manage Your Settings"
      tabs={tabs}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
