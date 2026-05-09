/**
 * Designer prefill — gallery → designer query-param protocol.
 *
 * Phase 13.7 of the Gallery Page work plan. The gallery's lightbox CTA
 * for custom whips ("Build this Bullwhip →" / "Build this Stockwhip →"
 * / "Build this Snakewhip →") navigates to the relevant designer page
 * with the whip's full configuration encoded as URL query params. The
 * designer page reads those params on mount and pre-selects matching
 * options in its form state, so the user lands on a designer with
 * exactly the clicked whip's configuration ready to add to cart —
 * one click from gallery to ready-to-buy.
 *
 * Specialty whips bypass this entirely: their CTA goes to
 * `/specialty/:slug`, which is a pre-configured product page, not a
 * customizer. Only custom (non-specialty) whips use the prefill
 * protocol.
 *
 * Backwards-compatibility: direct visits to `/design-bullwhip` with no
 * query string still work unchanged — the parsers return empty
 * objects, and the designer's `?? <existing default>` fallbacks
 * preserve the prior initial state.
 *
 * Validation: every parsed value is checked against its option
 * constants list (spools / handles / conchos / collars / heelLoops /
 * length lists / finishes). Invalid values are silently skipped,
 * keeping the form usable even if the URL was hand-edited or carries
 * a value the designer doesn't support (e.g. snakewhip whose concho
 * is the not-yet-listed "Shield" — the prefill skips concho and the
 * user picks from available options).
 */

import { spools } from './constants/spoolColors';
import { handles } from './constants/handleDesigns';
import { conchos } from './constants/conchos';
import { collars } from './constants/collars';
import { heelLoops } from './constants/heelLoops';
import { whipLengths } from './constants/whipLengths';
import { handleLengths } from './constants/handleLengths';
import { thongLengths } from './constants/thongLengths';
import { stockwhipHandleLengths } from './constants/stockwhipHandleLengths';
import { stockwhipFinishes } from './constants/stockwhipFinishes';
import { snakewhipLengths } from './constants/snakewhipLengths';

// ─── Validation helper ──────────────────────────────────────────────────

/** Type-guard returning true when `value` matches the `name` of any
    item in `list`. All option constants in this designer (spools,
    handles, conchos, etc.) are arrays of objects with a `name` field
    — so a single helper covers every list. */
const isValidOption = (
  value: string | null | undefined,
  list: { name: string }[],
): value is string => {
  if (!value) return false;
  return list.some((item) => item.name === value);
};

/** Boolean parser tolerant of common URL representations. */
const parseBool = (value: string | null): boolean | undefined => {
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
};

// ─── Bullwhip ───────────────────────────────────────────────────────────
// Used for both true bullwhips and fantasy whips (FW33-style — those
// also configure via the bullwhip designer; their `heelLoop: 'None'`
// just becomes "no heel loop param" after caller normalization).

export type BullwhipPrefillSpecs = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  handleDesign?: string | null;
  whipLength?: string | null;
  handleLength?: string | null;
  concho?: string | null;
  collar?: string | null;
  heelLoop?: string | null;
  waxed?: boolean | null;
};

export type BullwhipPrefillState = {
  primary?: string;
  secondary?: string;
  handleDesign?: string;
  whipLength?: string;
  handleLength?: string;
  concho?: string;
  collar?: string;
  heelLoop?: string;
  waxed?: boolean;
};

export const serializeBullwhipPrefill = (
  specs: BullwhipPrefillSpecs,
): string => {
  const params = new URLSearchParams();
  if (specs.primaryColor) params.set('primary', specs.primaryColor);
  if (specs.secondaryColor) params.set('secondary', specs.secondaryColor);
  if (specs.handleDesign) params.set('handle', specs.handleDesign);
  if (specs.whipLength) params.set('whipLength', specs.whipLength);
  if (specs.handleLength) params.set('handleLength', specs.handleLength);
  if (specs.concho) params.set('concho', specs.concho);
  if (specs.collar) params.set('collar', specs.collar);
  if (specs.heelLoop) params.set('heelLoop', specs.heelLoop);
  if (typeof specs.waxed === 'boolean') {
    params.set('waxed', String(specs.waxed));
  }
  return params.toString();
};

export const parseBullwhipPrefill = (search: string): BullwhipPrefillState => {
  const params = new URLSearchParams(search || '');
  const result: BullwhipPrefillState = {};

  const primary = params.get('primary');
  if (isValidOption(primary, spools)) result.primary = primary;

  const secondary = params.get('secondary');
  if (isValidOption(secondary, spools)) result.secondary = secondary;

  const handle = params.get('handle');
  if (isValidOption(handle, handles)) result.handleDesign = handle;

  const whipLength = params.get('whipLength');
  if (isValidOption(whipLength, whipLengths)) result.whipLength = whipLength;

  const handleLength = params.get('handleLength');
  if (isValidOption(handleLength, handleLengths)) {
    result.handleLength = handleLength;
  }

  const concho = params.get('concho');
  if (isValidOption(concho, conchos)) result.concho = concho;

  const collar = params.get('collar');
  if (isValidOption(collar, collars)) result.collar = collar;

  const heelLoop = params.get('heelLoop');
  if (isValidOption(heelLoop, heelLoops)) result.heelLoop = heelLoop;

  const waxed = parseBool(params.get('waxed'));
  if (waxed !== undefined) result.waxed = waxed;

  return result;
};

// ─── Stockwhip ──────────────────────────────────────────────────────────

