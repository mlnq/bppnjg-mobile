import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

type PilgrimageDaySource = {
  totalDays: number;
} | null | undefined;

const PILGRIMAGE_START_MONTH_INDEX = 6;
const PILGRIMAGE_START_DAY = 30;
const PILGRIMAGE_END_MONTH_INDEX = 7;
const PILGRIMAGE_END_DAY = 12;
const PILGRIMAGE_DAY_BEFORE_START = 0;
const PILGRIMAGE_DAY_AFTER_END = 15;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function normalizeDate(value: Date) {
  const normalized = new Date(value);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

export type PilgrimageWindowState = 'before' | 'active' | 'after';

export function getPilgrimageWindowState(date = new Date()): PilgrimageWindowState {
  const dayNumber = getPilgrimageDayNumberFromDate(date);
  if (dayNumber === PILGRIMAGE_DAY_BEFORE_START) return 'before';
  if (dayNumber === PILGRIMAGE_DAY_AFTER_END) return 'after';
  return 'active';
}

export function usePilgrimageWindowState(): PilgrimageWindowState {
  const devDay = useSelector((state: RootState) => state.preferences.devSimulatedDayNumber);
  if (devDay === null) return getPilgrimageWindowState();
  if (devDay <= PILGRIMAGE_DAY_BEFORE_START) return 'before';
  if (devDay >= PILGRIMAGE_DAY_AFTER_END) return 'after';
  return 'active';
}

export function useEffectivePilgrimageDayNumber(): number {
  const devDay = useSelector((state: RootState) => state.preferences.devSimulatedDayNumber);
  if (devDay !== null) return devDay;
  return getPilgrimageDayNumberFromDate();
}

export function getPilgrimageDayNumberFromDate(date = new Date()) {
  const year = date.getFullYear();
  const currentDate = normalizeDate(date);
  const startDate = normalizeDate(new Date(year, PILGRIMAGE_START_MONTH_INDEX, PILGRIMAGE_START_DAY));
  const endDate = normalizeDate(new Date(year, PILGRIMAGE_END_MONTH_INDEX, PILGRIMAGE_END_DAY));

  if (currentDate < startDate) {
    return PILGRIMAGE_DAY_BEFORE_START;
  }

  if (currentDate > endDate) {
    return PILGRIMAGE_DAY_AFTER_END;
  }

  return Math.floor((currentDate.getTime() - startDate.getTime()) / DAY_IN_MS) + 1;
}

export function getCurrentPilgrimageDayNumber(data: PilgrimageDaySource) {
  if (!data) {
    return null;
  }

  return getPilgrimageDayNumberFromDate();
}

export function getCurrentPilgrimageDayFetchNumber(totalDays: number | null | undefined) {
  if (!totalDays) {
    return null;
  }

  return toFetchableDayNumber(getPilgrimageDayNumberFromDate(), totalDays);
}

function toFetchableDayNumber(dayNumber: number, totalDays: number) {
  if (dayNumber < 1) {
    return 1;
  }

  if (dayNumber > totalDays) {
    return totalDays;
  }

  return dayNumber;
}

export function useSelectedPilgrimageDay(data: PilgrimageDaySource) {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const devDay = useSelector((state: RootState) => state.preferences.devSimulatedDayNumber);
  const rawDayNumber = devDay !== null ? devDay : getPilgrimageDayNumberFromDate();
  const currentDayNumber = data ? rawDayNumber : null;
  const currentDayFetchNumber =
    data && currentDayNumber !== null
      ? toFetchableDayNumber(currentDayNumber, data.totalDays)
      : null;

  useEffect(() => {
    if (currentDayFetchNumber) {
      setSelectedDayNumber(currentDayFetchNumber);
    }
  }, [currentDayFetchNumber]);

  return {
    currentDayNumber,
    currentDayFetchNumber,
    selectedDayNumber,
    effectiveDayNumber: selectedDayNumber ?? currentDayFetchNumber,
    setSelectedDayNumber,
    resetToCurrentDay: () => {
      if (currentDayFetchNumber !== null) {
        setSelectedDayNumber(currentDayFetchNumber);
      }
    },
  };
}
