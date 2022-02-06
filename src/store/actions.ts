export const COLLAPSE_MENU = 'COLLAPSE_MENU';
export const COLLAPSE_TOGGLE = 'COLLAPSE_TOGGLE';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
export const CHANGE_SUB_LAYOUT = 'CHANGE_SUB_LAYOUT';
export const LAYOUT_TYPE = 'LAYOUT_TYPE';
export const RESET = 'RESET';
export const NAV_BACK_COLOR = 'NAV_BACK_COLOR';
export const NAV_BRAND_COLOR = 'NAV_BRAND_COLOR';
export const HEADER_BACK_COLOR = 'HEADER_BACK_COLOR';
export const RTL_LAYOUT = 'RTL_LAYOUT';
export const NAV_FIXED_LAYOUT = 'NAV_FIXED_LAYOUT';
export const HEADER_FIXED_LAYOUT = 'HEADER_FIXED_LAYOUT';
export const FULL_WIDTH_LAYOUT = 'FULL_WIDTH_LAYOUT';
export const NAV_CONTENT_LEAVE = 'NAV_CONTENT_LEAVE';
export const NAV_COLLAPSE_LEAVE = 'NAV_COLLAPSE_LEAVE';


export type ACTIONTYPE =
    | { type: typeof COLLAPSE_MENU }
    | { type: typeof COLLAPSE_TOGGLE; menu: { id: string; type: string } }
    | { type: typeof CHANGE_LAYOUT; layout: string }
    | { type: typeof CHANGE_SUB_LAYOUT; subLayout: string }
    | { type: typeof LAYOUT_TYPE; layoutType: string }
    | { type: typeof RESET; layoutType: string }
    | { type: typeof NAV_BACK_COLOR }
    | { type: typeof NAV_BRAND_COLOR; payload }
    | { type: typeof HEADER_BACK_COLOR; headerBackColor: string }
    | { type: typeof RTL_LAYOUT }
    | { type: typeof NAV_FIXED_LAYOUT }
    | { type: typeof HEADER_FIXED_LAYOUT }
    | { type: typeof FULL_WIDTH_LAYOUT }
    | { type: typeof NAV_CONTENT_LEAVE }
    | { type: typeof NAV_COLLAPSE_LEAVE; menu: { id: string; type: string } };
