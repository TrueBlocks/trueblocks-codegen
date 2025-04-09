import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { useLocation } from 'wouter';

export const Breadcrumb = () => {
  const [location, navigate] = useLocation();

  const pathnames = location.split('/').filter((x) => x);
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