export type StockwhipPrefillSpecs = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  handleDesign?: string | null;
  thongLength?: string | null;
  handleLength?: string | null;
  handleFinish?: string | null;
  concho?: string | null;
  heelLoop?: string | null;
  waxed?: boolean | null;
};

export type StockwhipPrefillState = {
  primary?: string;
  secondary?: string;
  handleDesign?: string;
  thongLength?: string;
  handleLength?: string;
  handleFinish?: string;
  concho?: string;
  heelLoop?: string;
  waxed?: boolean;
};

export const serializeStockwhipPrefill = (
  specs: StockwhipPrefillSpecs,
): string => {
  const params = new URLSearchParams();
  if (specs.primaryColor) params.set('primary', specs.primaryColor);
  if (specs.secondaryColor) params.set('secondary', specs.secondaryColor);
  if (specs.handleDesign) params.set('handle', specs.handleDesign);
  if (specs.thongLength) params.set('thongLength', specs.thongLength);
  if (specs.handleLength) params.set('handleLength', specs.handleLength);
  if (specs.handleFinish) params.set('finish', specs.handleFinish);
  if (specs.concho) params.set('concho', specs.concho);
  if (specs.heelLoop) params.set('heelLoop', specs.heelLoop);
  if (typeof specs.waxed === 'boolean') {
    params.set('waxed', String(specs.waxed));
  }
  return params.toString();
};

export const parseStockwhipPrefill = (
  search: string,
): StockwhipPrefillState => {
  const params = new URLSearchParams(search || '');
  const result: StockwhipPrefillState = {};

  const primary = params.get('primary');
  if (isValidOption(primary, spools)) result.primary = primary;

  const secondary = params.get('secondary');
  if (isValidOption(secondary, spools)) result.secondary = secondary;

  /* StockwhipDesigner restricts handles to a subset (excludes Accent
     and Web of Wyrd) but for prefill we accept any handle in the
     full list — the rendered picker just won't display the selection
     if it's restricted. Better than dropping a valid-looking value. */
  const handle = params.get('handle');
  if (isValidOption(handle, handles)) result.handleDesign = handle;

  const thongLength = params.get('thongLength');
  if (isValidOption(thongLength, thongLengths)) {
    result.thongLength = thongLength;
  }

  const handleLength = params.get('handleLength');
  if (isValidOption(handleLength, stockwhipHandleLengths)) {
    result.handleLength = handleLength;
  }

  const finish = params.get('finish');
  if (isValidOption(finish, stockwhipFinishes)) {
    result.handleFinish = finish;
  }

  /* Stockwhips exclude pommel conchos but we allow any concho here;
     the designer's option list will only present the valid ones. */
  const concho = params.get('concho');
  if (isValidOption(concho, conchos)) result.concho = concho;

  const heelLoop = params.get('heelLoop');
  if (isValidOption(heelLoop, heelLoops)) result.heelLoop = heelLoop;

  const waxed = parseBool(params.get('waxed'));
  if (waxed !== undefined) result.waxed = waxed;

  return result;
};

// ─── Snakewhip ──────────────────────────────────────────────────────────

export type SnakewhipPrefillSpecs = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  handleDesign?: string | null;
  whipLength?: string | null;
  concho?: string | null;
  heelLoop?: string | null;
  waxed?: boolean | null;
};

export type SnakewhipPrefillState = {
  primary?: string;
  secondary?: string;
  handleDesign?: string;
  whipLength?: string;
  concho?: string;
  heelLoop?: string;
  waxed?: boolean;
};

export const serializeSnakewhipPrefill = (
  specs: SnakewhipPrefillSpecs,
): string => {
  const params = new URLSearchParams();
  if (specs.primaryColor) params.set('primary', specs.primaryColor);
  if (specs.secondaryColor) params.set('secondary', specs.secondaryColor);
  if (specs.handleDesign) params.set('handle', specs.handleDesign);
  if (specs.whipLength) params.set('whipLength', specs.whipLength);
  if (specs.concho) params.set('concho', specs.concho);
  if (specs.heelLoop) params.set('heelLoop', specs.heelLoop);
  if (typeof specs.waxed === 'boolean') {
    params.set('waxed', String(specs.waxed));
  }
  return params.toString();
};

export const parseSnakewhipPrefill = (
  search: string,
): SnakewhipPrefillState => {
  const params = new URLSearchParams(search || '');
  const result: SnakewhipPrefillState = {};

  const primary = params.get('primary');
  if (isValidOption(primary, spools)) result.primary = primary;

  const secondary = params.get('secondary');
  if (isValidOption(secondary, spools)) result.secondary = secondary;

  /* SnakewhipDesigner adds a "Herringbone" handle option that isn't in
     the standard handles array (it's prepended explicitly in the
     designer). Accept it as a valid handle alongside the standard
     list so SnW1/SnW2/SnW29 (all herringbone) prefill correctly. */
  const handle = params.get('handle');
  if (handle === 'Herringbone' || isValidOption(handle, handles)) {
    result.handleDesign = handle ?? undefined;
  }

  const whipLength = params.get('whipLength');
  if (isValidOption(whipLength, snakewhipLengths)) {
    result.whipLength = whipLength;
  }

  /* Snakewhips exclude pommel conchos but we allow any here. */
  const concho = params.get('concho');
  if (isValidOption(concho, conchos)) result.concho = concho;

  const heelLoop = params.get('heelLoop');
  if (isValidOption(heelLoop, heelLoops)) result.heelLoop = heelLoop;

  const waxed = parseBool(params.get('waxed'));
  if (waxed !== undefined) result.waxed = waxed;

  return result;
};
