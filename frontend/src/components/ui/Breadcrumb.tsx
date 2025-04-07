import { Breadcrumbs, Text, Anchor } from '@mantine/core';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbItems = [
    { title: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { title: value.charAt(0).toUpperCase() + value.slice(1), path };
    }),
  ];

  const handleNavigate = (path: string) => {
    void navigate(path);
  };

  return (
    <Breadcrumbs separator=">" px="md" style={{ marginTop: '1rem' }}>
      {breadcrumbItems.map((item, index) => (
        <Anchor
          key={index}
          component="button"
          onClick={() => handleNavigate(item.path)}
          style={{ cursor: 'pointer' }}
        >
          <Text size="md">{item.title}</Text>
        </Anchor>
      ))}
    </Breadcrumbs>
  );
};
