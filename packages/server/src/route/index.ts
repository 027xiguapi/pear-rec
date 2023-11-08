import {UserRoutes} from "./User"
import {RecordRoutes} from "./Record"

/**
 * All application routes.
 */
export const AppRoutes = [...UserRoutes, ...RecordRoutes];