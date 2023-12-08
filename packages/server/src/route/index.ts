import { UserRoutes } from './User';
import { RecordRoutes } from './Record';
import { SettingRoutes } from './Setting';

/**
 * All application routes.
 */
export const AppRoutes = [...UserRoutes, ...RecordRoutes, ...SettingRoutes];
