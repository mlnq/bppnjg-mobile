declare module 'lucide-react-native/dist/esm/icons/*.mjs' {
  import type { ComponentType } from 'react';

  type LucideIconProps = {
    color?: string;
    size?: number;
    strokeWidth?: number;
  };

  const Icon: ComponentType<LucideIconProps>;
  export default Icon;
}
