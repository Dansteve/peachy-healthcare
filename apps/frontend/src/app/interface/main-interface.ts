import { ComponentRef } from '@ionic/core/dist/types/interface';

export interface DynamicComponent<T extends ComponentRef = ComponentRef> {
  id?: number;
  title?: string;
  image?: string;
  component?: any | T;
  type?: string;
  order?: number;
  status?: any;
  created_at?: string;
  updated_at?: string;
  [key: string | symbol]: any;
}
