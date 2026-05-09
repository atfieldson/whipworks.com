import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

/**
 * GalleryFilterBar
 *
 * Filter UI above the gallery grid. Five filter dimensions, each as a
 * dropdown trigger that opens a multi-select checkbox panel:
 *
 *   Type      → Bullwhip / Stockwhip / Snakewhip
 *   Length    → distinct lengths in the catalog, sorted numerically
 *   Color     → distinct primary + secondary colors
 *   Handle    → distinct handle pattern names
 *   Concho    → distinct concho names
 *
 * "Bullwhip" type is special: matches `bullwhip`, `fantasy`, AND
 * `specialty` cards because all current specialties are bullwhips
 * (see Phase 13.3 schema decision). The match logic itself lives in
 * gallery.tsx — this component only manages selection state.
 *
 * Selected filters render as removable gold chips below the dropdown
 * row. "Clear all" link resets every dimension at once. URL state
 * sync (read on mount, replace on change) is also driven from
 * gallery.tsx, not here — this component is presentational.
 *
 * Mobile (<560px): the dropdown row wraps; each trigger is full-width
 * within its line, panels open below their trigger. No drawer/modal
 * for now — keep the affordance simple, iterate after Adam reacts.
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type FilterState = {
  types: string[];
  lengths: string[];
  colors: string[];
  handles: string[];
  conchos: string[];
};

export const EMPTY_FILTER_STATE: FilterState = {
  types: [],
  lengths: [],
  colors: [],
  handles: [],
  conchos: [],
};

type FilterKey = keyof FilterState;

type FilterDimension = {
  key: FilterKey;
  label: string;
  options: string[];
};

type Props = {
  /** Available options per dimension — derived from the cards in
      gallery.tsx and passed in. Keeping this as a prop (not derived
      here) means the bar always shows the actual catalog values. */
  dimensions: FilterDimension[];
  /** Current filter state. Component is controlled by the parent. */
  filters: FilterState;
  /** Called when a checkbox toggles. Parent merges into state. */
  onToggle: (key: FilterKey, value: string) => void;
  /** Called when an active chip's × is clicked or "Clear all" hit. */
  onClearAll: () => void;
  /** Total card count after filters applied — shown next to chips. */
  matchCount: number;
};

// ─── Styled components ──────────────────────────────────────────────────

const Bar = styled.div`
  margin-bottom: 32px;
`;

const DropdownRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const DropdownWrapper = styled.div`
  position: relative;

  @media (max-width: 560px) {
    flex: 1 1 calc(50% - 5px);
    min-width: 140px;
  }
`;

