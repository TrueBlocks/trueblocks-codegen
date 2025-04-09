import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { useLocation } from 'wouter';

export const Breadcrumb = () => {
  const [location, navigate] = useLocation();
  const inWizard = location.startsWith('/wizard');

  const pathnames = location.split('/').filter((x) => x);
  const breadcrumbItems = [
    { title: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { title: value.charAt(0).toUpperCase() + value.slice(1), path };
    }),
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Breadcrumbs separator=">" px="md" style={{ marginTop: '1rem' }}>
      {breadcrumbItems.map((item, index) => {
        const isHome = index === 0;
        const disabled = isHome && inWizard;
        if (disabled) {
          return (
            <Text key={0} size="md">
              Home
            </Text>
          );
        }

        return (
          <Anchor
            key={index}
            component="button"
            onClick={() => {
              if (!disabled) handleNavigate(item.path);
            }}
            style={{
              cursor: disabled ? 'default' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
            }}
          >
            <Text size="md">{item.title}</Text>
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
};
