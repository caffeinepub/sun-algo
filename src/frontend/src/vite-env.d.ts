/// <reference types="vite/client" />

// Compatibility shim declarations for react-router-dom
// This project uses @tanstack/react-router but some files import from react-router-dom
declare module "react-router-dom" {
  import type * as React from "react";

  export interface BrowserRouterProps {
    children?: React.ReactNode;
    basename?: string;
  }
  export function BrowserRouter(props: BrowserRouterProps): React.ReactElement;

  export interface RoutesProps {
    children?: React.ReactNode;
    location?: unknown;
  }
  export function Routes(props: RoutesProps): React.ReactElement | null;

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    index?: boolean;
    children?: React.ReactNode;
  }
  export function Route(props: RouteProps): React.ReactElement | null;

  export interface NavLinkRenderProps {
    isActive: boolean;
    isPending: boolean;
  }
  export interface NavLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
    to: string;
    children?:
      | React.ReactNode
      | ((props: NavLinkRenderProps) => React.ReactNode);
    className?: string | ((props: NavLinkRenderProps) => string | undefined);
    end?: boolean;
  }
  export function NavLink(props: NavLinkProps): React.ReactElement;

  export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    children?: React.ReactNode;
  }
  export function Link(props: LinkProps): React.ReactElement;

  export interface OutletProps {
    context?: unknown;
  }
  export function Outlet(props?: OutletProps): React.ReactElement | null;

  export interface NavigateProps {
    to: string;
    replace?: boolean;
    state?: unknown;
  }
  export function Navigate(props: NavigateProps): null;

  export type NavigateFunction = (
    to: string,
    options?: { replace?: boolean; state?: unknown },
  ) => void;
  export function useNavigate(): NavigateFunction;

  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  }
  export function useLocation(): Location;

  export function useParams<
    P extends Record<string, string | undefined> = Record<
      string,
      string | undefined
    >,
  >(): P;
}