const Trigger = styled.button<{ open: boolean; hasSelection: boolean }>`
  appearance: none;
  background-color: ${(p) =>
    p.open || p.hasSelection ? 'rgba(214, 168, 95, 0.12)' : 'transparent'};
  border: 1px solid
    ${(p) =>
      p.open || p.hasSelection
        ? '#d6a85f'
        : 'rgba(214, 168, 95, 0.32)'};
  color: #f5ebe0;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(214, 168, 95, 0.12);
    border-color: #d6a85f;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }

  @media (max-width: 560px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Caret = styled.span<{ open: boolean }>`
  font-size: 0.65rem;
  transition: transform 0.2s ease;
  transform: ${(p) => (p.open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: #d6a85f;
  color: #1a140f;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0;
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 50;
  min-width: 220px;
  max-height: 360px;
  overflow-y: auto;
  background-color: #1a140f;
  border: 1px solid rgba(214, 168, 95, 0.35);
  padding: 8px;
  /* Subtle gold-tinted scrollbar to match the lightbox thumb strip. */
  scrollbar-width: thin;
  scrollbar-color: rgba(214, 168, 95, 0.3) transparent;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(214, 168, 95, 0.3);
    border-radius: 3px;
  }

  @media (max-width: 560px) {
    /* Right-align panel so it doesn't overflow on narrow viewports
       when the trigger is on the right side of the row. */
    left: auto;
    right: 0;
    min-width: 100%;
  }
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.9rem;
  color: #f5ebe0;
  transition: background-color 0.15s ease;
  user-select: none;

  &:hover,
  &:focus-within {
    background-color: rgba(214, 168, 95, 0.1);
  }

  input[type='checkbox'] {
    /* Custom-styled checkbox: keep native semantics + keyboard, just
       restyle the visible square so it matches the dark theme. */
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(214, 168, 95, 0.5);
    background-color: transparent;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  input[type='checkbox']:checked {
    background-color: #d6a85f;
    border-color: #d6a85f;
  }
  input[type='checkbox']:checked::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 4px;
    width: 4px;
    height: 8px;
    border: solid #1a140f;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  input[type='checkbox']:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  align-items: center;
`;

const Chip = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 12px;
  background-color: rgba(214, 168, 95, 0.16);
  border: 1px solid rgba(214, 168, 95, 0.4);
  color: #f5ebe0;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(214, 168, 95, 0.28);
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }

  /* The × glyph — make it visually distinct so the chip's "removable"
     affordance is clear. */
  span.x {
    color: #d6a85f;
    font-size: 1rem;
    line-height: 1;
    font-family: 'Domine Variable', Domine, serif;
    margin-left: 2px;
  }
`;

const ClearAll = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  padding: 5px 4px;
  color: #d6a85f;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(214, 168, 95, 0.4);
  transition: color 0.2s ease, text-decoration-color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: #f5ebe0;
    text-decoration-color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 2px;
  }
`;

const MatchCount = styled.span`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: #f5ebe0;
  opacity: 0.6;
  margin-left: auto;
`;

// ─── Single dropdown component ──────────────────────────────────────────

type DropdownProps = {
  dimension: FilterDimension;
  selected: string[];
  onToggle: (value: string) => void;
  isOpen: boolean;
  onOpenToggle: () => void;
  onClose: () => void;
};

const FilterDropdown = ({
  dimension,
  selected,
  onToggle,
  isOpen,
  onOpenToggle,
  onClose,
}: DropdownProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Close on click outside the dropdown wrapper. Listen on
     mousedown so the close fires before the click bubbles to a button
     (which would re-open it). */
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen, onClose]);

  /* Esc closes the open dropdown. */
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const hasSelection = selected.length > 0;

  return (
    <DropdownWrapper ref={wrapperRef}>
      <Trigger
        type="button"
        open={isOpen}
        hasSelection={hasSelection}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={onOpenToggle}
      >
        <span>{dimension.label}</span>
        {hasSelection && <Count>{selected.length}</Count>}
        <Caret open={isOpen} aria-hidden>
          ▾
        </Caret>
      </Trigger>
      {isOpen && (
        <Panel role="listbox" aria-multiselectable="true">
          {dimension.options.length === 0 ? (
            <Option as="div" style={{ opacity: 0.5, cursor: 'default' }}>
              <span>No options available</span>
            </Option>
          ) : (
            dimension.options.map((option) => (
              <Option key={option}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                />
                <span>{option}</span>
              </Option>
            ))
          )}
        </Panel>
      )}
    </DropdownWrapper>
  );
};

// ─── Main filter bar component ──────────────────────────────────────────

const GalleryFilterBar = ({
  dimensions,
  filters,
  onToggle,
  onClearAll,
  matchCount,
}: Props) => {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);

  /* Aggregate all active filter chips across dimensions into a single
     flat list so the "active chips" row reads naturally regardless of
     which filter dimension contributed the value. Each chip carries
     its source dimension key so the click-to-remove handler knows
     where to toggle. */
  const activeChips: { key: FilterKey; value: string }[] = [];
  for (const dim of dimensions) {
    for (const v of filters[dim.key]) {
      activeChips.push({ key: dim.key, value: v });
    }
  }

  return (
    <Bar>
      <DropdownRow>
        {dimensions.map((dim) => (
          <FilterDropdown
            key={dim.key}
            dimension={dim}
            selected={filters[dim.key]}
            onToggle={(v) => onToggle(dim.key, v)}
            isOpen={openKey === dim.key}
            onOpenToggle={() =>
              setOpenKey((prev) => (prev === dim.key ? null : dim.key))
            }
            onClose={() => setOpenKey(null)}
          />
        ))}
      </DropdownRow>
      {(activeChips.length > 0 || matchCount === 0) && (
        <ChipsRow>
          {activeChips.map(({ key, value }) => (
            <Chip
              key={`${key}-${value}`}
              type="button"
              onClick={() => onToggle(key, value)}
              aria-label={`Remove ${value} filter`}
            >
              <span>{value}</span>
              <span className="x" aria-hidden>
                ×
              </span>
            </Chip>
          ))}
          {activeChips.length > 0 && (
            <ClearAll type="button" onClick={onClearAll}>
              Clear all
            </ClearAll>
          )}
          <MatchCount>
            {matchCount} {matchCount === 1 ? 'whip' : 'whips'}
          </MatchCount>
        </ChipsRow>
      )}
    </Bar>
  );
};

export default GalleryFilterBar;
